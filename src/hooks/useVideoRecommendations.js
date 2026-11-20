import { useState, useCallback } from 'react';
import {
  recommendVideos,
  fetchReplacementVideo,
} from '../services/videoService';
import {
  getSeenVideoIds,
  markVideoAsSeen,
  clearSeenHistory,
} from '../services/historyStorage';

/**
 * Custom hook desacoplado que encapsula todo el estado de filtros,
 * caché, historial de vistos en localStorage, reproductor activo y llamadas al servicio.
 * Cualquier rediseño futuro de interfaz puede consumir directamente sus props y callbacks.
 */
export function useVideoRecommendations() {
  const [duration, setDuration] = useState('10-20');
  const [vibes, setVibes] = useState([]);
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('both');

  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fallbackNote, setFallbackNote] = useState(null);
  const [exhaustedAll, setExhaustedAll] = useState(false);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  const [seenIds, setSeenIds] = useState(() => getSeenVideoIds());
  const [activeVideo, setActiveVideo] = useState(null);
  const [justCleared, setJustCleared] = useState(false);

  const toggleVibe = useCallback((vibeId) => {
    setVibes((prev) =>
      prev.includes(vibeId)
        ? prev.filter((id) => id !== vibeId)
        : [...prev, vibeId]
    );
  }, []);

  const executeRecommendationSearch = useCallback(
    async ({ excludeCurrent = false } = {}) => {
      setIsLoading(true);
      setHasSearched(true);

      try {
        const excludeIds = excludeCurrent ? results.map((v) => v.id) : [];
        const response = await recommendVideos({
          duration,
          vibes,
          topic,
          language,
          excludeIds,
          seenIds,
          limit: 3,
        });

        setResults(response.videos);
        setFallbackNote(response.fallbackNote);
        setExhaustedAll(response.exhaustedAll);
        setIsOfflineFallback(Boolean(response.isOfflineFallback));
        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [duration, vibes, topic, language, results, seenIds]
  );

  const findVideos = useCallback(
    () => executeRecommendationSearch({ excludeCurrent: false }),
    [executeRecommendationSearch]
  );

  const rotateThree = useCallback(
    () => executeRecommendationSearch({ excludeCurrent: true }),
    [executeRecommendationSearch]
  );

  const watchVideo = useCallback((video) => {
    const updatedSeen = markVideoAsSeen(video.id);
    setSeenIds(updatedSeen);
    setActiveVideo(video);
  }, []);

  const closeVideo = useCallback(() => {
    setActiveVideo(null);
  }, []);

  const dismissVideo = useCallback(
    async (videoId) => {
      const updatedSeen = markVideoAsSeen(videoId);
      setSeenIds(updatedSeen);

      const currentVisibleIds = results.map((v) => v.id);
      const {
        video: replacement,
        exhaustedAll: allGone,
        fallbackNote: nextFallbackNote,
        isOfflineFallback: offline,
      } = await fetchReplacementVideo({
        duration,
        vibes,
        topic,
        language,
        excludeIds: currentVisibleIds,
        seenIds: updatedSeen,
      });

      setResults((prev) => {
        if (!replacement) {
          return prev.filter((v) => v.id !== videoId);
        }
        return prev.map((v) => (v.id === videoId ? replacement : v));
      });

      if (nextFallbackNote) {
        setFallbackNote(nextFallbackNote);
      }
      if (typeof offline === 'boolean') {
        setIsOfflineFallback(offline);
      }
      if (allGone) {
        setExhaustedAll(true);
      }
    },
    [duration, vibes, topic, language, results]
  );

  const clearHistory = useCallback(() => {
    clearSeenHistory();
    setSeenIds([]);
    setExhaustedAll(false);
    setJustCleared(true);
    window.setTimeout(() => setJustCleared(false), 2400);
  }, []);

  const clearAndSearch = useCallback(async () => {
    clearSeenHistory();
    setSeenIds([]);
    setExhaustedAll(false);
    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await recommendVideos({
        duration,
        vibes,
        topic,
        language,
        excludeIds: [],
        seenIds: [],
        limit: 3,
      });
      setResults(response.videos);
      setFallbackNote(response.fallbackNote);
      setIsOfflineFallback(Boolean(response.isOfflineFallback));
    } finally {
      setIsLoading(false);
    }
  }, [duration, vibes, topic, language]);

  const resetSearch = useCallback(() => {
    setHasSearched(false);
    setResults([]);
    setFallbackNote(null);
    setExhaustedAll(false);
    setIsOfflineFallback(false);
  }, []);

  return {
    filters: {
      duration,
      vibes,
      topic,
      language,
    },
    setDuration,
    toggleVibe,
    setTopic,
    setLanguage,
    results,
    hasSearched,
    isLoading,
    fallbackNote,
    exhaustedAll,
    isOfflineFallback,
    seenCount: seenIds.length,
    activeVideo,
    justCleared,
    findVideos,
    rotateThree,
    watchVideo,
    closeVideo,
    dismissVideo,
    clearHistory,
    clearAndSearch,
    resetSearch,
  };
}
