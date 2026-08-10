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

/**
 * Get My Bookings
 * GET /api/v1/bookings/my-bookings
 *
 * Retrieves authenticated user's bookings with pagination & filters.
 *
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @param {string} params.bookingStatus - PENDING | CONFIRMED | CANCELLED | EXPIRED
 * @param {string} params.paymentStatus - UNPAID | PAID | REFUNDED
 * @param {string} params.sortBy - createdAt | updatedAt | totalAmount
 * @param {string} params.sortOrder - asc | desc
 * @returns {Object} { bookings, pagination }
 */
export const getMyBookings = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/bookings/my-bookings", {
      params,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to retrieve bookings. Please try again.",
      }
    );
  }
};

/**
 * Get Booking By ID
 * GET /api/v1/bookings/:bookingId
 *
 * Retrieves complete booking details.
 * Authorization: Owner, Organizer (of event), or Admin.
 *
 * @param {string} bookingId - Booking ID (ZNZ-YYYYMMDD-XXXXXX format)
 * @returns {Object} Complete booking details
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to retrieve booking details. Please try again.",
      }
    );
  }
};

/**
 * Cancel Booking
 * POST /api/v1/bookings/:bookingId/cancel
 *
 * Cancels a booking and restores event capacity.
 * Authorization: Owner, Organizer (of event), or Admin.
 *
 * @param {string} bookingId - Booking ID (ZNZ-YYYYMMDD-XXXXXX format)
 * @returns {Object} Cancellation details
 */
export const cancelBooking = async (bookingId) => {
  try {
    const response = await axiosInstance.post(`/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to cancel booking. Please try again.",
      }
    );
  }
};

/**
 * Get Event Bookings (Organizer/Admin)
 * GET /api/v1/bookings/event/:eventId
 * 
 * Retrieves bookings and statistics for a specific event.
 */
export const getEventBookings = async (eventId, params = {}) => {
  try {
    const response = await axiosInstance.get(`/bookings/event/${eventId}`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to retrieve event bookings.",
      }
    );
  }
};

/**
 * Check-In Attendee
 * POST /api/v1/bookings/checkin/:ticketCode
 */
export const checkInBooking = async (ticketCode) => {
  try {
    const response = await axiosInstance.post(`/bookings/checkin/${ticketCode}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to check in attendee.",
      }
    );
  }
};
