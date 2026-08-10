import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CancelBookingModal from "./CancelBookingModal";

/**
 * =====================================================
 * BOOKING CARD
 * =====================================================
 * Individual booking card for the My Bookings list.
 *
 * Displays:
 * - Event cover image
 * - Event title
 * - Event date & venue
 * - Quantity & total paid
 * - Booking & payment status badges
 * - Booking ID
 * - View Details & Cancel actions
 *
 * Design: Matches existing card patterns from
 * AdminHome.jsx and Profile.jsx (bg-[#18181B], zinc borders).
 * =====================================================
 */

const BookingCard = ({ booking, onCancelled, onViewDetails }) => {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const event = booking.event;
  if (!event) return null;

  /**
   * ---------------------------------------------------
   * Date formatting
   * ---------------------------------------------------
   */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
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

  /**
   * ---------------------------------------------------
   * Can this booking be cancelled?
   * ---------------------------------------------------
   */
  const canCancel =
    booking.bookingStatus === "CONFIRMED" &&
    !booking.checkedIn &&
    new Date(event.startDate) > new Date();

  const isUpcoming = new Date(event.startDate) > new Date();

  return (
    <>
      <div className="bg-[#18181B] border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all group">
        <div className="flex flex-col sm:flex-row">
          {/* Event Image */}
          <div
            className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0 overflow-hidden cursor-pointer"
            onClick={onViewDetails}
          >
            {event.coverImage ? (
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500" />
            )}

            {/* Status overlay for cancelled/past */}
            {booking.bookingStatus === "CANCELLED" && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-sm font-semibold text-rose-400 bg-black/60 px-3 py-1 rounded-full">
                  Cancelled
                </span>
              </div>
            )}
            {!isUpcoming && booking.bookingStatus !== "CANCELLED" && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-sm font-semibold text-zinc-300 bg-black/60 px-3 py-1 rounded-full">
                  Event Ended
                </span>
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="flex-1 p-5 flex flex-col">
            {/* Top row: Title + Status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3
                  className="text-lg font-semibold text-white line-clamp-1 mb-1 cursor-pointer hover:text-zinc-300 transition-colors"
                  onClick={onViewDetails}
                >
                  {event.title}
                </h3>

                {/* Date & Venue */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 text-zinc-500"
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
                    {formatDate(event.startDate)}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 text-zinc-500"
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
                    {formatTime(event.startDate)}
                  </span>

                  {event.venue?.venueName && (
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5 text-zinc-500"
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
                      {event.venue.venueName}
                      {event.venue.city && `, ${event.venue.city}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getBookingStatusBadge(booking.bookingStatus)}`}
                >
                  {booking.bookingStatus}
                </span>
                {booking.paymentStatus && booking.paymentStatus !== "UNPAID" && (
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getPaymentStatusBadge(booking.paymentStatus)}`}
                  >
                    {booking.paymentStatus}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom row: Details + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-auto pt-3 border-t border-zinc-800/50">
              {/* Booking meta */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                <div>
                  <span className="text-zinc-500">Tickets:</span>{" "}
                  <span className="text-white font-medium">
                    {booking.quantity}
                  </span>
                </div>

                <div>
                  <span className="text-zinc-500">Total:</span>{" "}
                  <span className="text-white font-semibold">
                    {booking.totalAmount === 0
                      ? "Free"
                      : `₹${booking.totalAmount}`}
                  </span>
                </div>

                <div>
                  <span className="text-zinc-500">ID:</span>{" "}
                  <span className="text-zinc-400 font-mono text-xs">
                    {booking.bookingId}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {booking.bookingStatus === "CONFIRMED" &&
                  booking.paymentStatus === "PAID" &&
                  booking.ticketCode &&
                  booking.ticketStatus !== "CANCELLED" && (
                    <button
                      onClick={() =>
                        navigate(`/bookings/${booking.bookingId}`)
                      }
                      className="px-4 py-2 bg-[#6366F1] text-white rounded-lg text-sm font-semibold hover:bg-[#5558E6] transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                      </svg>
                      View Ticket
                    </button>
                  )}
                <button
                  onClick={onViewDetails}
                  className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors"
                >
                  View Details
                </button>

                {canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        booking={booking}
        onCancelled={(bookingId) => {
          setShowCancelModal(false);
          onCancelled?.(bookingId);
        }}
      />
    </>
  );
};

export default BookingCard;
