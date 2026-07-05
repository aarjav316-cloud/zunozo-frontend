import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingEvents, getApprovedEvents } from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/helpers";
import AdminNavbar from "../admin/AdminNavbar";

const AdminHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch pending events (includes pending, rejected, changes requested)
      const pendingResponse = await getPendingEvents();

      // Fetch approved events
      const approvedResponse = await getApprovedEvents();

      let pendingCount = 0;
      let approvedCount = 0;
      let rejectedCount = 0;
      let changesRequestedCount = 0;
      let recentPending = [];

      if (pendingResponse.success && pendingResponse.events) {
        const events = pendingResponse.events;
        pendingCount = events.filter(
          (e) => e.status === "PENDING_REVIEW",
        ).length;
        rejectedCount = events.filter((e) => e.status === "REJECTED").length;
        changesRequestedCount = events.filter(
          (e) => e.status === "CHANGES_REQUESTED",
        ).length;
        recentPending = events
          .filter((e) => e.status === "PENDING_REVIEW")
          .slice(0, 3);
      }

      if (approvedResponse.success && approvedResponse.events) {
        approvedCount = approvedResponse.events.length;
      }

      const totalCount =
        pendingCount + approvedCount + rejectedCount + changesRequestedCount;

      setStats({
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        total: totalCount,
      });

      setRecentEvents(recentPending);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Admin Navbar */}
      <AdminNavbar />

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
            Welcome back, Admin
          </h1>
          <p className="text-zinc-500 text-lg">
            Manage events and keep the platform running smoothly
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={() => navigate("/admin/dashboard")}
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
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
            Review Pending Events
          </button>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
          >
            View All Events
          </button>
          <button
            className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-xl font-medium cursor-not-allowed"
            disabled
          >
            Manage Users
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
              <div className="text-sm text-amber-500">Pending Reviews</div>
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
              <div className="text-sm text-emerald-500">Approved Events</div>
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
              <div className="text-sm text-rose-500">Rejected Events</div>
            </div>

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
          </div>
        )}

        {/* Recent Pending Events */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Recent Pending Events
            </h2>
            <button
              onClick={() => navigate("/admin/dashboard")}
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
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-emerald-500"
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
              <h3 className="text-lg font-semibold text-white mb-2">
                No Pending Events
              </h3>
              <p className="text-zinc-400">
                🎉 Everything has been reviewed. You're all caught up!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
                <div
                  key={event._id}
                  onClick={() => navigate("/admin/dashboard")}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all cursor-pointer group"
                >
                  <div className="relative h-40 overflow-hidden bg-zinc-800">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500/90 backdrop-blur-sm text-amber-100 rounded text-xs font-medium">
                      PENDING
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="space-y-1 text-xs text-zinc-500">
                      {event.organizer && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
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
                          <span>{event.organizer.fullname}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Section Placeholder */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Platform Activity
          </h2>
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
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <p className="text-zinc-400">
              Analytics and activity metrics coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
