import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboardStats } from "../../api/adminApi";
import { formatDate } from "../../utils/helpers";
import AdminNavbar from "../admin/AdminNavbar";

const AdminHome = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    pendingEvents: 0,
    approvedEvents: 0,
    rejectedEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getAdminDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
          setRecentEvents(response.data.recentPendingEvents || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#09090B] overflow-x-hidden">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1
            className="text-white tracking-tight mb-2 sm:mb-3 font-bold"
            style={{
              fontFamily: '"Geist", sans-serif',
              letterSpacing: "-0.03em",
              fontSize: "clamp(1.75rem, 5vw, 3.75rem)",
              lineHeight: 1.1,
            }}
          >
            Welcome back, Admin
          </h1>
          <p className="text-zinc-500 text-base sm:text-lg md:text-xl font-normal">
            Manage events, organizers, and keep the platform running smoothly
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2.5 text-sm sm:text-base whitespace-nowrap"
          >
            <svg
              className="w-5 h-5 shrink-0"
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
            onClick={() => navigate("/admin/organizers")}
            className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center text-sm sm:text-base whitespace-nowrap"
          >
            Manage Organizers
          </button>
          <button
            onClick={() => navigate("/events")}
            className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center text-sm sm:text-base whitespace-nowrap"
          >
            View All Events
          </button>
        </div>

        {/* Statistics Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 min-[375px]:gap-3 sm:gap-4 mb-8 sm:mb-10">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-28 min-[375px]:h-32 sm:h-36 bg-zinc-900/60 border border-zinc-800/50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 min-[375px]:gap-3 sm:gap-4 mb-8 sm:mb-10">
            {/* Total Users */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 min-[375px]:p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-zinc-400">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
              </div>
              <div
                className="text-2xl min-[375px]:text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1 truncate"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {stats.totalUsers}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto truncate">
                Total Users
              </div>
            </div>

            {/* Total Organizers */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 min-[375px]:p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-zinc-400">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
              </div>
              <div
                className="text-2xl min-[375px]:text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1 truncate"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {stats.totalOrganizers}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto truncate">
                Total Organizers
              </div>
            </div>

            {/* Total Bookings */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 min-[375px]:p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-zinc-400">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18m-3-12h15a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 15V8.25A2.25 2.25 0 014.5 6z" />
                  </svg>
                </span>
              </div>
              <div
                className="text-2xl min-[375px]:text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1 truncate"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {stats.totalBookings}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto truncate">
                Total Bookings
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 min-[375px]:p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-zinc-400">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <div
                className="text-2xl min-[375px]:text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1 truncate"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto truncate">
                Total Revenue
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 min-[375px]:p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-zinc-400">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <div
                className="text-2xl min-[375px]:text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1 truncate"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {stats.pendingEvents}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto truncate">
                Pending Reviews
              </div>
            </div>

            {/* Approved Events */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 min-[375px]:p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-zinc-400">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <div
                className="text-2xl min-[375px]:text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1 truncate"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {stats.approvedEvents}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto truncate">
                Approved Events
              </div>
            </div>

            {/* Rejected Events */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 min-[375px]:p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-zinc-400">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <div
                className="text-2xl min-[375px]:text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1 truncate"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {stats.rejectedEvents}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto truncate">
                Rejected Events
              </div>
            </div>

            {/* Total Events */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 min-[375px]:p-4 sm:p-5 lg:p-6 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-zinc-400">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" strokeWidth="1.75" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </span>
              </div>
              <div
                className="text-2xl min-[375px]:text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-1 truncate"
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {stats.totalEvents}
              </div>
              <div className="text-[10px] min-[375px]:text-[11px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wide sm:tracking-wider leading-tight mt-auto truncate">
                Total Events
              </div>
            </div>
          </div>
        )}

        {/* Recent Pending Events */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Recent Pending Events</h2>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              View all &rarr;
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-zinc-900/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-8 sm:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-zinc-500" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Pending Events</h3>
              <p className="text-zinc-400">Everything has been reviewed. You're all caught up!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
                <div
                  key={event._id}
                  onClick={() => navigate("/admin/dashboard")}
                  className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700/80 transition-all cursor-pointer group"
                >
                  <div className="relative h-40 overflow-hidden bg-zinc-800">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Pending
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">{event.title}</h3>
                    <div className="space-y-1 text-xs text-zinc-500">
                      {event.organizer && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          <span>{event.organizer.fullname}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      </div>
    </div>
  );
};

export default AdminHome;
