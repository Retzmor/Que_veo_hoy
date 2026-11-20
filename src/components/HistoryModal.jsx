import { useEffect, useRef } from 'react';

function formatWatchedDate(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '';
  }
}

export function HistoryModal({
  isOpen,
  history,
  seenCount,
  onClose,
  onReplay,
  onClearHistory,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
      className="animate-modal-backdrop fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-panel relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-surface-container-low shadow-[0_0_60px_rgba(0,0,0,0.9)]"
      >
        {/* Cabecera del panel lateral */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-surface-container-lowest/80 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-400">
                history
              </span>
              <h2
                id="history-modal-title"
                className="font-headline-sm text-[17px] font-semibold text-on-surface"
              >
                Historial de vistos
              </h2>
            </div>
            <p className="mt-0.5 text-[12px] text-on-surface-variant">
              {history.length > 0
                ? `${history.length} reproducido${history.length === 1 ? '' : 's'} (últimos 30)`
                : 'Tus videos reproducidos aparecerán aquí'}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar historial"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:border-amber-500/40 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Lista de videos vistos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-14 px-4 rounded-DEFAULT bg-surface-container/60 border border-white/5">
              <span className="material-symbols-outlined text-[34px] text-amber-400/70 mb-2">
                movie_info
              </span>
              <p className="text-[14px] font-semibold text-on-surface">
                Tu historial está limpio
              </p>
              <p className="mt-1 text-[12px] text-on-surface-variant max-w-xs">
                Cuando abras un video con “Ver en YouTube”, se guardará aquí para que puedas volver a verlo cuando quieras.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-3 rounded-DEFAULT bg-surface-container/80 hover:bg-surface-container-high border border-white/5 p-2.5 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => onReplay(item)}
                  aria-label={`Volver a ver ${item.title}`}
                  className="relative w-28 aspect-video rounded-lg overflow-hidden bg-surface-container-lowest shrink-0 cursor-pointer"
                >
                  <img
                    src={item.thumbnail}
                    alt={`Miniatura de ${item.title}`}
                    width={112}
                    height={63}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-bold text-white tabular-nums">
                    {item.durationFormatted}
                  </span>
                </button>

                <div className="min-w-0 flex-1 space-y-1">
                  <button
                    type="button"
                    onClick={() => onReplay(item)}
                    className="text-left text-[13px] font-semibold text-on-surface hover:text-amber-300 line-clamp-2 leading-snug transition-colors cursor-pointer"
                  >
                    {item.title}
                  </button>
                  <div className="flex items-center gap-1.5 text-[11px] text-on-surface-variant truncate">
                    <span className="text-amber-200 font-medium truncate">
                      {item.channelTitle}
                    </span>
                    {item.watchedAt && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span className="shrink-0">{formatWatchedDate(item.watchedAt)}</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onReplay(item)}
                  aria-label={`Reproducir ${item.title}`}
                  title="Volver a ver"
                  className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 hover:bg-red-500 text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    play_arrow
                  </span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer del historial */}
        <div className="border-t border-white/10 bg-surface-container-lowest/90 px-5 py-3.5 flex items-center justify-between gap-3">
          <span className="text-[11px] text-on-surface-variant">
            {seenCount} {seenCount === 1 ? 'video omitido' : 'videos omitidos'} de nuevas sugerencias
          </span>
          <button
            type="button"
            onClick={onClearHistory}
            disabled={history.length === 0 && seenCount === 0}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3.5 py-1.5 text-[11px] font-bold text-amber-400 hover:bg-surface-container-high hover:text-amber-300 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">
              delete_sweep
            </span>
            <span>Vaciar historial</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
