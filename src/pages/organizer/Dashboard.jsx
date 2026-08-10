import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../api/organizerApi";
import { useSocket } from "../../context/SocketContext";
import StatCard from "../../components/organizer/StatCard";
import Toast from "../../components/ui/Toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalBookings: 0,
    ticketsSold: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ---------------------------------------------------
   * Real-time booking listener (Socket.io)
   * ---------------------------------------------------
   * Optimistically updates dashboard stats when a new
   * booking comes in, and shows a toast notification.
   */
  useEffect(() => {
    if (!socket) return;

    const handleNewBooking = (data) => {
      // Optimistic stat update
      setStats((prev) => ({
        ...prev,
        totalBookings: prev.totalBookings + 1,
        ticketsSold: prev.ticketsSold + (data.quantity || 0),
        revenue: prev.revenue + (data.totalAmount || 0),
      }));

      setToast({
        message: `New booking! ${data.quantity} ticket(s) for ${data.eventTitle || "an event"}`,
        type: "success",
      });
    };

    socket.on("booking:new", handleNewBooking);

    return () => {
      socket.off("booking:new", handleNewBooking);
    };
  }, [socket]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <div className="h-14 w-64 bg-zinc-900 rounded animate-pulse mb-3" />
            <div className="h-5 w-96 bg-zinc-900 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-28 bg-zinc-900 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
          <button
            onClick={fetchStats}
            className="px-6 py-2.5 bg-white text-black rounded-[14px] font-medium hover:bg-zinc-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h1
                className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-3"
                style={{
                  fontFamily: '"Geist", sans-serif',
                  letterSpacing: "-0.03em",
                }}
              >
                Dashboard
              </h1>
              <p className="text-zinc-500">Overview of your organizer metrics</p>
            </div>
            <div className="flex items-center gap-3 self-start">
              <button
                onClick={() => navigate("/organizer/scan-tickets")}
                className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-[14px] font-medium hover:bg-zinc-700 transition-colors flex items-center gap-2"
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
                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                  />
                </svg>
                Scan Tickets
              </button>
              <button
                onClick={() => navigate("/organizer/events/create")}
                className="px-6 py-3 bg-white text-black rounded-[14px] font-medium hover:bg-zinc-100 transition-colors flex items-center gap-2"
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Create Event
              </button>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon={
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              }
              label="Total Events"
              value={stats.totalEvents}
              color="zinc"
            />
            <StatCard
              icon={
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              label="Upcoming Events"
              value={stats.upcomingEvents}
              color="emerald"
            />
            <StatCard
              icon={
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
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              }
              label="Total Bookings"
              value={stats.totalBookings}
              color="blue"
            />
            <StatCard
              icon={
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
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                  />
                </svg>
              }
              label="Tickets Sold"
              value={stats.ticketsSold}
              color="amber"
            />
            <StatCard
              icon={
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
                    d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              label="Revenue"
              value={formatCurrency(stats.revenue)}
              color="purple"
            />
          </div>

          <div className="mt-12 bg-[#18181B] border border-zinc-800 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-medium text-white mb-2">Ready to manage your events?</h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Head over to the My Events section to handle your upcoming schedules, track event bookings, and manage check-ins.
            </p>
            <button
              onClick={() => navigate("/organizer/events")}
              className="px-6 py-2.5 bg-zinc-800 text-white rounded-[12px] font-medium hover:bg-zinc-700 hover:text-white transition-colors"
            >
              View My Events
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;