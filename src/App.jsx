import { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
import { VideoCard } from './components/VideoCard';
import { VideoCardSkeleton } from './components/VideoCardSkeleton';
import { TheaterModal } from './components/TheaterModal';
import { HistoryModal } from './components/HistoryModal';
import { PrivacyModal } from './components/PrivacyModal';
import { EditorialSection } from './components/EditorialSection';
import { AdSlot } from './components/AdSlot';
import { Footer } from './components/Footer';
import { DURATION_OPTIONS } from './data/mockVideos';
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
    watchedHistory,
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

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const resultsRef = useRef(null);
  const deckRef = useRef(null);
  const quickDurationTriggeredRef = useRef(false);

  const activeDurationLabel =
    DURATION_OPTIONS.find((d) => d.id === filters.duration)?.label || '10–20 min';

  const totalMinutes = Math.round(
    results.reduce((acc, v) => acc + (v.durationSeconds || 0), 0) / 60
  );

  // Atajo [ Espacio ] de escritorio para barajar 3 opciones
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.code !== 'Space' ||
        !hasSearched ||
        activeVideo ||
        isHistoryOpen ||
        isPrivacyOpen ||
        isLoading
      ) {
        return;
      }
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'A') {
        return;
      }
      e.preventDefault();
      rotateThree();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSearched, activeVideo, isHistoryOpen, isPrivacyOpen, isLoading, rotateThree]);

  useEffect(() => {
    if (!quickDurationTriggeredRef.current) return;
    quickDurationTriggeredRef.current = false;
    findVideos();
    if (window.innerWidth < 768) {
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }, [filters.duration, findVideos]);

  const handleSelectQuickDuration = (nextDuration) => {
    if (nextDuration === filters.duration) {
      findVideos();
      return;
    }
    quickDurationTriggeredRef.current = true;
    setDuration(nextDuration);
  };

  const handleFindVideos = () => {
    findVideos();
    if (window.innerWidth < 768) {
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  };

  const handleFocusFilters = () => {
    deckRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReplayFromHistory = (historyItem) => {
    setIsHistoryOpen(false);
    watchVideo(historyItem);
  };

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
      <Header
        activeDuration={filters.duration}
        watchedCount={watchedHistory.length}
        hasResults={hasSearched}
        onSelectQuickDuration={handleSelectQuickDuration}
        onResetHome={resetSearch}
        onFocusFilters={handleFocusFilters}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="w-full flex-1 pt-20 bg-background">
        <div className="max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-lg">
          <div className="flex flex-col w-full">
            <div className="relative w-full overflow-hidden">
              {/* Top Soft Ambient Spotlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-gradient-to-b from-primary-container/20 via-secondary-container/10 to-transparent blur-[110px] rounded-full opacity-60"
              />

              {/* MAIN COMPACT CONTROL DECK */}
              <div ref={deckRef}>
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
                />
              </div>

              {/* Estado inicial antes de la primera búsqueda */}
              {!hasSearched && (
                <section
                  aria-label="Bienvenida"
                  className="relative z-10 w-full mb-space-xl rounded-DEFAULT bg-surface-container-low/75 border border-white/5 px-space-lg py-space-xl text-center shadow-lg"
                >
                  <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px] text-amber-400">
                      restaurant
                    </span>
                  </div>
                  <p className="font-headline-sm text-[18px] text-on-surface font-semibold">
                    Tu plato está listo. Solo falta qué poner de fondo.
                  </p>
                  <p className="mt-1.5 max-w-md mx-auto text-[13px] text-on-surface-variant">
                    Elige la duración de tu comida y pulsa{' '}
                    <strong className="text-amber-300 font-semibold">
                      Buscar Video Perfecto
                    </strong>{' '}
                    para recibir 3 opciones listas para reproducir sin salir de la página.
                  </p>
                </section>
              )}

              {/* CONTEXT BANNER & COUNTER + 3-COLUMN GRID */}
              {hasSearched && (
                <div ref={resultsRef}>
                  <section
                    aria-label="Resumen de resultados"
                    className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-amber-400 uppercase tracking-widest mb-1 font-bold">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        Menú Express: {isLoading ? '...' : `${results.length} Videos`}
                      </div>
                      <p className="font-headline-sm text-[18px] text-on-surface font-semibold tracking-tight">
                        {isLoading
                          ? `Preparando opciones para tus ${activeDurationLabel}...`
                          : `${results.length} recomendaciones para tus ${activeDurationLabel} de comida`}
                      </p>
                      <p className="text-[14px] text-on-surface-variant">
                        Sin algoritmos infinitos ni desplazamientos lentos. Tu comida no se enfría.
                      </p>
                    </div>

                    {/* Quick Session Indicator */}
                    <div className="flex items-center gap-space-md bg-surface-container-high/60 border border-amber-500/20 px-space-md py-2 rounded-full shrink-0 self-start md:self-auto">
                      <span className="text-[10px] tracking-wider text-amber-300 font-bold flex items-center gap-1 uppercase">
                        <span className="material-symbols-outlined text-[15px] text-amber-400">
                          timer
                        </span>
                        {activeDurationLabel} seleccionados
                      </span>
                      {totalMinutes > 0 && !isLoading && (
                        <>
                          <span className="w-1 h-3 rounded-full bg-surface-variant" />
                          <span className="text-[10px] tracking-wider text-on-surface-variant font-bold flex items-center gap-1 uppercase">
                            <span className="material-symbols-outlined text-[15px] text-red-400">
                              hd
                            </span>
                            Total: {totalMinutes} min
                          </span>
                        </>
                      )}
                    </div>
                  </section>

                  {/* Aviso discreto cuando hay fallback offline */}
                  {!isLoading && fallbackNote && results.length > 0 && (
                    <div
                      role="status"
                      className="mb-space-md flex items-center gap-2 rounded-full bg-surface-container-low border border-white/10 px-4 py-2 text-[12px] text-on-surface-variant w-fit"
                    >
                      <span className="material-symbols-outlined text-[16px] text-amber-400">
                        cloud_off
                      </span>
                      <span>{fallbackNote}</span>
                    </div>
                  )}

                  {/* 3-COLUMN VIDEO CARD GRID */}
                  {isLoading ? (
                    <section
                      aria-busy="true"
                      aria-label="Cargando recomendaciones de YouTube"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop mb-space-xl"
                    >
                      {[0, 1, 2].map((idx) => (
                        <VideoCardSkeleton key={idx} index={idx} />
                      ))}
                    </section>
                  ) : results.length > 0 ? (
                    <>
                      <section
                        aria-label="Videos recomendados"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop mb-space-xl"
                      >
                        {results.slice(0, 3).map((video, idx) => (
                          <VideoCard
                            key={video.id}
                            video={video}
                            index={idx}
                            onWatch={watchVideo}
                            onDismiss={dismissVideo}
                          />
                        ))}
                      </section>

                      {/* SHUFFLE RE-ROLL CONTROLS */}
                      <section className="flex flex-col items-center justify-center gap-space-sm mb-space-xl">
                        <button
                          id="shuffle-btn"
                          type="button"
                          onClick={rotateThree}
                          disabled={isLoading}
                          className="group relative px-space-xl py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-headline-sm text-[16px] font-bold flex items-center gap-space-sm shadow-[0_4px_24px_rgba(245,158,11,0.38)] hover:brightness-110 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[22px] text-black group-hover:rotate-180 transition-transform duration-500">
                            casino
                          </span>
                          <span className="tracking-tight font-bold">
                            Barajar 3 opciones nuevas
                          </span>
                          <span className="material-symbols-outlined text-[18px] text-black group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </button>

                        <p className="text-[12px] text-on-surface-variant/80 flex items-center gap-1.5">
                          <span>O presiona la tecla</span>
                          <kbd className="px-2 py-0.5 rounded bg-surface-container font-mono text-[11px] text-amber-300 font-semibold border border-white/5 shadow-inner">
                            [ Espacio ]
                          </kbd>
                          <span>para cambiar al instante</span>
                        </p>
                      </section>
                    </>
                  ) : (
                    <section className="rounded-DEFAULT bg-surface-container-low border border-white/5 px-space-lg py-space-xl text-center space-y-3 mb-space-xl">
                      <p className="font-headline-sm text-[18px] text-on-surface font-semibold">
                        {exhaustedAll
                          ? '¡Ya viste o descartaste todo el menú disponible!'
                          : 'No quedan más opciones sin ver con esta combinación.'}
                      </p>
                      <p className="text-[13px] text-on-surface-variant max-w-md mx-auto">
                        Limpia tu historial de vistos para volver a llenar la mesa con nuevos videos.
                      </p>
                      <button
                        type="button"
                        onClick={clearAndSearch}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-[13px] font-bold text-black hover:brightness-110 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          restart_alt
                        </span>
                        <span>Limpiar historial y mostrar 3 nuevos</span>
                      </button>
                    </section>
                  )}
                </div>
              )}

              {/* CLEAN STREAMLINED SESSION STATUS BAR */}
              <section
                aria-label="Estado de sesión e historial"
                className="w-full bg-surface-container-lowest/80 rounded-DEFAULT p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md border border-white/5"
              >
                <div className="flex items-center gap-space-md flex-wrap justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen(true)}
                    className="flex items-center gap-2 rounded-full px-2.5 py-1 hover:bg-surface-container transition-colors cursor-pointer"
                    aria-label="Abrir historial de videos vistos"
                  >
                    <span className="material-symbols-outlined text-[16px] text-amber-400">
                      history
                    </span>
                    <span className="text-[12px] text-on-surface font-semibold">
                      Historial de la sesión:{' '}
                      <strong className="text-amber-400 font-bold underline decoration-amber-400/40 underline-offset-4">
                        {watchedHistory.length}{' '}
                        {watchedHistory.length === 1 ? 'video visto' : 'videos vistos'}
                      </strong>
                    </span>
                  </button>
                  <span className="hidden md:inline text-surface-variant">•</span>
                  <span className="text-[12px] text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-red-500">
                      restaurant_menu
                    </span>
                    Modo comedor activo — Cero algoritmos infinitos, solo 3 opciones.
                  </span>
                </div>

                {justCleared ? (
                  <span className="inline-flex items-center gap-1.5 px-space-md py-1.5 rounded-full bg-surface-container text-secondary text-[11px] font-bold shrink-0">
                    <span className="material-symbols-outlined text-[15px]">check</span>
                    <span>Historial limpiado</span>
                  </span>
                ) : (
                  <button
                    id="clear-history-btn"
                    type="button"
                    onClick={clearHistory}
                    disabled={seenCount === 0 && watchedHistory.length === 0}
                    className="flex items-center gap-1.5 px-space-md py-1.5 rounded-full bg-surface-container text-amber-400 hover:text-amber-300 hover:bg-surface-container-high text-[11px] font-bold transition-colors shrink-0 disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      delete_sweep
                    </span>
                    <span>Limpiar historial de vistos</span>
                  </button>
                )}
              </section>

              {/* Contenedor modular de monetización (separado con my-10 y fuera del reproductor) */}
              <AdSlot />

              {/* Sección editorial discreta para SEO orgánico */}
              <EditorialSection />
            </div>
          </div>
        </div>
      </main>

      <Footer
        onResetHome={resetSearch}
        onFocusFilters={handleFocusFilters}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Panel lateral de historial */}
      <HistoryModal
        isOpen={isHistoryOpen}
        history={watchedHistory}
        seenCount={seenCount}
        onClose={() => setIsHistoryOpen(false)}
        onReplay={handleReplayFromHistory}
        onClearHistory={clearHistory}
      />

      {/* Modal de Política de Privacidad y Uso de API de YouTube */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Reproductor modal / teatro integrado */}
      <TheaterModal video={activeVideo} onClose={closeVideo} />
    </div>
  );
}

export default App;
