import { MOCK_VIDEOS } from '../data/mockVideos.js';

const BATCH_CACHE_STORAGE_KEY = 'que-veo-hoy:api-batch-cache:v1';
const BATCH_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 horas
const MAX_CACHED_QUERIES = 20;

/**
 * Normaliza texto eliminando tildes y pasando a minúsculas para búsquedas sin fricción.
 */
function normalizeText(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function normalizeVideoShape(video) {
  return {
    ...video,
    channelTitle: video.channelTitle || video.channel || 'YouTube',
    durationFormatted: video.durationFormatted || video.duration || '00:00',
    thumbnail:
      video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
  };
}

function buildFilterCacheKey({ duration, vibes, topic, language }) {
  const sortedVibes = [...(vibes || [])].sort().join(',');
  const cleanTopic = normalizeText(topic || '');
  return `${duration}::${sortedVibes || 'all'}::${cleanTopic || 'none'}::${language}`;
}

function readBatchCacheStore() {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  try {
    const raw = window.localStorage.getItem(BATCH_CACHE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeBatchCacheStore(store) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    // Limpiar entradas expiradas y limitar tamaño
    const now = Date.now();
    const validEntries = Object.entries(store)
      .filter(([, entry]) => entry && now - entry.timestamp < BATCH_CACHE_TTL_MS)
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
      .slice(0, MAX_CACHED_QUERIES);

    window.localStorage.setItem(
      BATCH_CACHE_STORAGE_KEY,
      JSON.stringify(Object.fromEntries(validEntries))
    );
  } catch {
    // Ignorar errores de cuota de localStorage
  }
}

function getCachedBatch(filterKey) {
  const store = readBatchCacheStore();
  const entry = store[filterKey];
  if (!entry || !Array.isArray(entry.videos)) return null;
  if (Date.now() - entry.timestamp >= BATCH_CACHE_TTL_MS) {
    return null;
  }
  return entry.videos.map(normalizeVideoShape);
}

function saveCachedBatch(filterKey, videos) {
  const store = readBatchCacheStore();
  store[filterKey] = {
    timestamp: Date.now(),
    videos: videos.map(normalizeVideoShape),
  };
  writeBatchCacheStore(store);
}

function matchesTopic(video, normalizedTopic) {
  if (!normalizedTopic) return true;
  const haystack = normalizeText(
    `${video.title} ${video.channelTitle || video.channel || ''} ${(video.tags || []).join(' ')}`
  );
  const tokens = normalizedTopic.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

function shuffleList(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Fallback local usando mockVideos.js cuando falta API Key, hay error de red o quotaExceeded.
 */
function recommendFromMock({
  duration = '10-20',
  vibes = [],
  topic = '',
  language = 'both',
  excludeIds = [],
  seenIds = [],
  limit = 3,
  isOfflineFallback = true,
  offlineReason = 'Mostrando selección curada offline',
}) {
  const seenSet = new Set(seenIds);
  const excludeSet = new Set([...seenIds, ...excludeIds]);
  const normalizedTopic = normalizeText(topic);

  const unseenPool = MOCK_VIDEOS.map(normalizeVideoShape).filter(
    (v) => !seenSet.has(v.id)
  );

  if (unseenPool.length === 0) {
    return {
      videos: [],
      totalMatching: 0,
      isRelaxed: false,
      isOfflineFallback,
      exhaustedAll: true,
      fallbackNote: isOfflineFallback ? offlineReason : null,
    };
  }

  const matchesStrict = (video) => {
    if (excludeSet.has(video.id)) return false;
    if (video.durationRange !== duration) return false;
    if (language !== 'both' && video.language !== language) return false;
    if (vibes.length > 0 && !vibes.includes(video.category)) return false;
    if (!matchesTopic(video, normalizedTopic)) return false;
    return true;
  };

  let strictMatches = shuffleList(unseenPool.filter(matchesStrict));

  if (strictMatches.length === 0 && excludeIds.length > 0) {
    strictMatches = shuffleList(
      unseenPool.filter((video) => {
        if (video.durationRange !== duration) return false;
        if (language !== 'both' && video.language !== language) return false;
        if (vibes.length > 0 && !vibes.includes(video.category)) return false;
        if (!matchesTopic(video, normalizedTopic)) return false;
        return true;
      })
    );
  }

  if (strictMatches.length >= limit) {
    return {
      videos: strictMatches.slice(0, limit),
      totalMatching: strictMatches.length,
      isRelaxed: false,
      isOfflineFallback,
      exhaustedAll: false,
      fallbackNote: isOfflineFallback ? offlineReason : null,
    };
  }

  const selected = [...strictMatches];
  const pickedIds = new Set(selected.map((v) => v.id));

  const relaxedCandidates = shuffleList(
    unseenPool.filter((video) => {
      if (pickedIds.has(video.id) || excludeSet.has(video.id)) return false;
      if (language !== 'both' && video.language !== language) return false;
      if (vibes.length > 0 && !vibes.includes(video.category)) return false;
      return true;
    })
  );

  for (const candidate of relaxedCandidates) {
    if (selected.length >= limit) break;
    selected.push(candidate);
    pickedIds.add(candidate.id);
  }

  if (selected.length < limit) {
    const broadCandidates = shuffleList(
      unseenPool.filter((video) => {
        if (pickedIds.has(video.id)) return false;
        if (language !== 'both' && video.language !== language) return false;
        return true;
      })
    );
    for (const candidate of broadCandidates) {
      if (selected.length >= limit) break;
      selected.push(candidate);
      pickedIds.add(candidate.id);
    }
  }

  if (selected.length < limit) {
    const anyRemaining = shuffleList(
      unseenPool.filter((video) => !pickedIds.has(video.id))
    );
    for (const candidate of anyRemaining) {
      if (selected.length >= limit) break;
      selected.push(candidate);
      pickedIds.add(candidate.id);
    }
  }

  return {
    videos: selected.slice(0, limit),
    totalMatching: strictMatches.length,
    isRelaxed: strictMatches.length < selected.length,
    isOfflineFallback,
    exhaustedAll: false,
    fallbackNote: isOfflineFallback ? offlineReason : null,
  };
}

/**
 * Selecciona `limit` videos no vistos de un lote cacheado sin repetir los `excludeIds`
 * salvo que queden pocos no vistos y toque rotar entre ellos.
 */
function pickFromBatch(batchVideos, { seenIds = [], excludeIds = [], limit = 3 }) {
  const seenSet = new Set(seenIds);
  const excludeSet = new Set(excludeIds);

  const unseen = batchVideos.filter((v) => !seenSet.has(v.id));
  const fresh = unseen.filter((v) => !excludeSet.has(v.id));

  if (fresh.length >= limit) {
    return { videos: fresh.slice(0, limit), hasMoreUnseen: fresh.length > limit };
  }

  // Si hay no vistos pero estaban en pantalla justo antes, completamos rotando dentro del lote
  if (unseen.length > 0 && fresh.length > 0) {
    const picked = [...fresh];
    const pickedIds = new Set(picked.map((v) => v.id));
    for (const item of unseen) {
      if (picked.length >= limit) break;
      if (!pickedIds.has(item.id)) {
        picked.push(item);
        pickedIds.add(item.id);
      }
    }
    return { videos: picked.slice(0, limit), hasMoreUnseen: false };
  }

  return { videos: fresh.slice(0, limit), hasMoreUnseen: false };
}

/**
 * Llama al endpoint real `/api/recommend` (YouTube Data API v3).
 */
async function requestApiBatch({ duration, vibes, topic, language }) {
  const response = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      durationRange: duration,
      category: vibes,
      customQuery: topic,
      language,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(payload?.message || 'Error al consultar /api/recommend');
    err.status = response.status;
    err.code = payload?.error;
    throw err;
  }

  return Array.isArray(payload?.videos)
    ? payload.videos.map(normalizeVideoShape)
    : [];
}

/**
 * Obtiene 3 recomendaciones usando primero el caché de 6h en localStorage (0 unidades de API)
 * y consultando /api/recommend solo cuando no hay caché válido o se agotan los no vistos.
 * Si falta API key, falla la red o se excede la cuota (403 quotaExceeded), cae a mockVideos.js.
 */
export async function recommendVideos({
  duration = '10-20',
  vibes = [],
  topic = '',
  language = 'both',
  excludeIds = [],
  seenIds = [],
  limit = 3,
} = {}) {
  const filterKey = buildFilterCacheKey({ duration, vibes, topic, language });
  const seenSet = new Set(seenIds);

  // 1. Revisar caché local de 6h (0 unidades de API)
  const cachedBatch = getCachedBatch(filterKey);
  if (cachedBatch && cachedBatch.length > 0) {
    const unseenInCache = cachedBatch.filter((v) => !seenSet.has(v.id));
    const { videos } = pickFromBatch(cachedBatch, { seenIds, excludeIds, limit });

    // Si aún hay suficientes no vistos (o al menos uno nuevo fuera de los ya mostrados)
    const hasFreshCandidate = unseenInCache.some((v) => !excludeIds.includes(v.id));
    if (videos.length >= Math.min(limit, unseenInCache.length) && hasFreshCandidate) {
      return {
        videos,
        totalMatching: unseenInCache.length,
        isRelaxed: false,
        isOfflineFallback: false,
        exhaustedAll: false,
        fallbackNote: null,
        fromCache: true,
      };
    }
  }

  // 2. Consultar /api/recommend (YouTube Data API v3)
  try {
    const apiBatch = await requestApiBatch({ duration, vibes, topic, language });

    if (apiBatch.length > 0) {
      saveCachedBatch(filterKey, apiBatch);
      const { videos } = pickFromBatch(apiBatch, { seenIds, excludeIds, limit });

      if (videos.length > 0) {
        return {
          videos,
          totalMatching: apiBatch.length,
          isRelaxed: false,
          isOfflineFallback: false,
          exhaustedAll: false,
          fallbackNote: null,
          fromCache: false,
        };
      }
    }

    // Si la API respondió vacío tras el filtro estricto de segundos o ya estaban todos vistos
    return recommendFromMock({
      duration,
      vibes,
      topic,
      language,
      excludeIds,
      seenIds,
      limit,
      isOfflineFallback: true,
      offlineReason: 'Mostrando selección curada offline',
    });
  } catch {
    // 3. Fallback automático por falta de API key, error de red o 403 quotaExceeded
    return recommendFromMock({
      duration,
      vibes,
      topic,
      language,
      excludeIds,
      seenIds,
      limit,
      isOfflineFallback: true,
      offlineReason: 'Mostrando selección curada offline',
    });
  }
}

/**
 * Obtiene un único video de reemplazo al pulsar "Descartar".
 * Prioriza 100% el lote cacheado para consumir 0 unidades de API.
 */
export async function fetchReplacementVideo(params) {
  const result = await recommendVideos({ ...params, limit: 1 });
  return {
    video: result.videos[0] || null,
    isRelaxed: result.isRelaxed,
    isOfflineFallback: result.isOfflineFallback,
    exhaustedAll: result.exhaustedAll,
    fallbackNote: result.fallbackNote,
  };
}
