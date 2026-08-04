import axiosInstance from "./axios";

// ==========================================
// BOOKING APIs
// ==========================================

/**
 * Create Booking (Free Events Only)
 * POST /api/v1/bookings
 *
 * Directly creates a booking for free events.
 * Paid events must go through the payment flow.
 *
 * @param {string} eventId - MongoDB ObjectId of the event
 * @param {number} quantity - Number of tickets
 * @returns {Object} Created booking + event details
 */
export const createBooking = async (eventId, quantity) => {
  try {
    const response = await axiosInstance.post("/bookings", {
      eventId,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to complete booking. Please try again.",
      }
    );
  }
};
