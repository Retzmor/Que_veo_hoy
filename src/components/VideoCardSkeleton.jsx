export function VideoCardSkeleton({ index = 0 }) {
  return (
    <div
      aria-hidden="true"
      style={{ animationDelay: `${index * 60}ms` }}
      className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] animate-pulse"
    >
      {/* Miniatura 16:9 */}
      <div className="relative aspect-video w-full bg-[var(--bg-surface-elevated)]">
        <div className="absolute top-2.5 left-2.5 h-5 w-14 rounded-md bg-white/10" />
        <div className="absolute bottom-2.5 right-2.5 h-5 w-12 rounded-md bg-white/10" />
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col justify-between p-4 gap-3.5">
        <div className="space-y-2">
          <div className="h-4 w-11/12 rounded bg-[var(--bg-surface-elevated)]" />
          <div className="h-4 w-3/4 rounded bg-[var(--bg-surface-elevated)]" />
          <div className="pt-1 h-3 w-1/2 rounded bg-[var(--bg-surface-elevated)]/80" />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <div className="h-9 flex-1 rounded-xl bg-[rgba(245,158,11,0.18)]" />
          <div className="h-9 w-24 rounded-xl bg-[var(--bg-surface-elevated)]" />
        </div>
      </div>
    </div>
  );
}
