const SkeletonCard = () => {
  return (
    <div className="bg-[#18181B] border border-zinc-800 rounded-xl overflow-hidden">
      <div className="h-48 bg-zinc-900 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-zinc-900 rounded animate-pulse w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-zinc-900 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-zinc-900 rounded animate-pulse w-2/3" />
          <div className="h-4 bg-zinc-900 rounded animate-pulse w-1/2" />
        </div>
        <div className="flex gap-2 pt-4">
          <div className="flex-1 h-9 bg-zinc-900 rounded-lg animate-pulse" />
          <div className="h-9 w-20 bg-zinc-900 rounded-lg animate-pulse" />
          <div className="h-9 w-20 bg-zinc-900 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
