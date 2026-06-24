import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/ui/AuthCard";
import PasswordInput from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";
import OTPInput from "../../components/auth/OTPInput";
import { resetPassword } from "../../api/authApi";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter the complete OTP");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ email, otp, newPassword });
      navigate("/signin");
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={`Enter the OTP sent to ${email}`}
    >
      <AuthCard>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
              Enter the 6-digit code
            </label>
            <OTPInput length={6} value={otp} onChange={setOtp} />
          </div>

          <PasswordInput
            label="New Password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
          />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Resetting password..." : "Reset Password"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Remembered your password?{" "}
          <Link
            to="/signin"
            className="text-amber-500 hover:text-amber-400 transition"
          >
            Sign in
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

export default ResetPassword;
