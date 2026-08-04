import { useState, useCallback } from "react";
import { createPaymentOrder, verifyPayment } from "../api/paymentApi";

/**
 * =====================================================
 * useRazorpay Hook
 * =====================================================
 * Encapsulates the complete Razorpay payment flow:
 * 1. Create Razorpay Order (server-side)
 * 2. Open Razorpay Checkout
 * 3. Verify Payment (server-side)
 * 4. Return booking result
 *
 * Handles all error states:
 * - Order creation failure
 * - Checkout dismissed by user
 * - Payment failure
 * - Verification failure
 * - Network errors
 * - Script loading failure
 * =====================================================
 */

const useRazorpay = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStage, setPaymentStage] = useState(null);
  // Stages: 'creating-order' | 'checkout-open' | 'verifying' | null

  /**
   * Load Razorpay SDK script dynamically
   * Returns a promise that resolves when the script is loaded
   */
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      // Already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => resolve(true);
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay SDK. Please check your internet connection."));

      document.body.appendChild(script);
    });
  }, []);

  /**
   * Main payment flow
   *
   * @param {Object} params
   * @param {string} params.eventId - MongoDB ObjectId of the event
   * @param {number} params.quantity - Number of tickets
   * @param {Object} params.eventDetails - Event info for Razorpay modal display
   * @param {Object} params.user - Authenticated user info
   * @param {Function} params.onSuccess - Callback with verified payment + booking data
   * @param {Function} params.onError - Callback with error message
   * @param {Function} params.onDismiss - Callback when user closes checkout
   */
  const initiatePayment = useCallback(
    async ({ eventId, quantity, eventDetails, user, onSuccess, onError, onDismiss }) => {
      if (isProcessing) return;

      setIsProcessing(true);

      try {
        // ---------------------------------------------------
        // Step 1: Load Razorpay SDK
        // ---------------------------------------------------
        await loadRazorpayScript();

        // ---------------------------------------------------
        // Step 2: Create Razorpay Order (Server-Side)
        // ---------------------------------------------------
        setPaymentStage("creating-order");

        const orderResponse = await createPaymentOrder(eventId, quantity);

        if (!orderResponse.success) {
          throw new Error(orderResponse.message || "Failed to create payment order.");
        }

        const { orderId, amount, currency, key } = orderResponse.data;

        // ---------------------------------------------------
        // Step 3: Open Razorpay Checkout
        // ---------------------------------------------------
        setPaymentStage("checkout-open");

        const options = {
          key,
          amount,
          currency,
          name: "Zunozo",
          description: eventDetails?.title
            ? `${quantity} ticket(s) — ${eventDetails.title}`
            : `${quantity} ticket(s)`,
          order_id: orderId,
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: {
            color: "#6366F1",
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setPaymentStage(null);
              onDismiss?.();
            },
          },

          /**
           * ---------------------------------------------------
           * Payment Success Handler
           * ---------------------------------------------------
           * Razorpay calls this with payment credentials
           * We then verify them on the server
           */
          handler: async (response) => {
            try {
              // ---------------------------------------------------
              // Step 4: Verify Payment (Server-Side)
              // ---------------------------------------------------
              setPaymentStage("verifying");

              const verifyResponse = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (!verifyResponse.success) {
                throw new Error(verifyResponse.message || "Payment verification failed.");
              }

              setIsProcessing(false);
              setPaymentStage(null);
              onSuccess?.(verifyResponse.data);
            } catch (verifyError) {
              setIsProcessing(false);
              setPaymentStage(null);
              onError?.(
                verifyError.message || "Payment verification failed. Please contact support."
              );
            }
          },
        };

        const razorpay = new window.Razorpay(options);

        /**
         * Payment failure handler
         * Called when Razorpay payment fails (e.g., card declined)
         */
        razorpay.on("payment.failed", (response) => {
          setIsProcessing(false);
          setPaymentStage(null);
          onError?.(
            response.error?.description || "Payment failed. Please try again."
          );
        });

        razorpay.open();
      } catch (error) {
        setIsProcessing(false);
        setPaymentStage(null);
        onError?.(error.message || "Something went wrong. Please try again.");
      }
    },
    [isProcessing, loadRazorpayScript]
  );

  return {
    initiatePayment,
    isProcessing,
    paymentStage,
  };
};

export default useRazorpay;
