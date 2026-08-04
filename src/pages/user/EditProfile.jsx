import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../api/userApi";
import Toast from "../../components/ui/Toast";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, refetchUser, role, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Redirect organizers to their specific edit profile page
  useEffect(() => {
    if (!loading && role === "organizer") {
      navigate("/profile/organizer/edit", { replace: true });
      return;
    }
  }, [role, loading, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitLoading(true);
    try {
      const response = await updateProfile(formData);
      if (response.success) {
        await refetchUser();
        setToast({ message: "Profile updated successfully", type: "success" });
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      }
    } catch (error) {
      setToast({
        message: error.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="mb-4 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Profile
          </button>
          <h1
            className="text-4xl font-bold text-white"
            style={{
              fontFamily: '"Geist", sans-serif',
              letterSpacing: "-0.02em",
            }}
          >
            Edit Profile
          </h1>
          <p className="text-zinc-400 mt-2">Update your personal information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={submitLoading}
                  className={`w-full h-12 px-4 bg-zinc-900 border ${
                    errors.name ? "border-rose-500" : "border-zinc-800"
                  } rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-rose-500 text-sm mt-2">{errors.name}</p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full h-12 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 cursor-not-allowed"
                />
                <p className="text-xs text-zinc-500 mt-2">
                  Email cannot be changed
                </p>
              </div>

              {/* Profile Image Placeholder */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-lg cursor-not-allowed"
                    >
                      Change Avatar
                    </button>
                    <p className="text-xs text-zinc-500 mt-2">
                      Image upload coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                disabled={loading}
                className="flex-1 h-12 px-4 bg-transparent border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 px-4 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>
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

export default EditProfile;
