import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/ui/AuthCard";
import Button from "../../components/ui/Button";
import OTPInput from "../../components/auth/OTPInput";
import { verifyOtp, resendOtp } from "../../api/authApi";

function VerifyOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter the complete OTP");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp({ email, otp });
      navigate("/signin");
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendMessage("");
    setError("");
    setResending(true);

    try {
      await resendOtp({ email });
      setResendMessage("A new OTP has been sent to your email");
      setOtp("");
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We've sent a verification code to ${email}`}
    >
      <AuthCard>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {resendMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">
              {resendMessage}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
              Enter the 6-digit code
            </label>
            <OTPInput length={6} value={otp} onChange={setOtp} />
          </div>

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className="text-amber-500 hover:text-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

export default VerifyOtpPage;
