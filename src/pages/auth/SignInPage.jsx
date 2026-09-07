import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/ui/AuthCard";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";
import GoogleButton from "../../components/ui/GoogleButton";
import { signinUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

function SignInPage() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await signinUser({ email, password });
      // Refetch user data to update AuthContext
      await refetchUser();
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://zunozo-backend.onrender.com/api/v1" : "http://localhost:5000/api/v1")) + "/auth/google";
  };

  return (
    <AuthLayout>
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

          <PasswordInput
            label="Password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <div className="mb-8 mt-1 text-right">
            <Link
              to="/forgot-password"
              className="text-[13px] font-semibold text-white hover:text-zinc-300 transition-colors duration-300"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
            or continue with
          </span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        <GoogleButton onClick={handleGoogleAuth} />

        <div className="mt-8 text-center text-[13px] text-zinc-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-white font-semibold hover:text-zinc-300 transition-colors duration-300"
          >
            Sign up
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

export default SignInPage;
