import { Flame, Clapperboard } from 'lucide-react';

export function Header({ seenCount, hasResults, onResetHome }) {
  return (
    <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onResetHome}
        className="group flex items-center gap-3 text-left focus-visible:rounded-xl"
        aria-label="¿Qué Veo Hoy? — Volver al inicio"
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-warm)] shadow-[0_0_24px_rgba(245,158,11,0.16)] transition-transform duration-200 group-hover:scale-105">
          <Clapperboard className="h-5 w-5 text-[var(--accent-amber)]" strokeWidth={1.9} />
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[var(--accent-cinema)] ring-2 ring-[var(--bg-canvas)]"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)] leading-none">
              ¿Qué Veo Hoy?
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-amber)]">
              <Flame className="h-3 w-3" />
              Mesa &amp; Play
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-snug">
            Elige en segundos, antes de que se enfríe la comida.
          </p>
        </div>
      </button>

      {hasResults && seenCount > 0 && (
        <div
          className="hidden sm:flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-xs text-[var(--text-secondary)]"
          title="Videos guardados para no repetirse"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-amber)]" />
          <span>{seenCount} en historial</span>
        </div>
      )}
    </header>
  );
}
