import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { getBookingById } from "../../api/bookingApi";
import CancelBookingModal from "../../components/booking/CancelBookingModal";
import Toast from "../../components/ui/Toast";

/**
 * =====================================================
 * BOOKING DETAILS PAGE
 * =====================================================
 * Complete booking detail view with:
 * - Booking info card
 * - Event details section
 * - Ticket code display
 * - QR Code display (QR Ticket System)
 * - Ticket status badges
 * - Cancel action
 *
 * Design: Uses the existing detail page pattern
 * from EventDetails.jsx (bg-[#09090B], max-w-5xl).
 * =====================================================
 */

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  /**
   * ---------------------------------------------------
   * Fetch booking details
   * ---------------------------------------------------
   */
  const fetchBooking = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getBookingById(bookingId);

      if (response.success && response.data) {
        setBookingData(response.data);
      }
    } catch (err) {
      if (err.message?.includes("Unauthorized") || err.status === 401) {
        navigate("/signin", { replace: true });
        return;
      }
      if (err.message?.includes("not authorized") || err.status === 403) {
        setError("You are not authorized to view this booking.");
        return;
      }
      setError(err.message || "Failed to load booking details");
    } finally {
      setLoading(false);
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, fetchBooking]);

  /**
   * ---------------------------------------------------
   * Real-time check-in listener (Socket.io)
   * ---------------------------------------------------
   * When the organizer scans the QR, the ticket status
   * updates immediately on the user's BookingDetails page.
   */
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !bookingData) return;

    const handleTicketUpdated = (data) => {
      // Only update if this event matches the current booking
      if (data.bookingId !== bookingData.bookingId) return;

      setBookingData((prev) => ({
        ...prev,
        ticketStatus: data.ticketStatus,
        checkedIn: data.checkedIn,
        checkedInAt: data.checkedInAt,
      }));

      setToast({
        message: "Your ticket has been checked in!",
        type: "success",
      });
    };

    socket.on("ticket:updated", handleTicketUpdated);

    return () => {
      socket.off("ticket:updated", handleTicketUpdated);
    };
  }, [socket, bookingData?.bookingId]);

  /**
   * ---------------------------------------------------
   * Date formatting
   * ---------------------------------------------------
   */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  /**
   * ---------------------------------------------------
   * Status badge styles
   * ---------------------------------------------------
   */
  const getBookingStatusBadge = (status) => {
    const badges = {
      CONFIRMED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      CANCELLED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      EXPIRED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    };
    return badges[status] || badges.PENDING;
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      PAID: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      UNPAID: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      REFUNDED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };
    return badges[status] || badges.UNPAID;
  };

  const getTicketStatusStyle = (status) => {
    switch (status) {
      case "VALID":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "USED":
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  /**
   * ---------------------------------------------------
   * Handle cancel success
   * ---------------------------------------------------
   */
  const handleCancelled = () => {
    setShowCancelModal(false);
    setToast({ message: "Booking cancelled successfully.", type: "success" });
    // Re-fetch to get updated status
    fetchBooking();
  };

  /**
   * ---------------------------------------------------
   * Loading state
   * ---------------------------------------------------
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="h-5 w-32 bg-zinc-900 rounded animate-pulse mb-8" />
          <div className="h-10 w-72 bg-zinc-900 rounded animate-pulse mb-4" />
          <div className="h-5 w-48 bg-zinc-900 rounded animate-pulse mb-10" />

          <div className="grid lg:grid-cols-[1fr_340px] gap-8">
            <div className="space-y-6">
              <div className="h-64 bg-zinc-900 rounded-2xl animate-pulse" />
              <div className="h-48 bg-zinc-900 rounded-2xl animate-pulse" />
            </div>
            <div className="h-80 bg-zinc-900 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  /**
   * ---------------------------------------------------
   * Error state
   * ---------------------------------------------------
   */
  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <button
            onClick={() => navigate("/bookings")}
            className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Bookings
          </button>

          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-rose-500"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9.303 3.376c-.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0l8.354 14.748zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {error || "Booking not found"}
            </h2>
            <button
              onClick={() => navigate("/bookings")}
              className="mt-4 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { event, user: bookingUser, organizer } = bookingData;
  const canCancel =
    bookingData.bookingStatus === "CONFIRMED" &&
    !bookingData.checkedIn &&
    event &&
    new Date(event.startDate) > new Date();

  const isTicketEligible =
    bookingData.bookingStatus === "CONFIRMED" &&
    bookingData.paymentStatus === "PAID" &&
    bookingData.ticketCode;

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate("/bookings")}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Bookings
        </button>

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${getBookingStatusBadge(bookingData.bookingStatus)}`}
            >
              {bookingData.bookingStatus}
            </span>
            <span
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${getPaymentStatusBadge(bookingData.paymentStatus)}`}
            >
              {bookingData.paymentStatus}
            </span>
            {bookingData.checkedIn && (
              <span className="px-3 py-1.5 rounded-lg text-sm font-semibold border bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20">
                CHECKED IN
              </span>
            )}
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2"
            style={{
              fontFamily: '"Geist", sans-serif',
              letterSpacing: "-0.03em",
            }}
          >
            Booking Details
          </h1>
          <p className="text-zinc-500">
            Booking ID:{" "}
            <span className="font-mono text-zinc-400">
              {bookingData.bookingId}
            </span>
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Left Column - Details */}
          <div className="space-y-6">
            {/* Event Card */}
            {event && (
              <div className="bg-[#18181B] border border-zinc-800 rounded-2xl overflow-hidden">
                {/* Event Cover */}
                {event.coverImage && (
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(24,24,27,1) 0%, transparent 60%)",
                      }}
                    />

                    {/* Category badge */}
                    {event.category && (
                      <div className="absolute top-4 left-4">
                        <div className="backdrop-blur-xl bg-white/[0.08] border border-white/10 rounded-full px-3 py-1.5">
                          <span className="text-xs font-semibold text-white tracking-wide">
                            {event.category}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 -mt-8 relative">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {event.title}
                  </h2>

                  {/* Event details grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
                        <svg
                          className="w-5 h-5 text-white"
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
                      <div>
                        <p className="text-xs text-zinc-500">Date</p>
                        <p className="text-sm text-white font-medium">
                          {formatDate(event.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
                        <svg
                          className="w-5 h-5 text-white"
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
                      <div>
                        <p className="text-xs text-zinc-500">Time</p>
                        <p className="text-sm text-white font-medium">
                          {formatTime(event.startDate)}
                          {event.endDate && ` — ${formatTime(event.endDate)}`}
                        </p>
                      </div>
                    </div>

                    {event.venue && (
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
                          <svg
                            className="w-5 h-5 text-white"
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
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Venue</p>
                          <p className="text-sm text-white font-medium">
                            {event.venue.venueName}
                            {event.venue.city && `, ${event.venue.city}`}
                            {event.venue.state && `, ${event.venue.state}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View event link */}
                  {event.slug && (
                    <button
                      onClick={() => navigate(`/events/${event.slug}`)}
                      className="mt-4 text-sm text-[#6366F1] hover:text-[#818CF8] transition-colors font-medium flex items-center gap-1"
                    >
                      View Event Page
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
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Booking Information */}
            <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-5">
                Booking Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-zinc-800">
                  <span className="text-zinc-400">Booking ID</span>
                  <span className="text-white font-mono text-sm">
                    {bookingData.bookingId}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-zinc-800">
                  <span className="text-zinc-400">Ticket Code</span>
                  <span className="text-white font-mono text-sm tracking-widest">
                    {bookingData.ticketCode}
                  </span>
                </div>
                {bookingData.ticketStatus && (
                  <div className="flex justify-between items-center py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Ticket Status</span>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getTicketStatusStyle(bookingData.ticketStatus)}`}
                    >
                      {bookingData.ticketStatus}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-b border-zinc-800">
                  <span className="text-zinc-400">Tickets</span>
                  <span className="text-white">{bookingData.quantity}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-zinc-800">
                  <span className="text-zinc-400">Price per Ticket</span>
                  <span className="text-white">
                    {bookingData.pricePerTicket === 0
                      ? "Free"
                      : `₹${bookingData.pricePerTicket}`}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-zinc-800">
                  <span className="text-zinc-400 font-medium">
                    Total Amount
                  </span>
                  <span className="text-white font-bold text-lg">
                    {bookingData.totalAmount === 0
                      ? "Free"
                      : `₹${bookingData.totalAmount}`}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-zinc-800">
                  <span className="text-zinc-400">Booked On</span>
                  <span className="text-white text-sm">
                    {formatShortDate(bookingData.createdAt)}
                  </span>
                </div>

                {/* Check-in info */}
                {bookingData.checkedIn && bookingData.checkedInAt && (
                  <div className="flex justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Checked In At</span>
                    <span className="text-emerald-400 text-sm">
                      {formatShortDate(bookingData.checkedInAt)}
                    </span>
                  </div>
                )}

                {/* Cancellation info */}
                {bookingData.cancelledAt && (
                  <div className="flex justify-between py-3">
                    <span className="text-zinc-400">Cancelled At</span>
                    <span className="text-rose-400 text-sm">
                      {formatShortDate(bookingData.cancelledAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column — Ticket Card + QR + Actions */}
          <div className="space-y-6">
            {/* QR Ticket Card */}
            <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-zinc-400 mb-4">
                Your Ticket
              </h3>

              {/* =============================================
                  QR Code Display (QR Ticket System - Step 4)
                  ============================================= */}
              {isTicketEligible && bookingData.qrCode ? (
                <div className="space-y-4">
                  {/* QR Code */}
                  <div className="bg-white rounded-xl p-4 flex items-center justify-center">
                    <img
                      src={bookingData.qrCode}
                      alt="Ticket QR Code"
                      className="w-56 h-56 object-contain"
                    />
                  </div>

                  {/* Ticket Code */}
                  <div className="bg-zinc-900 rounded-xl p-4 text-center border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">
                      Ticket Code
                    </p>
                    <p
                      className="text-2xl font-bold text-white tracking-[0.15em] font-mono"
                    >
                      {bookingData.ticketCode}
                    </p>
                  </div>

                  {/* Ticket Status */}
                  <div className="flex items-center justify-center">
                    {bookingData.ticketStatus === "VALID" && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-semibold text-emerald-400">
                          Valid Ticket
                        </span>
                      </div>
                    )}
                    {bookingData.ticketStatus === "USED" && (
                      <div className="space-y-2 text-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-500/10 border border-zinc-500/20 rounded-full">
                          <svg className="w-4 h-4 text-zinc-400" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-semibold text-zinc-400">
                            Ticket Used
                          </span>
                        </div>
                        {bookingData.checkedInAt && (
                          <p className="text-xs text-zinc-500">
                            Checked in {formatShortDate(bookingData.checkedInAt)}
                          </p>
                        )}
                      </div>
                    )}
                    {bookingData.ticketStatus === "CANCELLED" && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full">
                        <svg className="w-4 h-4 text-rose-400" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-rose-400">
                          Cancelled
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-zinc-600 text-center">
                    Show this QR code at the venue for check-in
                  </p>
                </div>
              ) : (
                /* Fallback: No QR available */
                <div className="bg-zinc-900 rounded-xl p-6 text-center border border-white/5">
                  <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">
                    Ticket Code
                  </p>
                  <p
                    className="text-3xl font-bold text-white tracking-[0.2em] font-mono"
                    style={{ letterSpacing: "0.2em" }}
                  >
                    {bookingData.ticketCode || "—"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-3">
                    {bookingData.bookingStatus !== "CONFIRMED"
                      ? "Ticket not available for this booking status"
                      : bookingData.paymentStatus !== "PAID"
                        ? "Complete payment to access your ticket"
                        : "Show this at the venue for check-in"}
                  </p>
                </div>
              )}

              {/* Quantity badge */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="px-3 py-1.5 bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-lg">
                  <span className="text-sm font-semibold text-[#6366F1]">
                    {bookingData.quantity}{" "}
                    {bookingData.quantity === 1 ? "Ticket" : "Tickets"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-6 space-y-3">
              {/* View Ticket button (fullscreen-like view) */}
              {isTicketEligible && bookingData.ticketStatus === "VALID" && (
                <button
                  onClick={() => {
                    // Scroll to top of QR section smoothly
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full py-3 bg-[#6366F1] text-white rounded-xl font-semibold hover:bg-[#5558E6] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                  </svg>
                  View Ticket
                </button>
              )}

              {/* View event button */}
              {event?.slug && (
                <button
                  onClick={() => navigate(`/events/${event.slug}`)}
                  className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
                >
                  View Event
                </button>
              )}

              {/* Cancel button */}
              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full py-3 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-xl font-medium hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-all"
                >
                  Cancel Booking
                </button>
              )}

              {/* Refund note */}
              {bookingData.bookingStatus === "CANCELLED" &&
                bookingData.paymentStatus === "REFUNDED" && (
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-blue-400 mt-0.5 shrink-0"
                        fill="none"
                        strokeWidth="2"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                      <p className="text-xs text-blue-300">
                        Refund of ₹{bookingData.totalAmount} will be processed
                        within 5-7 business days.
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {/* Organizer info */}
            {organizer && (
              <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">
                  Organized By
                </h3>
                <div className="flex items-center gap-3">
                  {organizer.avatar ? (
                    <img
                      src={organizer.avatar}
                      alt={organizer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#000000] border border-white/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {organizer.name?.[0]?.toUpperCase() || "O"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium text-sm">
                      {organizer.name}
                    </p>
                    <p className="text-zinc-500 text-xs">{organizer.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {canCancel && (
        <CancelBookingModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          booking={{
            ...bookingData,
            event,
          }}
          onCancelled={handleCancelled}
        />
      )}

      {/* Toast */}
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

export default BookingDetails;
