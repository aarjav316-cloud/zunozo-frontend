import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventBookings, checkInBooking } from "../../api/bookingApi";
import StatCard from "../../components/organizer/StatCard";
import Toast from "../../components/ui/Toast";

const EventBookings = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState({ event: {}, bookings: [], summary: {}, pagination: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [eventId, page, statusFilter, search]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        bookingStatus: statusFilter !== "ALL" ? statusFilter : undefined,
        search: search || undefined
      };
      const response = await getEventBookings(eventId, params);
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load event bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (ticketCode) => {
    try {
      setIsCheckingIn(true);
      const response = await checkInBooking(ticketCode);
      if (response.success) {
        setToast({ message: "Attendee checked in successfully!", type: "success" });
        // Refresh bookings without losing pagination state
        fetchBookings();
      }
    } catch (err) {
      setToast({ message: err.message || "Failed to check in.", type: "error" });
    } finally {
      setIsCheckingIn(false);
    }
  };

  const statusOptions = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "EXPIRED"
  ];

  if (loading && !data.bookings.length) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <div className="h-10 w-48 bg-zinc-900 rounded animate-pulse mb-3" />
            <div className="h-5 w-80 bg-zinc-900 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-96 bg-zinc-900 rounded-xl animate-pulse" />
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
            onClick={() => { setError(null); fetchBookings(); }}
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
              <button 
                onClick={() => navigate("/organizer/events")}
                className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-4 text-sm"
              >
                &larr; Back to Events
              </button>
              <h1
                className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2"
                style={{ fontFamily: '"Geist", sans-serif', letterSpacing: "-0.03em" }}
              >
                {data.event?.title || "Event Bookings"}
              </h1>
              <p className="text-zinc-500">Manage attendees and view check-ins</p>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={
                <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 002-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
                </svg>
              }
              label="Total Bookings"
              value={data.summary?.totalBookings || 0}
              color="zinc"
            />
            <StatCard
              icon={
                <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              }
              label="Confirmed"
              value={data.summary?.confirmedBookings || 0}
              color="emerald"
            />
            <StatCard
              icon={
                <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              label="Cancelled"
              value={data.summary?.cancelledBookings || 0}
              color="rose"
            />
            <StatCard
              icon={
                <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
              label="Checked In"
              value={data.summary?.checkedInAttendees || 0}
              color="blue"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by Ticket Code..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full h-11 pl-4 pr-11 bg-[#18181B] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => { setStatusFilter(status); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    statusFilter === status
                      ? "bg-white text-black"
                      : "bg-[#18181B] text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-[#18181B] border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-[#18181B] border-b border-zinc-800 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Attendee</th>
                  <th className="px-6 py-4">Ticket Code</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tickets</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.bookings.length > 0 ? (
                  data.bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{booking.user?.name || "Unknown"}</div>
                        <div className="text-xs text-zinc-500">{booking.user?.email || "-"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wider">
                          {booking.ticketCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`${
                            booking.bookingStatus === 'CONFIRMED' ? 'text-emerald-400' :
                            booking.bookingStatus === 'CANCELLED' ? 'text-rose-400' :
                            'text-amber-400'
                          }`}>
                            {booking.bookingStatus}
                          </span>
                          <span className="text-xs text-zinc-600">
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">
                        {booking.quantity}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.bookingStatus === 'CONFIRMED' ? (
                           booking.checkedIn ? (
                             <span className="text-emerald-400 text-xs font-medium px-3 py-1.5 bg-emerald-400/10 rounded-full">
                               Checked In
                             </span>
                           ) : (
                             <button
                               onClick={() => handleCheckIn(booking.ticketCode)}
                               disabled={isCheckingIn}
                               className="px-4 py-1.5 bg-white text-black text-xs font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
                             >
                               Check In
                             </button>
                           )
                        ) : (
                           <span className="text-zinc-600 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                      No bookings found for the given criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.pagination?.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-4 bg-[#09090B]/50">
              <span className="text-sm text-zinc-500">
                Page <span className="text-white">{data.pagination.currentPage}</span> of{" "}
                <span className="text-white">{data.pagination.totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={!data.pagination.hasPrevPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white disabled:opacity-50 hover:bg-zinc-800 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={!data.pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white disabled:opacity-50 hover:bg-zinc-800 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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

export default EventBookings;
