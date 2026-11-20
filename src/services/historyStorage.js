const STORAGE_KEY = 'que-veo-hoy:seen-video-ids:v1';

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
 * Limpia el historial local de videos vistos/descartados.
 */
export function clearSeenHistory() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignorar errores de almacenamiento
  }
}
