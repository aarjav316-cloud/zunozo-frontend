import { useNavigate } from "react-router-dom";

const MyEventCard = ({ event, onDelete }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "PENDING_REVIEW":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "CHANGES_REQUESTED":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "CANCELLED":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "COMPLETED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
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

  return (
    <div className="bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all group">
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden bg-zinc-800">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-indigo-600 via-purple-500 to-pink-500" />
        )}

        {/* Status Badge - Overlay on Image */}
        <div className="absolute top-3 right-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(event.status)}`}
          >
            {formatStatus(event.status)}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 space-y-4">
        {/* Category Badge */}
        <div className="inline-block">
          <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1">
            <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
              {event.category}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white leading-tight line-clamp-2">
          {event.title}
        </h3>

        {/* Event Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-gray-500 shrink-0"
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
            <span className="text-gray-400">{formatDate(event.startDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-gray-500 shrink-0"
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
            <span className="text-gray-400">{event.venue?.city}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-gray-500 shrink-0"
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
            <span className="text-gray-400">
              Created {formatDate(event.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => navigate(`/events/${event.slug}`)}
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-colors text-sm"
          >
            View
          </button>
          <button
            onClick={() => navigate(`/organizer/events/${event._id}/edit`)}
            className="flex-1 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#5558E3] transition-colors text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(event._id)}
            className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/20 transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyEventCard;
