const NoResults = ({ onClearFilters }) => {
  return (
    <div className="text-center py-24">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-900 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-zinc-600"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">
        No matching events
      </h2>
      <p className="text-zinc-500 mb-6 text-sm">
        Try another search or adjust your filters
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default NoResults;
