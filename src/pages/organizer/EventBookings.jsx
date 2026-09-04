import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventBookings, checkInBooking } from "../../api/bookingApi";
import { useSocket } from "../../context/SocketContext";
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
  const { socket } = useSocket();

  useEffect(() => {
    fetchBookings();
  }, [eventId, page, statusFilter, search]);

  /**
   * ---------------------------------------------------
   * Real-time check-in listener (Socket.io)
   * ---------------------------------------------------
   * When a ticket is checked in (from QR scanner or
   * another device), update the local state immediately.
   */
  useEffect(() => {
    if (!socket || !eventId) return;

    const handleTicketCheckedIn = (socketData) => {
      // Only react to check-ins for this specific event
      if (socketData.eventId !== eventId) return;

      // Optimistically update the checked-in count
      setData((prev) => ({
        ...prev,
        summary: {
          ...prev.summary,
          checkedInAttendees: (prev.summary?.checkedInAttendees || 0) + 1,
        },
        // Update the specific booking row in the list
        bookings: prev.bookings.map((b) =>
          b.ticketCode === socketData.ticketCode
            ? {
                ...b,
                ticketStatus: socketData.ticketStatus,
                checkedIn: socketData.checkedIn,
                checkedInAt: socketData.checkedInAt,
              }
            : b
        ),
      }));

      setToast({
        message: `${socketData.attendee?.name || "Attendee"} checked in!`,
        type: "success",
      });
    };

    socket.on("ticket:checked-in", handleTicketCheckedIn);

    return () => {
      socket.off("ticket:checked-in", handleTicketCheckedIn);
    };
  }, [socket, eventId]);

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
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="w-full min-w-0">
              <button 
                onClick={() => navigate("/organizer/events")}
                className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-4 text-sm"
              >
                &larr; Back to Events
              </button>
              <h1
                className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2 break-words text-wrap"
                style={{ fontFamily: '"Geist", sans-serif', letterSpacing: "-0.03em" }}
              >
                {data.event?.title || "Event Bookings"}
              </h1>
              <p className="text-zinc-500 text-sm md:text-base break-words text-wrap">Manage attendees and view check-ins</p>
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
            <div className="relative flex-1 w-full min-w-0">
              <input
                type="text"
                placeholder="Search by Ticket Code..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full h-11 pl-4 pr-11 bg-[#18181B] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>
            
            <div className="flex gap-2 pb-1 overflow-x-auto w-full md:w-auto touch-pan-x [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => { setStatusFilter(status); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
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

        {/* Bookings Table / Mobile Cards */}
        <div className="bg-[#18181B] border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="w-full">
            <table className="w-full text-left text-sm text-zinc-400 block md:table">
              <thead className="hidden md:table-header-group bg-[#18181B] border-b border-zinc-800 text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Attendee</th>
                  <th className="px-6 py-4">Ticket Code</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tickets</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 block md:table-row-group">
                {data.bookings.length > 0 ? (
                  data.bookings.map((booking) => (
                    <React.Fragment key={booking._id}>
                      {/* Desktop Row */}
                      <tr className="hidden md:table-row hover:bg-zinc-900/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-white font-medium">{booking.user?.name || "Unknown"}</div>
                          <div className="text-xs text-zinc-500 truncate max-w-[200px]">{booking.user?.email || "-"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wider">
                            {booking.ticketCode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`font-medium ${
                              booking.bookingStatus === 'CONFIRMED' ? 'text-emerald-400' :
                              booking.bookingStatus === 'CANCELLED' ? 'text-rose-400' :
                              'text-amber-400'
                            }`}>
                              {booking.bookingStatus}
                            </span>
                            <span className="text-[11px] text-zinc-500 uppercase tracking-wide">
                              {booking.paymentStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white font-medium">
                          {booking.quantity}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {booking.bookingStatus === 'CONFIRMED' ? (
                             booking.checkedIn ? (
                               <span className="text-emerald-400 text-xs font-medium px-3 py-1.5 bg-emerald-400/10 rounded-full border border-emerald-500/20">
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

                      {/* Mobile Row (Card format) */}
                      <tr className="md:hidden flex flex-col p-5">
                        <td className="block">
                          <div className="flex justify-between items-start mb-4">
                            <div className="min-w-0 pr-4">
                              <div className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase mb-1">Attendee</div>
                              <div className="text-white font-medium text-sm truncate">{booking.user?.name || "Unknown"}</div>
                              <div className="text-xs text-zinc-400 truncate">{booking.user?.email || "-"}</div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase mb-1">Status</div>
                              <div className="flex flex-col items-end gap-1">
                                <span className={`text-xs font-bold ${
                                  booking.bookingStatus === 'CONFIRMED' ? 'text-emerald-400' :
                                  booking.bookingStatus === 'CANCELLED' ? 'text-rose-400' :
                                  'text-amber-400'
                                }`}>
                                  {booking.bookingStatus}
                                </span>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
                                  {booking.paymentStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-end mb-4">
                            <div>
                              <div className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase mb-1">Ticket Code</div>
                              <span className="font-mono bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs font-semibold tracking-wider">
                                {booking.ticketCode}
                              </span>
                            </div>
                            <div className="text-right">
                               <div className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase mb-1">Tickets</div>
                               <div className="text-white text-sm font-medium">{booking.quantity}</div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-zinc-800/50">
                              {booking.bookingStatus === 'CONFIRMED' ? (
                                 booking.checkedIn ? (
                                   <div className="w-full text-emerald-400 text-xs font-medium px-4 py-2 bg-emerald-400/10 rounded-lg text-center border border-emerald-500/20">
                                     Checked In
                                   </div>
                                 ) : (
                                   <button
                                     onClick={() => handleCheckIn(booking.ticketCode)}
                                     disabled={isCheckingIn}
                                     className="w-full px-4 py-2 bg-white text-black text-xs font-bold tracking-wide uppercase rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
                                   >
                                     Check In Attendee
                                   </button>
                                 )
                              ) : (
                                 <div className="text-zinc-600 text-xs w-full text-center py-2 uppercase tracking-wide font-medium">Inactive Ticket</div>
                              )}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))
                ) : (
                  <tr className="block md:table-row">
                    <td colSpan="5" className="block md:table-cell px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-zinc-700 mb-4" fill="none" strokeWidth="1" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <h3 className="text-sm font-medium text-zinc-300 mb-1">No bookings found</h3>
                        <p className="text-xs text-zinc-500 max-w-[250px] mx-auto leading-relaxed">Try adjusting your search criteria or switching the status filter.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
