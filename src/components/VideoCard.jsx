import { useState } from 'react';
import { VIBE_CATEGORIES } from '../data/mockVideos';

const THUMB_QUALITIES = ['maxresdefault', 'hqdefault', 'mqdefault'];

export function VideoCard({ video, index, onWatch, onDismiss }) {
  const [thumbStep, setThumbStep] = useState(0);
  const [usePrimaryThumb, setUsePrimaryThumb] = useState(Boolean(video.thumbnail));
  const [savedForLater, setSavedForLater] = useState(false);

  const fallbackUrl = `https://i.ytimg.com/vi/${video.id}/${THUMB_QUALITIES[thumbStep]}.jpg`;
  const thumbUrl = usePrimaryThumb && video.thumbnail ? video.thumbnail : fallbackUrl;

  const channelName = video.channelTitle || video.channel || 'YouTube';
  const durationLabel = video.durationFormatted || video.duration || '00:00';
  const languageLabel = video.language === 'es' ? 'Español' : 'Inglés';
  const categoryLabel =
    VIBE_CATEGORIES.find((c) => c.id === video.category)?.label ||
    languageLabel;

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
      className="animate-card-enter video-card group flex flex-col justify-between bg-surface-container-low rounded-DEFAULT p-space-md hover:bg-surface-container transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-surface-container-lowest/80 border border-white/5"
    >
      <div>
        {/* Thumbnail Container 16:9 */}
        <button
          type="button"
          onClick={() => onWatch(video)}
          aria-label={`Reproducir ${video.title}`}
          className="relative block w-full aspect-video rounded-DEFAULT overflow-hidden bg-surface-container-lowest mb-space-md text-left cursor-pointer"
        >
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
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Category Tag Pill (Top Left) */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] uppercase font-bold tracking-wider text-amber-400 shadow-sm">
            {categoryLabel.split(' ')[0]}
          </div>

          {/* Language Pill (Top Right) */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold tracking-wider text-on-surface">
            {languageLabel}
          </div>

          {/* Duration Badge (Bottom Right) */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/85 backdrop-blur-sm text-[11px] text-white font-bold tracking-tight shadow-md flex items-center gap-1 tabular-nums">
            <span className="material-symbols-outlined text-[13px] text-amber-400">
              schedule
            </span>
            {durationLabel}
          </div>

          {/* Center Play Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/50 scale-90 group-hover:scale-100 transition-transform">
              <span className="material-symbols-outlined text-[26px]">
                play_arrow
              </span>
            </div>
          </div>
        </button>

        {/* Video Metadata */}
        <div className="flex flex-col gap-1 mb-space-md">
          <h2 className="font-headline-sm text-[15px] text-on-surface font-semibold line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors min-h-[2.5rem]">
            {video.title}
          </h2>
          <div className="flex items-center gap-1.5 text-[12px] text-on-surface-variant pt-1">
            <span className="text-amber-200 font-semibold truncate">
              {channelName}
            </span>
            <span aria-hidden="true">•</span>
            <span className="shrink-0">{languageLabel}</span>
          </div>
        </div>
      </div>

      {/* Action Footer (Red Primary opens TheaterModal + Bookmark + Dismiss) */}
      <div className="pt-space-sm flex items-center gap-space-sm">
        <button
          type="button"
          onClick={() => onWatch(video)}
          aria-label={`Ver ahora: ${video.title}`}
          className="flex-1 py-2 px-space-md rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-[0_2px_12px_rgba(255,0,0,0.35)] hover:brightness-110 transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            play_arrow
          </span>
          <span>Ver en YouTube</span>
        </button>

        <button
          type="button"
          onClick={() => setSavedForLater((prev) => !prev)}
          aria-label={savedForLater ? 'Quitar de guardados' : 'Guardar plato'}
          aria-pressed={savedForLater}
          title={savedForLater ? 'Guardado' : 'Guardar para esta comida'}
          className={`save-btn w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
            savedForLater
              ? 'text-amber-400'
              : 'text-on-surface-variant hover:text-amber-400'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[18px] ${
              savedForLater ? 'material-symbols-filled' : ''
            }`}
          >
            {savedForLater ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onDismiss(video.id)}
          aria-label={`Descartar ${video.title}`}
          title="Descartar esta opción"
          className="dismiss-card-btn w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-red-400 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </article>
  );
}
