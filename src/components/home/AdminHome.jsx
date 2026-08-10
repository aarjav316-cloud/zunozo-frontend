import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboardStats } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/helpers";
import AdminNavbar from "../admin/AdminNavbar";

const AdminHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
    fetchDashboardData();
  }, []);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#09090B]">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
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
            Manage events, organizers, and keep the platform running smoothly
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-6 py-3 bg-amber-500 text-amber-950 rounded-xl font-medium hover:bg-amber-400 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            Review Pending Events
          </button>
          <button
            onClick={() => navigate("/admin/organizers")}
            className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors"
          >
            Manage Organizers
          </button>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
          >
            View All Events
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            
            {/* Total Users */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</div>
              <div className="text-sm text-zinc-400">Total Users</div>
            </div>

            {/* Total Organizers */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{stats.totalOrganizers}</div>
              <div className="text-sm text-zinc-400">Total Organizers</div>
            </div>

            {/* Total Bookings */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{stats.totalBookings}</div>
              <div className="text-sm text-blue-500">Total Bookings</div>
            </div>

            {/* Total Revenue */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{formatCurrency(stats.totalRevenue)}</div>
              <div className="text-sm text-purple-500">Total Revenue</div>
            </div>

            {/* Pending Reviews */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{stats.pendingEvents}</div>
              <div className="text-sm text-amber-500">Pending Reviews</div>
            </div>

            {/* Approved Events */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{stats.approvedEvents}</div>
              <div className="text-sm text-emerald-500">Approved Events</div>
            </div>

            {/* Rejected Events */}
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 hover:border-rose-500/30 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{stats.rejectedEvents}</div>
              <div className="text-sm text-rose-500">Rejected Events</div>
            </div>

            {/* Total Events */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="text-3xl font-bold text-white mb-1">{stats.totalEvents}</div>
              <div className="text-sm text-zinc-400">Total Events</div>
            </div>

          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Pending Events</h2>
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
                <div key={i} className="h-64 bg-zinc-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Pending Events</h3>
              <p className="text-zinc-400">🎉 Everything has been reviewed. You're all caught up!</p>
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
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">{event.title}</h3>
                    <div className="space-y-1 text-xs text-zinc-500">
                      {event.organizer && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          <span>{event.organizer.fullname}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
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
