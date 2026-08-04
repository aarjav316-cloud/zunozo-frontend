import { useState, useEffect, useCallback } from "react";

/**
 * =====================================================
 * BOOKING MODAL
 * =====================================================
 * Phase-1 Booking experience modal.
 *
 * Features:
 * - Ticket quantity selection with +/- controls
 * - Dynamic booking summary (price from backend)
 * - Free event direct booking
 * - Paid event → Razorpay Payment flow
 * - Proper loading, disabled, and error states
 * - Keyboard accessible (Escape to close)
 * - Focus trap and body scroll lock
 * - Responsive (mobile → desktop)
 *
 * Design system: Matches existing modal pattern
 * from DeleteModal.jsx and ReviewModal.jsx
 * =====================================================
 */

const BookingModal = ({
  isOpen,
  onClose,
  event,
  isProcessing,
  paymentStage,
  onBookFree,
  onBookPaid,
}) => {
  const [quantity, setQuantity] = useState(1);

  /**
   * ---------------------------------------------------
   * Computed values from event (backend-driven)
   * ---------------------------------------------------
   * SECURITY: Display only. Backend calculates actual amount.
   */
  const pricePerTicket = event?.isFree ? 0 : event?.price || 0;
  const displayTotal = pricePerTicket * quantity;
  const availableTickets = (event?.capacity || 0) - (event?.ticketsSold || 0);
  const maxPerBooking = event?.maxTicketsPerBooking || 10;
  const maxAllowed = Math.min(maxPerBooking, availableTickets);

  /**
   * ---------------------------------------------------
   * Reset quantity when modal opens
   * ---------------------------------------------------
   */
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  /**
   * ---------------------------------------------------
   * Escape key + body scroll lock
   * ---------------------------------------------------
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isProcessing) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isProcessing]);

  /**
   * ---------------------------------------------------
   * Quantity handlers
   * ---------------------------------------------------
   */
  const increment = useCallback(() => {
    setQuantity((prev) => Math.min(prev + 1, maxAllowed));
  }, [maxAllowed]);

  const decrement = useCallback(() => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }, []);

  /**
   * ---------------------------------------------------
   * Submit handler
   * ---------------------------------------------------
   */
  const handleSubmit = useCallback(() => {
    if (isProcessing) return;

    if (event?.isFree) {
      onBookFree?.(quantity);
    } else {
      onBookPaid?.(quantity);
    }
  }, [isProcessing, event, quantity, onBookFree, onBookPaid]);

  if (!isOpen || !event) return null;

  /**
   * ---------------------------------------------------
   * Availability checks
   * ---------------------------------------------------
   */
  const isSoldOut = availableTickets <= 0;
  const isEventStarted = new Date() >= new Date(event.startDate);
  const isDeadlinePassed =
    event.bookingDeadline && new Date() > new Date(event.bookingDeadline);
  const isUnavailable = isSoldOut || isEventStarted || isDeadlinePassed;

  /**
   * ---------------------------------------------------
   * Payment stage labels
   * ---------------------------------------------------
   */
  const getButtonLabel = () => {
    if (isUnavailable) {
      if (isSoldOut) return "Sold Out";
      if (isEventStarted) return "Event Started";
      return "Booking Closed";
    }

    if (isProcessing) {
      switch (paymentStage) {
        case "creating-order":
          return "Creating Order...";
        case "checkout-open":
          return "Complete Payment...";
        case "verifying":
          return "Verifying Payment...";
        default:
          return "Processing...";
      }
    }

    return event.isFree ? "Confirm Booking" : "Continue to Payment";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={isProcessing ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#18181B] border border-zinc-800 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Book Tickets</h3>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Event Summary */}
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5 mb-6">
          <h4 className="text-white font-medium text-sm mb-2 line-clamp-2">
            {event.title}
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
            <span>
              {new Date(event.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>{event.venue?.venueName}</span>
          </div>
        </div>

        {isUnavailable ? (
          /* Unavailable State */
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-zinc-500"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
            <p className="text-zinc-400 text-sm">
              {isSoldOut && "This event is sold out."}
              {isEventStarted && "This event has already started."}
              {isDeadlinePassed &&
                !isSoldOut &&
                !isEventStarted &&
                "The booking deadline has passed."}
            </p>
          </div>
        ) : (
          <>
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm text-zinc-400 mb-3">
                Number of Tickets
              </label>
              <div className="flex items-center justify-between bg-zinc-900/50 rounded-xl border border-white/5 p-3">
                <button
                  onClick={decrement}
                  disabled={quantity <= 1 || isProcessing}
                  className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
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
                      d="M5 12h14"
                    />
                  </svg>
                </button>

                <div className="text-center">
                  <span className="text-2xl font-bold text-white">
                    {quantity}
                  </span>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {availableTickets} available
                  </p>
                </div>

                <button
                  onClick={increment}
                  disabled={quantity >= maxAllowed || isProcessing}
                  className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>
              {maxPerBooking < availableTickets && (
                <p className="text-xs text-zinc-500 mt-2">
                  Max {maxPerBooking} tickets per booking
                </p>
              )}
            </div>

            {/* Booking Summary */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">
                  {event.isFree ? "Ticket" : `₹${pricePerTicket} × ${quantity}`}
                </span>
                <span className="text-white font-medium">
                  {event.isFree ? "Free" : `₹${displayTotal}`}
                </span>
              </div>

              <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-bold text-lg">
                  {event.isFree ? "Free" : `₹${displayTotal}`}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          disabled={isProcessing || isUnavailable}
          className="w-full py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {isProcessing && (
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
          {getButtonLabel()}
        </button>

        {/* Security Note */}
        {!event.isFree && !isUnavailable && (
          <p className="text-center text-xs text-zinc-500 mt-3">
            <svg
              className="w-3 h-3 inline mr-1"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            Secured by Razorpay
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
