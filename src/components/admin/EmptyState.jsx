const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-emerald-500"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No Pending Events</h3>
      <p className="text-zinc-400 text-center max-w-md">
        🎉 Everything has been reviewed. You're all caught up!
      </p>
    </div>
  );
};

export default EmptyState;
