import { Skeleton } from '@/components/ui/skeleton';

export function VerseSkeleton() {
  return (
    <div className="verse-card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-12 h-4" />
        </div>
        <Skeleton className="w-9 h-9 rounded-full" />
      </div>

      {/* Arabic */}
      <Skeleton className="h-12 w-full" />

      {/* Transliteration */}
      <Skeleton className="h-4 w-3/4" />

      {/* Translation */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export function VerseListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <VerseSkeleton key={i} />
      ))}
    </div>
  );
}
