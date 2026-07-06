import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { becomeOrganizer } from "../../api/organizerApi";
import Toast from "../../components/ui/Toast";

const BecomeOrganizer = () => {
  const navigate = useNavigate();
  const { user, role, loading: authLoading, refetchUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    phone: "",
    about: "",
    instagram: "",
    website: "",
  });

  const [errors, setErrors] = useState({});

  // Auth & role check
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/signin?redirect=/become-organizer");
      } else if (role === "organizer") {
        navigate("/organizer/dashboard");
      }
    }
  }, [isAuthenticated, role, authLoading, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }
    if (!formData.about.trim()) {
      newErrors.about = "About section is required";
    }
    
    // Simple URL validation if provided
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (formData.instagram && !urlRegex.test(formData.instagram)) {
      newErrors.instagram = "Must be a valid URL";
    }
    if (formData.website && !urlRegex.test(formData.website)) {
      newErrors.website = "Must be a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ type: "error", message: "Please fix all validation errors before submitting" });
      return;
    }

    setLoading(true);

    try {
      const resp = await becomeOrganizer(formData);
      if (resp.success) {
        setToast({ type: "success", message: "Welcome aboard! Preparing your dashboard..." });
        // Refresh auth state to get the new role immediately
        await refetchUser();
        // Redirect to dashboard
        setTimeout(() => {
          navigate("/organizer/dashboard");
        }, 1500);
      }
    } catch (error) {
      if (error.message) {
        setToast({ type: "error", message: error.message });
      }
      if (error.errors) {
        setErrors(error.errors);
      }
    } finally {
      if (!toast || toast.type !== "success") {
        setLoading(false);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-[#6366F1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  // Prevent flash of form before redirect
  if (!isAuthenticated || role === "organizer") return null;

  return (
    <div className="min-h-screen bg-[#09090B] pb-12 font-geist">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      
      {/* Header Section */}
      <div className="bg-[#09090B] border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Become an Organizer</h1>
            <p className="text-sm text-zinc-400 mt-1">Host events, manage tickets, and grow your audience.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Information Section */}
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-1">Organizer Profile</h3>
              <p className="text-sm text-zinc-500">Provide the contact information people will see.</p>
            </div>
            
            <div className="space-y-5">
              {/* Readonly Identity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Organizer Account
                </label>
                <div className="w-full px-4 py-3 bg-zinc-900/30 border border-zinc-800 rounded-xl text-zinc-400 flex items-center cursor-not-allowed">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center mr-3 flex-shrink-0 text-white font-medium text-xs">
                    {user?.name?.charAt(0).toUpperCase() || "O"}
                  </div>
                  {user?.name || "Loading..."}
                </div>
                <p className="text-xs text-zinc-600 mt-1">Your display name will automatically update if you change your user profile.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Phone Number
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366F1] transition-colors ${
                    errors.phone ? "border-rose-500" : "border-zinc-800"
                  }`}
                  placeholder="Your contact number"
                />
                {errors.phone && <p className="text-sm text-rose-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  About Organizer
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  disabled={loading}
                  rows="4"
                  className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366F1] transition-colors resize-none ${
                    errors.about ? "border-rose-500" : "border-zinc-800"
                  }`}
                  placeholder="Tell us about the events you host..."
                />
                {errors.about && <p className="text-sm text-rose-500">{errors.about}</p>}
              </div>
            </div>
          </div>

          {/* Optional Social Section */}
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-1">Social Presences</h3>
              <p className="text-sm text-zinc-500">Links where attendees can discover your brand (Optional).</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366F1] transition-colors ${
                    errors.instagram ? "border-rose-500" : "border-zinc-800"
                  }`}
                  placeholder="https://instagram.com/..."
                />
                {errors.instagram && <p className="text-sm text-rose-500">{errors.instagram}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366F1] transition-colors ${
                    errors.website ? "border-rose-500" : "border-zinc-800"
                  }`}
                  placeholder="https://yourwebsite.com"
                />
                {errors.website && <p className="text-sm text-rose-500">{errors.website}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 pb-6">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 text-[15px] font-medium text-white bg-[#6366F1] hover:bg-[#5558E6] rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {loading && (
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? "Registering..." : "Become Organizer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeOrganizer;
