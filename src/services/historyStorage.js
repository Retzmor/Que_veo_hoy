const STORAGE_KEY = 'que-veo-hoy:seen-video-ids:v1';
const WATCHED_HISTORY_KEY = 'que-veo-hoy:watched-history:v1';
const MAX_WATCHED_HISTORY = 30;

/**
 * Obtiene la lista de IDs de videos ya vistos o descartados en localStorage.
 * @returns {string[]}
 */
export function getSeenVideoIds() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Registra un ID de video como visto o descartado para no volver a mostrarlo.
 * @param {string} videoId
 * @returns {string[]} Lista actualizada de IDs
 */
export function markVideoAsSeen(videoId) {
  if (!videoId) return getSeenVideoIds();
  const current = getSeenVideoIds();
  if (current.includes(videoId)) return current;
  const updated = [...current, videoId];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Si localStorage no está disponible o está lleno, degradamos sin romper la UX
  }
  return updated;
}

/**
 * Limpia los IDs vistos/descartados de localStorage.
 */
export function clearSeenHistory() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignorar errores de almacenamiento
  }
}

/**
 * Obtiene el historial detallado de los últimos 30 videos reproducidos ("Ver ahora").
 * @returns {Array<{id:string,title:string,channelTitle:string,thumbnail:string,durationFormatted:string,watchedAt:string}>}
 */
export function getWatchedHistory() {
  try {
    const raw = window.localStorage.getItem(WATCHED_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Guarda la metadata básica de un video reproducido en watchedHistory (máximo 30).
 */
export function addToWatchedHistory(video) {
  if (!video || !video.id) return getWatchedHistory();
  const current = getWatchedHistory().filter((item) => item.id !== video.id);

  const entry = {
    id: video.id,
    title: video.title || 'Video sin título',
    channelTitle: video.channelTitle || video.channel || 'YouTube',
    thumbnail:
      video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
    durationFormatted: video.durationFormatted || video.duration || '00:00',
    watchedAt: new Date().toISOString(),
  };

  const updated = [entry, ...current].slice(0, MAX_WATCHED_HISTORY);
  try {
    window.localStorage.setItem(WATCHED_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignorar errores de almacenamiento
  }
  return updated;
}

/**
 * Limpia la lista detallada de videos reproducidos.
 */
export function clearWatchedHistory() {
  try {
    window.localStorage.removeItem(WATCHED_HISTORY_KEY);
  } catch {
    // Ignorar errores de almacenamiento
  }
}
