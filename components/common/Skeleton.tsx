export function ComicCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="aspect-[3/4] w-full bg-surface-elevated rounded-lg" />
      <div className="h-4 bg-surface-elevated rounded w-3/4" />
      <div className="h-3 bg-surface-elevated rounded w-1/2" />
    </div>
  );
}

export function ComicGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ComicCardSkeleton key={i} />
      ))}
    </div>
  );
}
