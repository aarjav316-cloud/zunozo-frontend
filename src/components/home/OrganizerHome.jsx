import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEvents } from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext";

const OrganizerHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getMyEvents();
      if (response.success && response.events) {
        const events = response.events;
        setStats({
          total: events.length,
          approved: events.filter((e) => e.status === "APPROVED").length,
          pending: events.filter((e) => e.status === "PENDING_REVIEW").length,
          rejected: events.filter((e) => e.status === "REJECTED").length,
        });
        setRecentEvents(events.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1
            className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-3"
            style={{
              fontFamily: '"Geist", sans-serif',
              letterSpacing: "-0.03em",
            }}
          >
            Welcome back, {user?.fullname?.split(" ")[0] || "Organizer"}
          </h1>
          <p className="text-zinc-500 text-lg">
            Manage your events and create amazing experiences
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={() => navigate("/organizer/events/create")}
            className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors flex items-center gap-2"
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
            Create Event
          </button>
          <button
            onClick={() => navigate("/organizer/events")}
            className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
          >
            My Events
          </button>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
          >
            Browse Events
          </button>
        </div>

        {/* Statistics */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-zinc-900 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.total}
              </div>
              <div className="text-sm text-zinc-400">Total Events</div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <svg
                  className="w-5 h-5 text-emerald-500"
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
              <div className="text-3xl font-bold text-white mb-1">
                {stats.approved}
              </div>
              <div className="text-sm text-emerald-500">Approved</div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <svg
                  className="w-5 h-5 text-amber-500"
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
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.pending}
              </div>
              <div className="text-sm text-amber-500">Pending Review</div>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 hover:border-rose-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <svg
                  className="w-5 h-5 text-rose-500"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.rejected}
              </div>
              <div className="text-sm text-rose-500">Rejected</div>
            </div>
          </div>
        )}

        {/* Recent Events */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Events</h2>
            <button
              onClick={() => navigate("/organizer/events")}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-zinc-900 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-zinc-600"
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
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No Events Yet
              </h3>
              <p className="text-zinc-400 mb-4">
                Create your first event to get started
              </p>
              <button
                onClick={() => navigate("/organizer/events/create")}
                className="px-6 py-2.5 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors"
              >
                Create Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
                <div
                  key={event._id}
                  onClick={() =>
                    navigate(`/organizer/events/${event._id}/preview`)
                  }
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all cursor-pointer group"
                >
                  <div className="relative h-40 overflow-hidden bg-zinc-800">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        {event.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          event.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : event.status === "PENDING_REVIEW"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {event.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerHome;
