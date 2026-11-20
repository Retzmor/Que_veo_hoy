import { useState, useRef } from 'react';
import { RefreshCw, Utensils, RotateCcw, WifiOff } from 'lucide-react';
import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
import { VideoCard } from './components/VideoCard';
import { VideoCardSkeleton } from './components/VideoCardSkeleton';
import { TheaterModal } from './components/TheaterModal';
import { Footer } from './components/Footer';
import { useVideoRecommendations } from './hooks/useVideoRecommendations';

export function App() {
  const {
    filters,
    setDuration,
    toggleVibe,
    setTopic,
    setLanguage,
    results,
    hasSearched,
    isLoading,
    fallbackNote,
    exhaustedAll,
    seenCount,
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
  } = useVideoRecommendations();

  // Estado puramente visual de UI (colapsar filtros en móvil al ver resultados)
  const [isCollapsedMobile, setIsCollapsedMobile] = useState(false);
  const resultsRef = useRef(null);

  const scrollResultsIntoViewOnMobile = () => {
    if (window.innerWidth < 768) {
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  };

  const handleFindVideos = () => {
    setIsCollapsedMobile(true);
    scrollResultsIntoViewOnMobile();
    findVideos();
  };

  const handleRotateThree = () => {
    setIsCollapsedMobile(true);
    scrollResultsIntoViewOnMobile();
    rotateThree();
  };

  const handleResetHome = () => {
    setIsCollapsedMobile(false);
    resetSearch();
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Capas ambientales Late-Night Cinema */}
      <div className="cinema-backdrop" aria-hidden="true" />
      <div className="cinema-grain" aria-hidden="true" />

      <Header
        seenCount={seenCount}
        hasResults={hasSearched}
        onResetHome={handleResetHome}
      />

      <main className="relative z-10 flex-1 flex flex-col justify-center py-3 sm:py-5 gap-5 sm:gap-6">
        <FilterPanel
          duration={filters.duration}
          onDurationChange={setDuration}
          vibes={filters.vibes}
          onToggleVibe={toggleVibe}
          topic={filters.topic}
          onTopicChange={setTopic}
          language={filters.language}
          onLanguageChange={setLanguage}
          onSubmit={handleFindVideos}
          isLoading={isLoading}
          hasResults={hasSearched}
          isCollapsedMobile={isCollapsedMobile}
          onToggleCollapseMobile={() => setIsCollapsedMobile((prev) => !prev)}
        />

        {/* Vista previa / Estado inicial sin ruido */}
        {!hasSearched && (
          <section
            aria-label="Guía rápida"
            className="w-full max-w-6xl mx-auto px-4 sm:px-6"
          >
            <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)]/40 px-5 py-8 sm:py-10 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-warm)]/40 bg-[rgba(245,158,11,0.08)]">
                <Utensils className="h-5 w-5 text-[var(--accent-amber)]" aria-hidden="true" />
              </div>
              <p className="font-display text-lg sm:text-xl text-[var(--text-primary)]">
                Tu plato está listo. Solo falta qué poner de fondo.
              </p>
              <p className="mt-1.5 max-w-md mx-auto text-xs sm:text-sm text-[var(--text-secondary)]">
                Ajusta el tiempo de tu comida y pulsa{' '}
                <strong className="font-semibold text-[var(--accent-amber)]">
                  Encontrar qué ver
                </strong>{' '}
                para recibir 3 opciones listas para reproducir.
              </p>
            </div>
          </section>
        )}

        {/* Vista de Resultados (Máximo 3 tarjetas simultáneas + Skeleton loaders) */}
        {hasSearched && (
          <section
            ref={resultsRef}
            aria-label="Videos recomendados"
            className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-4"
          >
            {isLoading ? (
              <div
                aria-busy="true"
                aria-label="Cargando recomendaciones de YouTube"
                className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
              >
                {[0, 1, 2].map((idx) => (
                  <VideoCardSkeleton key={idx} index={idx} />
                ))}
              </div>
            ) : (
              <>
                {fallbackNote && results.length > 0 && (
                  <div
                    role="status"
                    className="flex items-center justify-center sm:justify-start gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 px-3.5 py-2 text-xs text-[var(--text-secondary)]"
                  >
                    <WifiOff
                      className="h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]"
                      aria-hidden="true"
                    />
                    <span>{fallbackNote}</span>
                  </div>
                )}

                {results.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                      {results.slice(0, 3).map((video, idx) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          index={idx}
                          onWatch={watchVideo}
                          onDismiss={dismissVideo}
                        />
                      ))}
                    </div>

                    {/* Botón general debajo de las tarjetas */}
                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        onClick={handleRotateThree}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-hover)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] shadow-md hover:border-[var(--accent-amber)] hover:bg-[var(--bg-surface-elevated)] active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer"
                      >
                        <RefreshCw
                          aria-hidden="true"
                          className={`h-4 w-4 text-[var(--accent-amber)] ${
                            isLoading ? 'animate-spin' : ''
                          }`}
                        />
                        <span>Cambiar las 3 opciones</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-9 text-center space-y-3">
                    <p className="font-display text-lg text-[var(--text-primary)]">
                      {exhaustedAll
                        ? '¡Ya viste o descartaste todo el menú disponible!'
                        : 'No quedan más opciones sin ver con esta combinación.'}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                      Limpia tu historial de vistos para volver a llenar la mesa con nuevos videos.
                    </p>
                    <button
                      type="button"
                      onClick={clearAndSearch}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent-amber)] to-[var(--accent-ember)] px-4 py-2 text-xs sm:text-sm font-bold text-[#140C05] hover:brightness-110 transition-all cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      <span>Limpiar historial y mostrar 3 nuevos</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>

      <Footer
        seenCount={seenCount}
        justCleared={justCleared}
        onClearHistory={clearHistory}
      />

      {/* Reproductor modal / teatro integrado */}
      <TheaterModal video={activeVideo} onClose={closeVideo} />
    </div>
  );
}

export default App;
