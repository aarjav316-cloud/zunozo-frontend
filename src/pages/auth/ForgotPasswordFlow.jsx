import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../api/authApi";
import Toast from "../../components/ui/Toast";

const ForgotPasswordFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validate = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email address";
      }
    }

    if (step === 2) {
      if (!formData.otp) {
        newErrors.otp = "OTP is required";
      } else if (formData.otp.length !== 6) {
        newErrors.otp = "OTP must be 6 digits";
      }
    }

    if (step === 3) {
      if (!formData.newPassword) {
        newErrors.newPassword = "Password is required";
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await forgotPassword({ email: formData.email });
      if (response.success) {
        setToast({ message: "OTP sent to your email", type: "success" });
        setStep(2);
        startCountdown();
      }
    } catch (error) {
      setToast({
        message: error.message || "Failed to send OTP",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    try {
      const response = await forgotPassword({ email: formData.email });
      if (response.success) {
        setToast({ message: "OTP resent successfully", type: "success" });
        startCountdown();
      }
    } catch (error) {
      setToast({
        message: error.message || "Failed to resend OTP",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      if (response.success) {
        setStep(4);
      }
    } catch (error) {
      setToast({
        message: error.message || "Failed to reset password",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Step 1: Email */}
        {step === 1 && (
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Forgot Password
            </h1>
            <p className="text-zinc-400 mb-8">
              Enter your email and we'll send you an OTP to reset your password
            </p>

            <form onSubmit={handleSendOTP}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full h-12 px-4 bg-zinc-900 border ${
                    errors.email ? "border-rose-500" : "border-zinc-800"
                  } rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-rose-500 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50 mb-4"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="w-full text-center text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Back to Sign In
              </button>
            </form>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
            <p className="text-zinc-400 mb-8">
              Enter the 6-digit code sent to {formData.email}
            </p>

            <form onSubmit={handleVerifyOTP}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength="6"
                  className={`w-full h-12 px-4 bg-zinc-900 border ${
                    errors.otp ? "border-rose-500" : "border-zinc-800"
                  } rounded-xl text-white text-center text-2xl tracking-widest placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50`}
                  placeholder="000000"
                />
                {errors.otp && (
                  <p className="text-rose-500 text-sm mt-2">{errors.otp}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50 mb-4"
              >
                Verify OTP
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || loading}
                className="w-full text-center text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create New Password
            </h1>
            <p className="text-zinc-400 mb-8">Enter your new password</p>

            <form onSubmit={handleResetPassword}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full h-12 px-4 bg-zinc-900 border ${
                      errors.newPassword ? "border-rose-500" : "border-zinc-800"
                    } rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50`}
                    placeholder="Enter new password"
                  />
                  {errors.newPassword && (
                    <p className="text-rose-500 text-sm mt-2">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full h-12 px-4 bg-zinc-900 border ${
                      errors.confirmPassword
                        ? "border-rose-500"
                        : "border-zinc-800"
                    } rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50`}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-rose-500 text-sm mt-2">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-emerald-500"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Password Reset Successful
            </h1>
            <p className="text-zinc-400 mb-8">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
            <button
              onClick={() => navigate("/signin")}
              className="w-full h-12 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ForgotPasswordFlow;
