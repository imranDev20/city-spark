export default function ProductActionBarSkeleton() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="h-14 bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="h-full grid grid-cols-2 divide-x divide-gray-200">
          {/* Sort Button Skeleton */}
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
          </div>

          {/* Filter Button Skeleton */}
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-14 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Safe area padding for mobile browsers */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </div>
  );
}
