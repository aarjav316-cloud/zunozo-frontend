import { formatDate } from "../../utils/helpers";

const PendingEventCard = ({ event, onViewDetails, onAction }) => {
  const getStatusColor = (status) => {
    const colors = {
      PENDING_REVIEW: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      REJECTED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      CHANGES_REQUESTED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };
    return colors[status] || colors.PENDING_REVIEW;
  };

  return (
    <div className="bg-[#18181B] border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all group">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-zinc-900">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(event.status)}`}
        >
          {event.status.replace(/_/g, " ")}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          {event.organizer && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <svg
                className="w-4 h-4"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span className="line-clamp-1">{event.organizer.fullname}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <svg
              className="w-4 h-4"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h.008v.008H6V6z"
              />
            </svg>
            <span>{event.category}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <svg
              className="w-4 h-4"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <span className="line-clamp-1">{event.venue.name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <svg
              className="w-4 h-4"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <span>{formatDate(event.startDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Submitted {formatDate(event.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-zinc-800">
          <button
            onClick={() => onViewDetails(event)}
            className="flex-1 h-9 px-4 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onAction(event, "APPROVED")}
            className="h-9 px-4 bg-emerald-500/10 text-emerald-500 rounded-lg text-sm font-medium hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
          >
            Approve
          </button>
          <button
            onClick={() => onAction(event, "REJECTED")}
            className="h-9 px-4 bg-rose-500/10 text-rose-500 rounded-lg text-sm font-medium hover:bg-rose-500/20 transition-colors border border-rose-500/20"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingEventCard;
