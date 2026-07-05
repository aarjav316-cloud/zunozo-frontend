const SkeletonCard = () => {
  return (
    <div className="bg-[#18181B] rounded-[20px] overflow-hidden border border-zinc-800">
      {/* Image Skeleton */}
      <div className="h-56 bg-zinc-900 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-zinc-900 rounded animate-pulse w-3/4" />
          <div className="h-5 bg-zinc-900 rounded animate-pulse w-1/2" />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-4 bg-zinc-900 rounded animate-pulse" />
          <div className="h-4 bg-zinc-900 rounded animate-pulse" />
        </div>

        <div className="h-3 bg-zinc-900 rounded animate-pulse w-2/3" />

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-10 bg-zinc-900 rounded-xl animate-pulse" />
          <div className="flex-1 h-10 bg-zinc-900 rounded-xl animate-pulse" />
          <div className="h-10 w-20 bg-zinc-900 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
