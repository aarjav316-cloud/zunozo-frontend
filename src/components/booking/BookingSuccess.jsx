import { useEffect } from "react";

/**
 * =====================================================
 * BOOKING SUCCESS MODAL
 * =====================================================
 * Shown after a successful booking (free or paid).
 * Displays booking confirmation with key details.
 *
 * Design: Matches existing modal patterns with
 * emerald success color scheme.
 * =====================================================
 */

const BookingSuccess = ({ isOpen, onClose, bookingData }) => {
  /**
   * ---------------------------------------------------
   * Escape key + body scroll lock
   * ---------------------------------------------------
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !bookingData) return null;

  const { booking, event } = bookingData;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#18181B] border border-zinc-800 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md shadow-2xl">
        {/* Success Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
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
          <h3 className="text-xl font-bold text-white mb-1">
            Booking Confirmed!
          </h3>
          <p className="text-sm text-zinc-400">
            Your tickets have been booked successfully.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-4 mb-6 space-y-3">
          {/* Event Title */}
          {event?.title && (
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">Event</p>
              <p className="text-white font-medium text-sm line-clamp-1">
                {event.title}
              </p>
            </div>
          )}

          {/* Booking ID */}
          {booking?.bookingId && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Booking ID</span>
              <span className="text-white font-mono text-sm">
                {booking.bookingId}
              </span>
            </div>
          )}

          {/* Ticket Code */}
          {booking?.ticketCode && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Ticket Code</span>
              <span className="text-white font-mono text-sm tracking-widest">
                {booking.ticketCode}
              </span>
            </div>
          )}

          {/* Quantity */}
          {booking?.quantity && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Tickets</span>
              <span className="text-white text-sm">{booking.quantity}</span>
            </div>
          )}

          {/* Total Amount */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-xs text-zinc-500">Total</span>
            <span className="text-white font-semibold">
              {booking?.totalAmount === 0
                ? "Free"
                : `₹${booking?.totalAmount || 0}`}
            </span>
          </div>

          {/* Event Date */}
          {event?.startDate && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Date</span>
              <span className="text-white text-sm">
                {new Date(event.startDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}

          {/* Venue */}
          {event?.venue?.venueName && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Venue</span>
              <span className="text-white text-sm text-right">
                {event.venue.venueName}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;
