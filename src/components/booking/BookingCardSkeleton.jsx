/**
 * =====================================================
 * BOOKING CARD SKELETON
 * =====================================================
 * Loading placeholder matching BookingCard layout.
 * Uses animate-pulse on zinc backgrounds —
 * same pattern as admin SkeletonCard.jsx.
 * =====================================================
 */

const BookingCardSkeleton = () => {
  return (
    <div className="bg-[#18181B] border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image skeleton */}
        <div className="w-full sm:w-48 h-40 sm:h-auto bg-zinc-900 animate-pulse shrink-0" />

        {/* Content skeleton */}
        <div className="flex-1 p-5 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-5 bg-zinc-900 rounded animate-pulse w-3/4" />
            <div className="flex gap-4">
              <div className="h-4 bg-zinc-900 rounded animate-pulse w-32" />
              <div className="h-4 bg-zinc-900 rounded animate-pulse w-24" />
              <div className="h-4 bg-zinc-900 rounded animate-pulse w-28" />
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
            <div className="flex gap-5">
              <div className="h-4 bg-zinc-900 rounded animate-pulse w-20" />
              <div className="h-4 bg-zinc-900 rounded animate-pulse w-16" />
              <div className="h-4 bg-zinc-900 rounded animate-pulse w-36" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 bg-zinc-900 rounded-lg animate-pulse w-24" />
              <div className="h-9 bg-zinc-900 rounded-lg animate-pulse w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCardSkeleton;
