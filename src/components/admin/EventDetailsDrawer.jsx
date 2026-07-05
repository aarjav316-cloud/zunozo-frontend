import { useEffect } from "react";
import { formatDate } from "../../utils/helpers";

const EventDetailsDrawer = ({ event, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative h-full w-full max-w-2xl bg-[#09090B] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#09090B]/95 backdrop-blur-xl border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Event Details</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center justify-center"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Cover Image */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(event.status)}`}
            >
              {event.status.replace(/_/g, " ")}
            </div>
            <div className="text-sm text-zinc-500">
              Submitted {formatDate(event.createdAt)}
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {event.title}
            </h1>
            {event.shortDescription && (
              <p className="text-zinc-400">{event.shortDescription}</p>
            )}
          </div>

          {/* Organizer Info */}
          {event.organizer && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-zinc-400"
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
                </div>
                <div>
                  <div className="text-sm text-zinc-500">Organized by</div>
                  <div className="font-medium text-white">
                    {event.organizer.fullname}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {event.organizer.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-5 h-5 text-zinc-400"
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
                <span className="text-sm text-zinc-500">Category</span>
              </div>
              <div className="text-white font-medium">{event.category}</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
                <span className="text-sm text-zinc-500">Capacity</span>
              </div>
              <div className="text-white font-medium">{event.capacity}</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
                <span className="text-sm text-zinc-500">Pricing</span>
              </div>
              <div className="text-white font-medium">
                {event.isFree ? "Free" : `₹${event.price}`}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-5 h-5 text-zinc-400"
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
                <span className="text-sm text-zinc-500">Date & Time</span>
              </div>
              <div className="text-white font-medium">
                {formatDate(event.startDate)}
              </div>
              {event.endDate && (
                <div className="text-sm text-zinc-400 mt-1">
                  to {formatDate(event.endDate)}
                </div>
              )}
            </div>
          </div>

          {/* Venue */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <svg
                className="w-5 h-5 text-zinc-400"
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
              <span className="text-sm text-zinc-500">Venue</span>
            </div>
            <div className="text-white font-medium mb-2">
              {event.venue.name}
            </div>
            <div className="text-sm text-zinc-400">
              {event.venue.address}, {event.venue.city}, {event.venue.state}{" "}
              {event.venue.zipCode}
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Description
              </h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {event.gallery && event.gallery.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Gallery</h3>
              <div className="grid grid-cols-2 gap-4">
                {event.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video overflow-hidden rounded-lg bg-zinc-900"
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Comment */}
          {event.reviewComment && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Review Comment
              </h3>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-amber-200 leading-relaxed">
                  {event.reviewComment}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsDrawer;
