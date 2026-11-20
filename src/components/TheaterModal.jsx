import { useEffect, useRef } from 'react';

export function TheaterModal({ video, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!video) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [video, onClose]);

  if (!video) return null;

  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  const channelName = video.channelTitle || video.channel || 'YouTube';
  const durationLabel = video.durationFormatted || video.duration || '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="theater-video-title"
      className="animate-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="animate-modal-panel relative w-full max-w-4xl overflow-hidden rounded-2xl border border-amber-500/30 bg-surface-container-low shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modo teatro */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 sm:px-5 py-3.5 bg-surface-container-lowest/70">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
                <span className="material-symbols-outlined text-[15px]">tv</span>
                {channelName}
              </span>
              {durationLabel && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 tabular-nums text-on-surface">
                    <span className="material-symbols-outlined text-[14px] text-amber-400">
                      schedule
                    </span>
                    {durationLabel}
                  </span>
                </>
              )}
            </div>
            <h2
              id="theater-video-title"
              className="font-headline-sm text-sm sm:text-base font-semibold text-on-surface line-clamp-2"
            >
              {video.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar reproductor"
            className="shrink-0 inline-flex items-center justify-center rounded-full border border-white/10 bg-surface-container-high p-2 text-on-surface-variant hover:text-on-surface hover:border-amber-500/40 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Reproductor oficial embebido 16:9 */}
        <div className="aspect-video w-full bg-black">
          <iframe
            src={embedUrl}
            title={video.title}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        {/* Barra inferior discreta */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest px-4 sm:px-5 py-2.5 text-xs text-on-surface-variant">
          <span>¡Buen provecho! Guardado en tu historial para no repetirlo.</span>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-400 hover:underline font-semibold"
          >
            <span>Abrir en YouTube</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
}
