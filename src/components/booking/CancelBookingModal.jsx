import { useState } from "react";
import { cancelBooking } from "../../api/bookingApi";

/**
 * =====================================================
 * CANCEL BOOKING MODAL
 * =====================================================
 * Confirmation dialog before cancelling a booking.
 *
 * Handles:
 * - Confirmation prompt with booking summary
 * - Loading state during API call
 * - Success callback
 * - Error display
 *
 * Design: Matches existing modal patterns from
 * BookingModal.jsx (bg-[#18181B], backdrop blur).
 * =====================================================
 */

const CancelBookingModal = ({ isOpen, onClose, booking, onCancelled }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !booking) return null;

  const event = booking.event;

  const handleCancel = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cancelBooking(booking.bookingId);

      if (response.success) {
        onCancelled?.(booking.bookingId);
      }
    } catch (err) {
      setError(err.message || "Unable to cancel booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = () => {
    if (!isLoading) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="relative bg-[#18181B] border border-zinc-800 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md shadow-2xl">
        {/* Warning Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
            <svg
              className="w-7 h-7 text-rose-500"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Cancel Booking?
          </h3>
          <p className="text-sm text-zinc-400">
            This action cannot be undone. Your ticket will be cancelled.
          </p>
        </div>

        {/* Booking Summary */}
        <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-4 mb-6 space-y-2">
          {event?.title && (
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">Event</p>
              <p className="text-white font-medium text-sm line-clamp-1">
                {event.title}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Booking ID</span>
            <span className="text-white font-mono text-sm">
              {booking.bookingId}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Tickets</span>
            <span className="text-white text-sm">{booking.quantity}</span>
          </div>
          {booking.totalAmount > 0 && (
            <div className="flex items-center justify-between border-t border-white/5 pt-2">
              <span className="text-xs text-zinc-500">Refund Amount</span>
              <span className="text-white font-semibold">
                ₹{booking.totalAmount}
              </span>
            </div>
          )}
        </div>

        {/* Refund note */}
        {booking.paymentStatus === "PAID" && (
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 mb-6">
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
                Refund will be processed within 5-7 business days.
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4">
            <p className="text-sm text-rose-400">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 bg-zinc-900 border border-zinc-700 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Keep Booking
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isLoading ? "Cancelling..." : "Cancel Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
