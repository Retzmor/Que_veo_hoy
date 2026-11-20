export function VideoCardSkeleton({ index = 0 }) {
  return (
    <div
      aria-hidden="true"
      style={{ animationDelay: `${index * 60}ms` }}
      className="flex flex-col justify-between bg-surface-container-low rounded-DEFAULT p-space-md border border-white/5 animate-pulse"
    >
      <div>
        <div className="relative w-full aspect-video rounded-DEFAULT bg-surface-container-highest mb-space-md">
          <div className="absolute top-2.5 left-2.5 h-4 w-16 rounded bg-black/40" />
          <div className="absolute bottom-2.5 right-2.5 h-5 w-14 rounded bg-black/40" />
        </div>

        <div className="flex flex-col gap-2 mb-space-md">
          <div className="h-4 w-11/12 rounded bg-surface-container-high" />
          <div className="h-4 w-2/3 rounded bg-surface-container-high" />
          <div className="h-3 w-1/2 rounded bg-surface-container mt-1" />
        </div>
      </div>

      <div className="pt-space-sm flex items-center gap-space-sm">
        <div className="h-9 flex-1 rounded-full bg-red-600/25" />
        <div className="w-9 h-9 rounded-full bg-surface-container-highest shrink-0" />
        <div className="w-9 h-9 rounded-full bg-surface-container shrink-0" />
      </div>
    </div>
  );
}
