import { Trash2, Check } from 'lucide-react';

export function Footer({ seenCount, justCleared, onClearHistory }) {
  return (
    <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 mt-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)]/60">
      <p className="text-center sm:text-left">
        ¿Qué Veo Hoy? · Selección rápida sin algoritmo infinito.
      </p>

      <div className="flex items-center gap-3">
        {justCleared ? (
          <span className="inline-flex items-center gap-1 text-[var(--accent-amber)] font-medium">
            <Check className="h-3.5 w-3.5" />
            Historial limpio
          </span>
        ) : (
          <button
            type="button"
            onClick={onClearHistory}
            disabled={seenCount === 0}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] disabled:opacity-45 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>
              Limpiar historial de vistos{seenCount > 0 ? ` (${seenCount})` : ''}
            </span>
          </button>
        )}
      </div>
    </footer>
  );
}
