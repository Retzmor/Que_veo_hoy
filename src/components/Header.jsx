const DURATION_BADGE_MAP = {
  '5-10': '5–10 min snack',
  '10-20': '10–20 min comida',
  '20-35': '20–35 min sobremesa',
};

export function Header({
  activeDuration,
  watchedCount,
  hasResults,
  onSelectQuickDuration,
  onResetHome,
  onFocusFilters,
  onOpenHistory,
}) {
  const navBtnClass = (isActive) =>
    isActive
      ? 'px-space-md py-space-sm transition-all bg-surface-container-high text-primary font-semibold rounded-full text-[12px] cursor-pointer'
      : 'px-space-md py-space-sm text-[12px] font-semibold rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all cursor-pointer';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      <div className="h-20 max-w-[1280px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex items-center justify-between gap-space-md">
        {/* Marca */}
        <button
          type="button"
          onClick={onResetHome}
          aria-label="¿Qué Veo Hoy? — Volver al inicio"
          className="flex items-center gap-space-md min-w-0 text-left cursor-pointer group"
        >
          <img
            alt="¿Qué Veo Hoy? Logo"
            className="h-8 w-8 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
            src="/favicon.svg"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-sm text-[18px] font-semibold text-on-surface tracking-tight truncate">
                ¿Qué Veo Hoy?
              </h1>
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Listo para comer</span>
                <span className="text-amber-400 font-normal">• Caliente</span>
              </span>
            </div>
            <span className="text-[12px] text-on-surface-variant truncate hidden sm:inline">
              Videos listos para acompañar tu comida
            </span>
          </div>
        </button>

        {/* Navegación rápida desktop */}
        <nav
          aria-label="Atajos de duración e historial"
          className="hidden lg:flex items-center gap-space-xs bg-surface-container-low/90 p-1.5 rounded-full"
        >
          <button
            type="button"
            onClick={onResetHome}
            aria-current={!hasResults ? 'page' : undefined}
            className={navBtnClass(!hasResults || activeDuration === '10-20')}
          >
            Decisor Rápido
          </button>
          <button
            type="button"
            onClick={() => onSelectQuickDuration('5-10')}
            aria-current={hasResults && activeDuration === '5-10' ? 'page' : undefined}
            className={navBtnClass(hasResults && activeDuration === '5-10')}
          >
            Bocadillos &lt;10m
          </button>
          <button
            type="button"
            onClick={() => onSelectQuickDuration('20-35')}
            aria-current={hasResults && activeDuration === '20-35' ? 'page' : undefined}
            className={navBtnClass(hasResults && activeDuration === '20-35')}
          >
            Plato Fuerte 20m+
          </button>
          <button
            type="button"
            onClick={onOpenHistory}
            className={navBtnClass(false)}
          >
            Historial{watchedCount > 0 ? ` (${watchedCount})` : ''}
          </button>
        </nav>

        {/* Indicadores de sesión sin cuenta ni perfil */}
        <div className="flex items-center gap-space-sm shrink-0">
          <button
            type="button"
            onClick={onFocusFilters}
            aria-label="Ir a filtros de duración"
            className="hidden sm:flex items-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container text-[10px] font-bold tracking-wider uppercase text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              timer
            </span>
            <span>{DURATION_BADGE_MAP[activeDuration] || '10–20 min'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            aria-label="Abrir historial de videos vistos"
            className="lg:hidden flex items-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container text-[11px] font-bold text-amber-300 hover:bg-surface-container-high transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>Historial{watchedCount > 0 ? ` (${watchedCount})` : ''}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
