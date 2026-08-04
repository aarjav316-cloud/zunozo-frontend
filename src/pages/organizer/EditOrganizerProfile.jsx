import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrganizerProfile,
  updateOrganizerProfile,
} from "../../api/organizerApi";
import { updateProfile } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../components/ui/Toast";

const EditOrganizerProfile = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [userData, setUserData] = useState({ name: "" });
  const [organizerData, setOrganizerData] = useState({
    phone: "",
    about: "",
    instagram: "",
    website: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getOrganizerProfile();
      if (response.success && response.data) {
        setUserData({
          name: response.data.user.name || "",
        });
        setOrganizerData({
          phone: response.data.organizer.phone || "",
          about: response.data.organizer.about || "",
          instagram: response.data.organizer.instagram || "",
          website: response.data.organizer.website || "",
        });
      }
    } catch (error) {
      setToast({
        message: error.message || "Failed to load profile",
        type: "error",
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    // User validation
    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (userData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Organizer validation
    if (!organizerData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (organizerData.phone.trim().length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits";
    }

    if (!organizerData.about.trim()) {
      newErrors.about = "About section is required";
    } else if (organizerData.about.trim().length > 1000) {
      newErrors.about = "About cannot exceed 1000 characters";
    }

    // Optional URL validations
    if (organizerData.instagram && organizerData.instagram.trim()) {
      try {
        new URL(organizerData.instagram);
      } catch {
        newErrors.instagram = "Instagram must be a valid URL";
      }
    }

    if (organizerData.website && organizerData.website.trim()) {
      try {
        new URL(organizerData.website);
      } catch {
        newErrors.website = "Website must be a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOrganizerChange = (e) => {
    const { name, value } = e.target;
    setOrganizerData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      // Update both user and organizer profiles
      const [userResponse, organizerResponse] = await Promise.all([
        updateProfile({ name: userData.name }),
        updateOrganizerProfile({
          phone: organizerData.phone,
          about: organizerData.about,
          instagram: organizerData.instagram || "",
          website: organizerData.website || "",
        }),
      ]);

      if (userResponse.success && organizerResponse.success) {
        await refetchUser();
        setToast({
          message: "Profile updated successfully",
          type: "success",
        });
        setTimeout(() => {
          navigate("/profile/organizer");
        }, 1500);
      }
    } catch (error) {
      setToast({
        message: error.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="h-10 w-48 bg-zinc-900 rounded animate-pulse mb-8" />
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8">
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-zinc-900 rounded animate-pulse mb-2" />
                  <div className="h-12 bg-zinc-900 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/profile/organizer")}
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
          <p className="text-zinc-400 mt-2">
            Update your account and organizer information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Account Information */}
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8 mb-6">
            <h2 className="text-xl font-bold text-white mb-6">
              Account Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleUserChange}
                  disabled={loading}
                  className={`w-full h-12 px-4 bg-zinc-900 border ${
                    errors.name ? "border-rose-500" : "border-zinc-800"
                  } rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-rose-500 text-sm mt-2">{errors.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">
              Organizer Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={organizerData.phone}
                  onChange={handleOrganizerChange}
                  disabled={loading}
                  className={`w-full h-12 px-4 bg-zinc-900 border ${
                    errors.phone ? "border-rose-500" : "border-zinc-800"
                  } rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-rose-500 text-sm mt-2">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  About
                </label>
                <textarea
                  name="about"
                  value={organizerData.about}
                  onChange={handleOrganizerChange}
                  disabled={loading}
                  rows="4"
                  className={`w-full px-4 py-3 bg-zinc-900 border ${
                    errors.about ? "border-rose-500" : "border-zinc-800"
                  } rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors resize-none disabled:opacity-50`}
                  placeholder="Tell us about yourself as an organizer..."
                />
                <div className="flex justify-between mt-2">
                  {errors.about ? (
                    <p className="text-rose-500 text-sm">{errors.about}</p>
                  ) : (
                    <p className="text-zinc-500 text-sm">
                      {organizerData.about.length}/1000 characters
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Instagram URL (Optional)
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={organizerData.instagram}
                  onChange={handleOrganizerChange}
                  disabled={loading}
                  className={`w-full h-12 px-4 bg-zinc-900 border ${
                    errors.instagram ? "border-rose-500" : "border-zinc-800"
                  } rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50`}
                  placeholder="https://instagram.com/yourprofile"
                />
                {errors.instagram && (
                  <p className="text-rose-500 text-sm mt-2">
                    {errors.instagram}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={organizerData.website}
                  onChange={handleOrganizerChange}
                  disabled={loading}
                  className={`w-full h-12 px-4 bg-zinc-900 border ${
                    errors.website ? "border-rose-500" : "border-zinc-800"
                  } rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors disabled:opacity-50`}
                  placeholder="https://yourwebsite.com"
                />
                {errors.website && (
                  <p className="text-rose-500 text-sm mt-2">{errors.website}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => navigate("/profile/organizer")}
                disabled={loading}
                className="flex-1 h-12 px-4 bg-transparent border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 px-4 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {loading ? (
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

export default EditOrganizerProfile;
