import { DURATION_OPTIONS, VIBE_CATEGORIES, LANGUAGE_OPTIONS } from '../data/mockVideos';

const DURATION_VISUALS = {
  '5-10': { icon: 'cookie', hint: '(Snack)' },
  '10-20': { icon: 'lunch_dining', hint: '(Comida Activa)' },
  '20-35': { icon: 'coffee', hint: '(Sobremesa)' },
};

const CATEGORY_VISUALS = {
  curiosidades: { icon: 'science', iconColor: 'text-amber-400' },
  historias: { icon: 'auto_stories', iconColor: 'text-red-400' },
  tecnologia: { icon: 'sports_esports', iconColor: 'text-red-400' },
  comedia: { icon: 'theater_comedy', iconColor: 'text-amber-300' },
  documental: { icon: 'ramen_dining', iconColor: 'text-amber-400' },
};

export function FilterPanel({
  duration,
  onDurationChange,
  vibes,
  onToggleVibe,
  topic,
  onTopicChange,
  language,
  onLanguageChange,
  onSubmit,
  isLoading,
}) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section aria-label="Panel de selección rápida" className="relative z-10 w-full mb-space-xl">
      <form
        onSubmit={handleFormSubmit}
        className="w-full bg-surface-container-low/95 rounded-lg p-space-md sm:p-space-lg shadow-xl shadow-surface-container-lowest/80 border border-white/5"
      >
        {/* Row 1: Duration Filter + Language Segmented Pill + Primary Action */}
        <div className="flex flex-wrap items-center justify-between gap-space-md pb-space-md border-b border-white/5">
          {/* Duration Selectors with Meal Analogies */}
          <div
            role="radiogroup"
            aria-label="Ventana de Degustación"
            className="flex flex-wrap items-center gap-space-xs"
          >
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider mr-space-xs flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-[15px] text-amber-400">
                restaurant
              </span>
              Ventana de Degustación:
            </span>

            {DURATION_OPTIONS.map((opt) => {
              const active = duration === opt.id;
              const visual = DURATION_VISUALS[opt.id] || {
                icon: 'schedule',
                hint: opt.subtitle,
              };
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onDurationChange(opt.id)}
                  className={
                    active
                      ? 'duration-pill active px-space-md py-1.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white text-[12px] flex items-center gap-space-xs shadow-[0_0_16px_rgba(234,88,12,0.45)] scale-[1.02] font-bold transition-all cursor-pointer'
                      : 'duration-pill group px-space-md py-1.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center gap-space-xs transition-all active:scale-95 text-[12px] font-semibold cursor-pointer'
                  }
                >
                  <span
                    className={`material-symbols-outlined text-[15px] ${
                      active ? 'text-white' : 'text-amber-400/80'
                    }`}
                  >
                    {visual.icon}
                  </span>
                  <span>{opt.label}</span>
                  <span
                    className={`hidden sm:inline font-normal ${
                      active ? 'text-amber-100' : 'text-on-surface-variant/70'
                    }`}
                  >
                    {visual.hint}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Language Selector + Sparkle CTA */}
          <div className="flex flex-wrap items-center gap-space-sm ml-auto">
            {/* Language Segmented Control */}
            <div
              role="radiogroup"
              aria-label="Idioma del video"
              className="flex items-center p-1 rounded-full bg-surface-container-lowest border border-white/5"
            >
              {LANGUAGE_OPTIONS.map((opt) => {
                const active = language === opt.id;
                const shortLabel =
                  opt.id === 'es' ? 'ES' : opt.id === 'en' ? 'EN' : 'Ambos';
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={opt.label}
                    onClick={() => onLanguageChange(opt.id)}
                    className={
                      active
                        ? 'px-space-sm py-0.5 rounded-full text-[10px] tracking-wider bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold shadow-sm cursor-pointer'
                        : 'px-space-sm py-0.5 rounded-full text-[10px] tracking-wider font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer'
                    }
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Primary Decision Action Button in Warm Amber/Orange */}
            <button
              id="main-search-btn"
              type="submit"
              disabled={isLoading}
              className="group px-space-lg py-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 hover:brightness-110 transition-all text-black font-headline-sm text-[13px] font-bold flex items-center gap-space-xs shadow-[0_2px_16px_rgba(245,158,11,0.35)] active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-[17px] text-black transition-transform ${
                  isLoading ? 'animate-spin' : 'group-hover:rotate-12'
                }`}
              >
                {isLoading ? 'progress_activity' : 'auto_awesome'}
              </span>
              <span className="whitespace-nowrap tracking-tight">
                {isLoading ? 'Buscando...' : 'Buscar Video Perfecto'}
              </span>
            </button>
          </div>
        </div>

        {/* Row 2: Search Input & Category Filter Chips */}
        <div className="flex flex-col lg:flex-row items-center gap-space-md pt-space-md">
          {/* Search Pill */}
          <div className="relative w-full lg:w-72 shrink-0">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={topic}
              onChange={(e) => onTopicChange(e.target.value)}
              aria-label="Buscar canal o tema rápido"
              placeholder="Buscar canal o tema rápido..."
              className="w-full bg-surface-container-lowest text-on-surface text-[12px] pl-10 pr-8 py-2.5 rounded-full outline-none focus:bg-surface-container focus:text-on-surface border border-white/5 focus:border-amber-500/40 transition-all placeholder:text-on-surface-variant/50"
            />
            {topic && (
              <button
                type="button"
                onClick={() => onTopicChange('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Category Tags Scrollable Track */}
          <div
            role="group"
            aria-label="Categorías y vibes"
            className="flex items-center gap-space-xs overflow-x-auto w-full py-1 scrollbar-none"
          >
            {VIBE_CATEGORIES.map((cat) => {
              const active = vibes.includes(cat.id);
              const visual = CATEGORY_VISUALS[cat.id] || {
                icon: 'star',
                iconColor: 'text-amber-400',
              };
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleVibe(cat.id)}
                  className={
                    active
                      ? 'category-chip active px-space-md py-1.5 rounded-full bg-amber-500 text-black font-bold text-[11px] whitespace-nowrap shadow-[0_0_14px_rgba(245,158,11,0.4)] flex items-center gap-1.5 transition-all cursor-pointer shrink-0'
                      : 'category-chip px-space-md py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shrink-0'
                  }
                >
                  <span
                    className={`material-symbols-outlined text-[15px] ${
                      active ? 'text-black' : visual.iconColor
                    }`}
                  >
                    {visual.icon}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </section>
  );
}
