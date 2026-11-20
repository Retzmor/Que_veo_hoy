export function Footer({ onResetHome, onFocusFilters, onOpenPrivacy }) {
  return (
    <footer className="w-full bg-surface-container-lowest mt-space-xl py-space-lg border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col sm:flex-row items-center justify-between gap-space-md text-[12px] text-on-surface-variant">
        <div className="flex items-center gap-space-sm text-center sm:text-left">
          <span className="font-headline-sm text-[14px] text-on-surface font-semibold">
            ¿Qué Veo Hoy?
          </span>
          <span>— Cero fatiga de decisión para tus comidas.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-space-lg">
          <button
            type="button"
            onClick={onResetHome}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Generador
          </button>
          <button
            type="button"
            onClick={onFocusFilters}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Preferencias
          </button>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Privacidad y API de YouTube
          </button>
          <span className="text-[10px] font-bold tracking-wider uppercase text-on-surface-variant/60">
            YouTube API Ready
          </span>
        </div>
      </div>
    </footer>
  );
}
