import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/ui/AuthCard";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";
import Button from "../../components/ui/Button";
import GoogleButton from "../../components/ui/GoogleButton";
import { signupUser } from "../../api/authApi";

function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await signupUser({ name, email, password });
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
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
            label="Full Name"
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />

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
            placeholder="Create a password"
            required
          />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? "Creating account..." : "Sign Up"}
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
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-white font-semibold hover:text-zinc-300 transition-colors duration-300"
          >
            Sign in
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

export default SignUpPage;
