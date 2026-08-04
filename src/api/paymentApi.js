import axiosInstance from "./axios";

// ==========================================
// PAYMENT APIs (Payment-First Architecture)
// ==========================================

/**
 * Create Razorpay Order
 * POST /api/v1/payments/create-order
 *
 * Creates a Razorpay order for a paid event.
 * No booking is created at this stage.
 *
 * @param {string} eventId - MongoDB ObjectId of the event
 * @param {number} quantity - Number of tickets
 * @returns {Object} { orderId, amount, currency, key }
 */
export const createPaymentOrder = async (eventId, quantity) => {
  try {
    const response = await axiosInstance.post("/payments/create-order", {
      eventId,
      quantity,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to create payment order. Please try again.",
      }
    );
  }
};

/**
 * Verify Razorpay Payment
 * POST /api/v1/payments/verify
 *
 * Verifies HMAC SHA256 signature after checkout.
 * Updates Payment status and creates Booking.
 *
 * @param {Object} paymentData
 * @param {string} paymentData.razorpay_order_id
 * @param {string} paymentData.razorpay_payment_id
 * @param {string} paymentData.razorpay_signature
 * @returns {Object} Verified payment + created booking details
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post("/payments/verify", paymentData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Unable to verify payment. Please try again.",
      }
    );
  }
};
