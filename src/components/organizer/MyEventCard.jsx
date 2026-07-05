import { useNavigate } from "react-router-dom";

const MyEventCard = ({ event, onDelete, viewMode = "list" }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "PENDING_REVIEW":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "CHANGES_REQUESTED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "CANCELLED":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      case "COMPLETED":
        return "bg-teal-500/10 text-teal-500 border-teal-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, " ");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <div className="bg-[#18181B] rounded-[20px] overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all group">
        <div className="flex flex-col md:flex-row">
          {/* Cover Image */}
          <div className="relative w-full md:w-80 aspect-video overflow-hidden bg-zinc-900">
            {event.coverImage ? (
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-indigo-600 via-purple-500 to-pink-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  {event.category}
                </span>
              </div>
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(event.status)}`}
              >
                {formatStatus(event.status)}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white leading-tight mb-4">
              {event.title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm">
              <div className="flex items-center gap-2 text-zinc-400">
                <svg
                  className="w-4 h-4 shrink-0"
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
              <div className="flex items-center gap-2 text-zinc-400">
                <svg
                  className="w-4 h-4 shrink-0"
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
                <span>{event.venue?.city}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <svg
                  className="w-4 h-4 shrink-0"
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
                <span>Created {formatDate(event.createdAt)}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => navigate(`/events/${event.slug}`)}
                className="flex-1 px-4 h-9 bg-transparent border border-zinc-800 text-zinc-300 rounded-lg font-medium hover:bg-zinc-900 hover:text-white transition-colors text-sm inline-flex items-center justify-center gap-2"
              >
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
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                View
              </button>
              <button
                onClick={() => navigate(`/organizer/events/${event._id}/edit`)}
                className="flex-1 px-4 h-9 bg-transparent border border-zinc-800 text-zinc-300 rounded-lg font-medium hover:bg-zinc-900 hover:text-white transition-colors text-sm inline-flex items-center justify-center gap-2"
              >
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Edit
              </button>
              <button
                onClick={() => onDelete(event._id)}
                className="px-4 h-9 bg-transparent border border-rose-900/50 text-rose-400 rounded-lg font-medium hover:bg-rose-500/10 hover:border-rose-500/50 transition-colors text-sm inline-flex items-center justify-center gap-2"
              >
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
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#18181B] rounded-[20px] overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all group">
      <div className="relative aspect-video overflow-hidden bg-zinc-900">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-indigo-600 via-purple-500 to-pink-500" />
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
              {event.category}
            </span>
          </div>
          <div
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(event.status)}`}
          >
            {formatStatus(event.status)}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white leading-tight line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-zinc-400">
            <svg
              className="w-4 h-4 shrink-0"
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
          <div className="flex items-center gap-2 text-zinc-400">
            <svg
              className="w-4 h-4 shrink-0"
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
            <span>{event.venue?.city}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <svg
              className="w-4 h-4 shrink-0"
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
            <span>Created {formatDate(event.createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => navigate(`/events/${event.slug}`)}
            className="flex-1 px-3 h-9 bg-transparent border border-zinc-800 text-zinc-300 rounded-lg font-medium hover:bg-zinc-900 hover:text-white transition-colors text-sm"
          >
            View
          </button>
          <button
            onClick={() => navigate(`/organizer/events/${event._id}/edit`)}
            className="flex-1 px-3 h-9 bg-transparent border border-zinc-800 text-zinc-300 rounded-lg font-medium hover:bg-zinc-900 hover:text-white transition-colors text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(event._id)}
            className="px-3 h-9 bg-transparent border border-rose-900/50 text-rose-400 rounded-lg font-medium hover:bg-rose-500/10 hover:border-rose-500/50 transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyEventCard;
