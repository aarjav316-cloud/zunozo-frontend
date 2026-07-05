const EmptyState = ({ onCreateEvent }) => {
  return (
    <div className="text-center py-24">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-900 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-zinc-600"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-white mb-3">No events yet</h2>
      <p className="text-zinc-500 mb-8 max-w-md mx-auto">
        Start creating your first event and share amazing experiences with your
        audience
      </p>
      <button
        onClick={onCreateEvent}
        className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors inline-flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Create Your First Event
      </button>
    </div>
  );
};

export default EmptyState;
