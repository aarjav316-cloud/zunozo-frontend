import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEvents } from "../../api/eventApi";
import { getOrganizerProfile } from "../../api/organizerApi";
import { useAuth } from "../../context/AuthContext";
import OrganizerNavbar from "../organizer/OrganizerNavbar";

const OrganizerHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [organizerData, setOrganizerData] = useState(null);
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
      // Fetch organizer profile and events in parallel
      const [profileResponse, eventsResponse] = await Promise.all([
        getOrganizerProfile(),
        getMyEvents(),
      ]);

      if (profileResponse.success && profileResponse.data) {
        setOrganizerData(profileResponse.data);
      }

      if (eventsResponse.success && eventsResponse.events) {
        const events = eventsResponse.events;
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
    <div className="min-h-screen bg-[#09090B] overflow-x-hidden">
      {/* Organizer Navbar */}
      <OrganizerNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-10">
          <h1
            className="text-white tracking-tight mb-2 sm:mb-3 font-bold"
            style={{
              fontFamily: '"Bricolage Grotesque", sans-serif',
              letterSpacing: "-0.03em",
              fontSize: "clamp(1.75rem, 5vw, 3.75rem)",
              lineHeight: 1.1,
            }}
          >
            Welcome back,{" "}
            {organizerData?.organizer?.organizerName?.split(" ")[0] ||
              user?.name?.split(" ")[0] ||
              "Organizer"}
          </h1>
          <p
            className="text-zinc-500 text-base sm:text-lg md:text-xl font-normal"
            style={{
              fontFamily: '"Bricolage Grotesque", sans-serif',
            }}
          >
            Manage your events and create amazing experiences
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
          <button
            onClick={() => navigate("/organizer/events/create")}
            className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
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
            className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
          >
            My Events
          </button>
          <button
            onClick={() => navigate("/events")}
            className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
          >
            Browse Events
          </button>
        </div>

        {/* Statistics */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 sm:h-36 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
            {/* Total Events */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-zinc-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeWidth="1.75"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                </span>
              </div>
              <div
                className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {stats.total}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto">
                Total Events
              </div>
            </div>

            {/* Approved */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-zinc-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeWidth="1.75"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </div>
              <div
                className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {stats.approved}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto">
                Approved
              </div>
            </div>

            {/* Pending Review */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-zinc-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeWidth="1.75"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </div>
              <div
                className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {stats.pending}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto">
                Pending Review
              </div>
            </div>

            {/* Rejected */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-zinc-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeWidth="1.75"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </div>
              <div
                className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {stats.rejected}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto">
                Rejected
              </div>
            </div>
          </div>
        )}

        {/* Recent Events */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Recent Events</h2>
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
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 sm:p-12 text-center">
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
                        className={`text-xs px-2 py-1 rounded ${event.status === "APPROVED"
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
