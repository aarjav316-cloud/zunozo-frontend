import { useNavigate } from "react-router-dom";
import { useState } from "react";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleClick = () => {
    navigate(`/events/${event.slug}`);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  const { month, day } = formatDate(event.startDate);

  return (
    <div onClick={handleClick} className="flex-none w-80 group cursor-pointer">
      {/* Card Container with Premium Shadow */}
      <div className="relative rounded-[28px] transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
        {/* Main Card - Layered Glass Effect */}
        <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-b from-zinc-900/40 to-zinc-950/80 backdrop-blur-sm border border-white/5">
          {/* Image Section with Enhanced Gradient */}
          <div className="relative h-80 overflow-hidden">
            {/* Event Image */}
            {event.coverImage ? (
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                style={{
                  filter: "contrast(1.05) saturate(1.1)",
                }}
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-purple-600 via-pink-500 to-orange-500" />
            )}

            {/* Enhanced Multi-Layer Gradient Overlay */}
            <div
              className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
              }}
            />

            {/* Floating UI Elements */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
              {/* Premium Glass Category Badge */}
              {event.category && (
                <div className="group/badge backdrop-blur-xl bg-white/[0.08] border border-white/10 rounded-full px-3.5 py-1.5 shadow-lg transition-all duration-300 hover:bg-white/[0.12] hover:border-white/20">
                  <span className="text-[11px] font-semibold text-white tracking-wide">
                    {event.category}
                  </span>
                </div>
              )}

              {/* Premium Bookmark Button */}
              <button
                onClick={handleBookmark}
                className="backdrop-blur-xl bg-white/[0.08] border border-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-white/[0.15] hover:scale-110 hover:rotate-12 shadow-lg active:scale-95"
              >
                <svg
                  className={`w-[18px] h-[18px] transition-all duration-300 ${
                    isBookmarked
                      ? "fill-purple-400 stroke-purple-400 scale-110"
                      : "fill-none stroke-white"
                  }`}
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Premium Glassmorphism Date Widget */}
            <div className="absolute bottom-4 left-4 z-10 group/date">
              <div
                className="backdrop-blur-xl rounded-2xl px-3 py-2 border border-white/[0.18] transition-all duration-300 ease-out group-hover/date:scale-[1.03] group-hover/date:border-white/25 group-hover/date:backdrop-blur-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.12) 100%)",
                  boxShadow:
                    "inset 0 1px 1px 0 rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                {/* Month */}
                <div
                  className="text-[8px] font-semibold tracking-[0.1em] uppercase mb-0.5"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {month}
                </div>
                {/* Day */}
                <div
                  className="text-lg font-bold leading-none"
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {day}
                </div>
              </div>
            </div>
          </div>

          {/* Immersive Bottom Section - Blends with Image */}
          <div className="relative px-5 pt-6 pb-5">
            {/* Subtle Top Highlight Line */}
            <div className="absolute top-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Event Title - Hero Typography */}
            <h3
              className="text-[22px] font-bold text-white leading-[1.2] line-clamp-2 mb-4 tracking-[-0.02em]"
              style={{
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {event.title}
            </h3>

            {/* Location - Refined Secondary Info */}
            <div className="flex items-center gap-2 mb-5">
              <svg
                className="w-3.5 h-3.5 text-gray-500 shrink-0"
                fill="none"
                strokeWidth="2.5"
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
              <p className="text-[13px] text-gray-400 font-medium tracking-wide">
                {event.venue?.city}
                {event.venue?.state && `, ${event.venue.state}`}
              </p>
            </div>

            {/* Premium Bottom Row - Balanced Layout */}
            <div className="flex items-center justify-between">
              {/* Price with Accent */}
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl font-bold text-purple-400 tracking-tight"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {event.isFree ? "Free" : `₹${event.price}`}
                </span>
              </div>

              {/* Attendees or Category Badge */}
              {event.attendees ? (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-500 to-pink-500 border-2 border-zinc-900 ring-1 ring-white/10" />
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 border-2 border-zinc-900 ring-1 ring-white/10" />
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-orange-500 to-yellow-500 border-2 border-zinc-900 ring-1 ring-white/10" />
                  </div>
                  <span className="text-[11px] text-gray-500 font-semibold tracking-wide">
                    {event.attendees}+ going
                  </span>
                </div>
              ) : (
                event.category && (
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-full px-3 py-1">
                    <span className="text-[10px] font-semibold text-gray-400 tracking-wide uppercase">
                      {event.category}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Ambient Light Effect on Hover */}
        <div
          className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139, 92, 246, 0.08), transparent 40%)",
          }}
        />
      </div>
    </div>
  );
};

export default EventCard;
