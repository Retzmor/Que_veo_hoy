/**
 * Vercel Serverless Function & Dev Middleware handler para /api/recommend.
 * Consulta YouTube Data API v3 cuidando cuota (100u search.list + 1u videos.list),
 * valida parámetros de entrada y evita exponer detalles internos o API keys.
 */

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

const ALLOWED_CATEGORIES = new Set([
  'curiosidades',
  'historias',
  'tecnologia',
  'comedia',
  'documental',
]);

const DURATION_BOUNDS = {
  '5-10': { min: 300, max: 600, apiParam: 'medium' },
  '10-20': { min: 601, max: 1200, apiParam: 'medium' },
  '20-35': { min: 1201, max: 2100, apiParam: 'long' },
};

const CATEGORY_QUERIES = {
  curiosidades: {
    es: [
      'divulgación científica curiosidades física universo -shorts',
      'ciencia explicada experimentos paradojas historia -shorts',
    ],
    en: [
      'science explained curiosity physics space documentary -shorts',
      'mind blowing science facts video essay -shorts',
    ],
    both: [
      'science explained | divulgación científica curiosidades -shorts',
      'physics space curiosity | ciencia universo explicado -shorts',
    ],
  },
  historias: {
    es: [
      'misterios historia narrada relatos reales ensayo -shorts',
      'historias increíbles enigmas resueltos documental -shorts',
    ],
    en: [
      'mystery documentary storytelling video essay -shorts',
      'unsolved mystery deep dive true story -shorts',
    ],
    both: [
      'mystery storytelling | historias misterios narrados -shorts',
      'true story deep dive | historia enigma documental -shorts',
    ],
  },
  tecnologia: {
    es: [
      'tecnología programación inteligencia artificial videojuegos análisis -shorts',
      'ingeniería software hardware videojuegos historia -shorts',
    ],
    en: [
      'technology engineering deep dive gaming video essay -shorts',
      'programming AI hardware review breakdown -shorts',
    ],
    both: [
      'tech deep dive | tecnología análisis videojuegos -shorts',
      'engineering gaming essay | programación hardware -shorts',
    ],
  },
  comedia: {
    es: [
      'monólogo stand up comedia entrevista divertida charla -shorts',
      'comedia anécdotas podcast divertido monólogo -shorts',
    ],
    en: [
      'stand up comedy late night funny interview -shorts',
      'comedy storytelling talk show funny segment -shorts',
    ],
    both: [
      'stand up comedy | monólogo comedia charla -shorts',
      'funny interview story | comedia anécdotas -shorts',
    ],
  },
  documental: {
    es: [
      'mini documental investigación reportaje historia real -shorts',
      'documental corto geopolítica sociedad crónicas -shorts',
    ],
    en: [
      'short documentary investigative journalism mini doc -shorts',
      'mini documentary geopolitics culture explained -shorts',
    ],
    both: [
      'mini documentary | mini documental reportaje -shorts',
      'investigative mini doc | documental corto historia -shorts',
    ],
  },
  default: {
    es: [
      'video ensayo documental corto ciencia historia interesante -shorts',
      'divulgación curiosidades tecnología historias narradas -shorts',
    ],
    en: [
      'video essay documentary explained interesting story -shorts',
      'science mystery technology mini documentary -shorts',
    ],
    both: [
      'video essay explained | documental corto interesante -shorts',
      'science mystery story | divulgación historia ensayo -shorts',
    ],
  },
};

function applyResponseHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
}

function sendJson(res, statusCode, payload) {
  applyResponseHeaders(res);
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function decodeHtmlEntities(str = '') {
  const named = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  };
  return str
    .replace(/&(amp|lt|gt|quot|apos|nbsp|#39);/gi, (m) => named[m.toLowerCase()] ?? m)
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Convierte duración ISO 8601 (ej. PT14M28S, PT1H2M5S) a segundos totales.
 */
export function parseIsoDurationToSeconds(iso = '') {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i.exec(iso.trim());
  if (!match) return 0;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

export function formatSecondsToClock(totalSeconds = 0) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (n) => String(n).padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
}

function normalizeLanguageTag(snippet = {}, requestedLanguage = 'both') {
  const raw = (snippet.defaultAudioLanguage || snippet.defaultLanguage || '').toLowerCase();
  if (raw.startsWith('es')) return 'es';
  if (raw.startsWith('en')) return 'en';
  if (requestedLanguage === 'es' || requestedLanguage === 'en') {
    return requestedLanguage;
  }
  const text = `${snippet.title || ''} ${snippet.description || ''}`.toLowerCase();
  const spanishHints = /[áéíóúñ¿¡]|\b(que|como|por que|historia|ciencia|los|las|para)\b/i;
  return spanishHints.test(text) ? 'es' : 'en';
}

function sanitizeParams(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    const err = new Error('Parámetros de búsqueda inválidos.');
    err.statusCode = 400;
    err.code = 'INVALID_PARAMS';
    throw err;
  }

  const durationRange = DURATION_BOUNDS[raw.durationRange]
    ? raw.durationRange
    : '10-20';

  const language = ['es', 'en', 'both'].includes(raw.language)
    ? raw.language
    : 'both';

  const rawCategories = Array.isArray(raw.category)
    ? raw.category
    : typeof raw.category === 'string' && raw.category
      ? raw.category.split(',')
      : [];

  const categories = rawCategories
    .map((c) => String(c).trim().toLowerCase())
    .filter((c) => ALLOWED_CATEGORIES.has(c));

  const customQuery =
    typeof raw.customQuery === 'string'
      ? raw.customQuery.trim().slice(0, 100)
      : '';

  return { durationRange, categories, customQuery, language };
}

function buildSearchQuery({ categories, customQuery, language }) {
  const primaryCategory = categories[0] || 'default';
  const catEntry = CATEGORY_QUERIES[primaryCategory] || CATEGORY_QUERIES.default;
  const langKey = language === 'es' || language === 'en' ? language : 'both';
  const variants = catEntry[langKey] || catEntry.both;
  const baseQuery = variants[Math.floor(Math.random() * variants.length)];

  if (!customQuery) {
    return baseQuery;
  }

  const categoryHint = primaryCategory !== 'default' ? ` ${primaryCategory}` : '';
  return `${customQuery}${categoryHint} -shorts`;
}

function pickThumbnail(thumbnails = {}, videoId) {
  return (
    thumbnails.maxres?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  );
}

function mapYouTubeError(status, payload) {
  const reason = payload?.error?.errors?.[0]?.reason || 'YOUTUBE_API_ERROR';
  if (
    status === 403 &&
    ['quotaExceeded', 'dailyLimitExceeded', 'rateLimitExceeded'].includes(reason)
  ) {
    const err = new Error('Cuota diaria de YouTube alcanzada.');
    err.statusCode = 403;
    err.code = 'QUOTA_EXCEEDED';
    return err;
  }

  if (['keyInvalid', 'accessNotConfigured', 'ipRefererBlocked'].includes(reason)) {
    const err = new Error('Configuración de YouTube API no disponible.');
    err.statusCode = 503;
    err.code = 'API_UNAVAILABLE';
    return err;
  }

  const err = new Error('No se pudieron consultar videos en YouTube en este momento.');
  err.statusCode = status >= 500 ? 502 : 400;
  err.code = 'UPSTREAM_ERROR';
  return err;
}

/**
 * Ejecuta la recomendación real contra YouTube Data API v3.
 */
export async function fetchYouTubeRecommendations(
  rawParams = {},
  apiKey = process.env.YOUTUBE_API_KEY
) {
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    const err = new Error('Servicio de YouTube no configurado en el servidor.');
    err.statusCode = 503;
    err.code = 'MISSING_API_KEY';
    throw err;
  }

  const { durationRange, categories, customQuery, language } = sanitizeParams(rawParams);
  const bounds = DURATION_BOUNDS[durationRange];
  const q = buildSearchQuery({ categories, customQuery, language });

  // 1. search.list (100 unidades)
  const searchParams = new URLSearchParams({
    key: apiKey.trim(),
    part: 'snippet',
    type: 'video',
    videoEmbeddable: 'true',
    safeSearch: 'moderate',
    maxResults: '25',
    videoDuration: bounds.apiParam,
    q,
  });

  if (language === 'es' || language === 'en') {
    searchParams.set('relevanceLanguage', language);
  }

  let searchRes;
  let searchData;
  try {
    searchRes = await fetch(`${YOUTUBE_SEARCH_URL}?${searchParams.toString()}`);
    searchData = await searchRes.json();
  } catch {
    const err = new Error('No se pudo conectar con YouTube.');
    err.statusCode = 502;
    err.code = 'NETWORK_ERROR';
    throw err;
  }

  if (!searchRes.ok) {
    throw mapYouTubeError(searchRes.status, searchData);
  }

  const videoIds = (searchData.items || [])
    .map((item) => item?.id?.videoId)
    .filter(Boolean);

  if (videoIds.length === 0) {
    return [];
  }

  // 2. videos.list (1 unidad) para duración exacta en segundos
  const videosParams = new URLSearchParams({
    key: apiKey.trim(),
    part: 'contentDetails,snippet',
    id: videoIds.join(','),
  });

  let videosRes;
  let videosData;
  try {
    videosRes = await fetch(`${YOUTUBE_VIDEOS_URL}?${videosParams.toString()}`);
    videosData = await videosRes.json();
  } catch {
    const err = new Error('No se pudo obtener la duración de los videos.');
    err.statusCode = 502;
    err.code = 'NETWORK_ERROR';
    throw err;
  }

  if (!videosRes.ok) {
    throw mapYouTubeError(videosRes.status, videosData);
  }

  const results = [];
  for (const item of videosData.items || []) {
    const durationSeconds = parseIsoDurationToSeconds(item?.contentDetails?.duration);
    if (durationSeconds < bounds.min || durationSeconds > bounds.max) {
      continue;
    }

    const snippet = item.snippet || {};
    results.push({
      id: item.id,
      title: decodeHtmlEntities(snippet.title || 'Video sin título'),
      channelTitle: decodeHtmlEntities(snippet.channelTitle || 'YouTube'),
      thumbnail: pickThumbnail(snippet.thumbnails, item.id),
      durationFormatted: formatSecondsToClock(durationSeconds),
      durationSeconds,
      durationRange,
      category: categories[0] || '',
      language: normalizeLanguageTag(snippet, language),
    });
  }

  return results;
}

async function parseRequestParams(req) {
  if (req.method === 'GET') {
    const url = new URL(req.url || '/api/recommend', 'http://localhost');
    return {
      durationRange: url.searchParams.get('durationRange') || '10-20',
      category: url.searchParams.get('category') || '',
      customQuery: url.searchParams.get('customQuery') || '',
      language: url.searchParams.get('language') || 'both',
    };
  }

  try {
    if (req.body && typeof req.body === 'object') {
      return req.body;
    }

    if (typeof req.body === 'string' && req.body.trim()) {
      return JSON.parse(req.body);
    }

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const raw = Buffer.concat(chunks).toString('utf-8').trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    const err = new Error('El cuerpo JSON de la petición es inválido.');
    err.statusCode = 400;
    err.code = 'INVALID_JSON';
    throw err;
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    applyResponseHeaders(res);
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return sendJson(res, 405, {
      error: 'METHOD_NOT_ALLOWED',
      message: 'Usa GET o POST en /api/recommend.',
    });
  }

  try {
    const params = await parseRequestParams(req);
    const apiKey = req.youtubeApiKey || process.env.YOUTUBE_API_KEY;
    const videos = await fetchYouTubeRecommendations(params, apiKey);

    return sendJson(res, 200, {
      videos,
      source: 'youtube-api-v3',
      count: videos.length,
    });
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    return sendJson(res, statusCode, {
      error: error?.code || 'INTERNAL_ERROR',
      message: error?.message || 'No se pudieron obtener recomendaciones.',
    });
  }
}
