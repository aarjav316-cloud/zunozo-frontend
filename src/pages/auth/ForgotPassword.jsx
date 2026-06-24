import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/ui/AuthCard";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { forgotPassword } from "../../api/authApi";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      console.log("Calling forgotPassword API with email:", email);
      const response = await forgotPassword({ email });
      console.log("API Response:", response);
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Error caught:", err);
      setError(err.message || "Failed to send reset OTP");
    } finally {
      console.log("Finally block executed, setting loading to false");
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you an OTP to reset your password"
    >
      <AuthCard>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Sending OTP..." : "Send Reset OTP"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{" "}
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

export default ForgotPassword;
