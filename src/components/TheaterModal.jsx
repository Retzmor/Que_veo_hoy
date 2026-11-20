import { useEffect, useRef } from 'react';
import { X, Tv, Clock, ExternalLink } from 'lucide-react';

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
      className="animate-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-theater)] backdrop-blur-md p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="animate-modal-panel relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--border-warm)]/60 bg-[var(--bg-surface)] shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modo teatro */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] px-4 sm:px-5 py-3.5">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-1 font-medium text-[var(--accent-amber)]">
                <Tv className="h-3.5 w-3.5" />
                {channelName}
              </span>
              {durationLabel && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-time inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {durationLabel}
                  </span>
                </>
              )}
            </div>
            <h2
              id="theater-video-title"
              className="text-sm sm:text-base font-semibold text-[var(--text-primary)] line-clamp-2"
            >
              {video.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar reproductor"
            className="shrink-0 inline-flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
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
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-canvas)]/70 px-4 sm:px-5 py-2.5 text-xs text-[var(--text-secondary)]">
          <span>¡Buen provecho! Guardado en tu historial para no repetirlo.</span>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[var(--accent-amber)] hover:underline"
          >
            <span>Abrir en YouTube</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
