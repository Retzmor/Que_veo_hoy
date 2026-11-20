import { Clock, Sparkles, Globe, Search, SlidersHorizontal, X } from 'lucide-react';
import {
  DURATION_OPTIONS,
  VIBE_CATEGORIES,
  LANGUAGE_OPTIONS,
} from '../data/mockVideos';

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
  hasResults,
  isCollapsedMobile,
  onToggleCollapseMobile,
}) {
  const activeDurationLabel =
    DURATION_OPTIONS.find((opt) => opt.id === duration)?.label ?? duration;
  const activeLangLabel =
    LANGUAGE_OPTIONS.find((opt) => opt.id === language)?.label ?? language;
  const activeVibeCount = vibes.length;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section
      aria-label="Panel de selección rápida"
      className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6"
    >
      {/* Barra compacta en móvil cuando ya hay resultados */}
      {hasResults && isCollapsedMobile && (
        <div className="md:hidden mb-4 flex items-center justify-between gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2.5 shadow-lg">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-secondary)] min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-surface-elevated)] px-2.5 py-1 text-[var(--text-primary)] font-medium border border-[var(--border-warm)]">
              <Clock className="h-3 w-3 text-[var(--accent-amber)]" />
              {activeDurationLabel}
            </span>
            <span className="rounded-full bg-[var(--bg-surface-elevated)] px-2.5 py-1 border border-[var(--border-subtle)]">
              {activeVibeCount > 0 ? `${activeVibeCount} vibe${activeVibeCount > 1 ? 's' : ''}` : 'Cualquier vibe'}
            </span>
            <span className="rounded-full bg-[var(--bg-surface-elevated)] px-2.5 py-1 border border-[var(--border-subtle)]">
              {activeLangLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleCollapseMobile}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-hover)] bg-[var(--bg-surface-elevated)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-amber)] transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--accent-amber)]" />
            Ajustar
          </button>
        </div>
      )}

      {/* Panel principal de 3 filtros visibles */}
      <form
        onSubmit={handleFormSubmit}
        className={`${
          hasResults && isCollapsedMobile ? 'hidden md:block' : 'block'
        } rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)]`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
          {/* FILTRO 1: Duración de comida */}
          <fieldset className="lg:col-span-4 space-y-2">
            <legend className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              <Clock className="h-3.5 w-3.5 text-[var(--accent-amber)]" />
              Duración de comida
            </legend>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Duración de comida">
              {DURATION_OPTIONS.map((opt) => {
                const selected = duration === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onDurationChange(opt.id)}
                    className={`group flex flex-col items-start justify-center rounded-xl border px-2.5 py-2 text-left transition-all duration-150 cursor-pointer ${
                      selected
                        ? 'border-[var(--accent-amber)] bg-[rgba(245,158,11,0.12)] shadow-[0_0_20px_rgba(245,158,11,0.12)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-pill)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-surface-elevated)]'
                    }`}
                  >
                    <span
                      className={`font-mono-time text-xs sm:text-[13px] font-semibold leading-tight ${
                        selected ? 'text-[var(--accent-amber)]' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="mt-0.5 text-[11px] text-[var(--text-secondary)] leading-tight truncate w-full">
                      {opt.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* FILTRO 2: Vibe / Categoría + Input opcional */}
          <fieldset className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <legend className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent-amber)]" />
                Vibe / Categoría
              </legend>
              <span className="text-[11px] text-[var(--text-muted)]">
                {vibes.length === 0 ? 'Todos mezclados' : `${vibes.length} seleccionado${vibes.length > 1 ? 's' : ''}`}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {VIBE_CATEGORIES.map((cat) => {
                const active = vibes.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onToggleVibe(cat.id)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-150 cursor-pointer ${
                      active
                        ? 'border-[var(--accent-amber)] bg-[var(--accent-amber)] text-[#120D08] font-semibold shadow-[0_2px_12px_rgba(245,158,11,0.28)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-pill)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="relative pt-0.5">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={topic}
                onChange={(e) => onTopicChange(e.target.value)}
                placeholder="¿Algún tema específico? (ej. espacio, IA, música...)"
                aria-label="¿Algún tema específico?"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)]/80 pl-8 pr-8 py-1.5 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-amber)] focus:outline-none transition-colors"
              />
              {topic && (
                <button
                  type="button"
                  onClick={() => onTopicChange('')}
                  aria-label="Borrar tema específico"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </fieldset>

          {/* FILTRO 3: Idioma + Botón Principal */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-3 h-full">
            <fieldset className="space-y-2">
              <legend className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                <Globe className="h-3.5 w-3.5 text-[var(--accent-amber)]" />
                Idioma
              </legend>
              <div
                className="grid grid-cols-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)]/80 p-1"
                role="radiogroup"
                aria-label="Idioma del video"
              >
                {LANGUAGE_OPTIONS.map((opt) => {
                  const selected = language === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => onLanguageChange(opt.id)}
                      className={`rounded-lg py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
                        selected
                          ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-warm)] shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent-amber)] to-[var(--accent-ember)] px-4 py-2.5 text-sm font-bold text-[#140C05] shadow-[0_8px_24px_rgba(245,158,11,0.28)] hover:brightness-110 active:scale-[0.99] disabled:opacity-60 transition-all duration-150 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-[#140C05]/30 border-t-[#140C05] animate-spin" />
                  <span>Sirviendo opciones...</span>
                </>
              ) : (
                <span>Encontrar qué ver</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
