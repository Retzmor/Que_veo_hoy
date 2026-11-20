import { useState } from 'react';
import { Play, X, Tv } from 'lucide-react';
import { VIBE_CATEGORIES } from '../data/mockVideos';

const THUMB_QUALITIES = ['maxresdefault', 'hqdefault', 'mqdefault'];

export function VideoCard({ video, index, onWatch, onDismiss }) {
  const [thumbStep, setThumbStep] = useState(0);
  const [usePrimaryThumb, setUsePrimaryThumb] = useState(Boolean(video.thumbnail));

  const fallbackUrl = `https://i.ytimg.com/vi/${video.id}/${THUMB_QUALITIES[thumbStep]}.jpg`;
  const thumbUrl = usePrimaryThumb && video.thumbnail ? video.thumbnail : fallbackUrl;

  const channelName = video.channelTitle || video.channel || 'YouTube';
  const durationLabel = video.durationFormatted || video.duration || '00:00';
  const languageLabel = video.language === 'es' ? 'Español' : 'Inglés';
  const categoryLabel =
    VIBE_CATEGORIES.find((c) => c.id === video.category)?.label ?? '';

  const fallbackThumb = () => {
    if (usePrimaryThumb) {
      setUsePrimaryThumb(false);
      return;
    }
    setThumbStep((prev) => (prev < THUMB_QUALITIES.length - 1 ? prev + 1 : prev));
  };

  return (
    <article
      style={{ animationDelay: `${index * 55}ms` }}
      className="animate-card-enter group flex flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all duration-200 hover:border-[var(--border-warm)] hover:shadow-[0_14px_36px_rgba(0,0,0,0.55)]"
    >
      {/* Miniatura 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0A0807]">
        <img
          src={thumbUrl}
          alt={`Miniatura de ${video.title}`}
          width={480}
          height={270}
          loading="lazy"
          decoding="async"
          onError={fallbackThumb}
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth <= 120) {
              fallbackThumb();
            }
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Viñeta inferior cinematográfica */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25 pointer-events-none"
        />

        {/* Etiqueta de idioma arriba a la izquierda */}
        <span className="absolute top-2.5 left-2.5 inline-flex items-center rounded-md border border-white/15 bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[11px] font-semibold tracking-wide text-[var(--text-primary)]">
          {languageLabel}
        </span>

        {/* Badge de duración exacta abajo a la derecha */}
        <span className="font-mono-time absolute bottom-2.5 right-2.5 rounded-md border border-white/15 bg-black/85 px-2 py-0.5 text-xs font-semibold text-[#FFF4E0] shadow-sm">
          {durationLabel}
        </span>
      </div>

      {/* Información y Acciones */}
      <div className="flex flex-1 flex-col justify-between p-4 gap-3.5">
        <div className="space-y-1.5">
          <h2 className="text-base font-semibold leading-snug text-[var(--text-primary)] line-clamp-2 min-h-[2.75rem]">
            {video.title}
          </h2>
          <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1.5 truncate">
              <Tv className="h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]/80" />
              <span className="truncate">{channelName}</span>
            </span>
            {categoryLabel && (
              <span className="shrink-0 text-[11px] text-[var(--text-muted)] hidden sm:inline">
                {categoryLabel.split(' ')[0]}
              </span>
            )}
          </div>
        </div>

        {/* Botones por tarjeta */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onWatch(video)}
            aria-label={`Ver ahora: ${video.title}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--accent-amber)] to-[var(--accent-ember)] px-3.5 py-2 text-xs sm:text-sm font-bold text-[#140C05] shadow-[0_4px_16px_rgba(245,158,11,0.22)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Ver ahora</span>
          </button>

          <button
            type="button"
            onClick={() => onDismiss(video.id)}
            aria-label={`Descartar ${video.title}`}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/70 px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-surface-elevated)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span>Descartar</span>
          </button>
        </div>
      </div>
    </article>
  );
}
