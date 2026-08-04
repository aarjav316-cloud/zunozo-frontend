import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrganizerProfile } from "../../api/organizerApi";
import { logoutUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../components/ui/Toast";

const OrganizerProfile = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getOrganizerProfile();
      if (response.success && response.data) {
        setProfileData(response.data);
      }
    } catch (error) {
      setToast({
        message: error.message || "Failed to load profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      setUser(null);
      navigate("/");
    } catch (error) {
      setToast({
        message: error.message || "Logout failed",
        type: "error",
      });
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="h-10 w-32 bg-zinc-900 rounded animate-pulse mb-8" />
          <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-32 h-32 rounded-full bg-zinc-900 animate-pulse" />
              <div className="flex-1 space-y-4">
                <div className="h-8 w-48 bg-zinc-900 rounded animate-pulse" />
                <div className="h-6 w-64 bg-zinc-900 rounded animate-pulse" />
                <div className="h-6 w-40 bg-zinc-900 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { user, organizer } = profileData || {};

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
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
          Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {getInitials(user?.name)}
                  </span>
                </div>
              )}
              {organizer?.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-500 border-4 border-[#18181B] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1
                    className="text-3xl font-bold text-white mb-2"
                    style={{
                      fontFamily: '"Geist", sans-serif',
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {organizer?.organizerName}
                  </h1>
                  <p className="text-zinc-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => navigate("/profile/organizer/edit")}
                  className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-100 transition-colors self-start"
                >
                  Edit Profile
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="px-3 py-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-sm font-medium">
                  ORGANIZER
                </div>
                {organizer?.isVerified && (
                  <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-sm font-medium">
                    VERIFIED
                  </div>
                )}
                <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400">
                  Member since {formatDate(user?.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate("/profile/security")}
            className="bg-[#18181B] border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                <svg
                  className="w-6 h-6 text-zinc-400"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Security Settings
                </h3>
                <p className="text-sm text-zinc-400">
                  Change password and manage security
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-[#18181B] border border-zinc-800 rounded-xl p-6 hover:border-rose-500/20 hover:bg-rose-500/5 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-rose-500/10 transition-colors">
                <svg
                  className="w-6 h-6 text-zinc-400 group-hover:text-rose-500"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </h3>
                <p className="text-sm text-zinc-400">
                  Sign out of your account
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* User Information */}
        <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Account Information
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400">Full Name</span>
              <span className="text-white">{user?.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400">Email Address</span>
              <span className="text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400">Role</span>
              <span className="text-white capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-zinc-400">Account Created</span>
              <span className="text-white">{formatDate(user?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Organizer Information */}
        <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            Organizer Information
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400">Organizer Name</span>
              <span className="text-white">{organizer?.organizerName}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400">Phone Number</span>
              <span className="text-white">{organizer?.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400">Instagram</span>
              {organizer?.instagram ? (
                <a
                  href={organizer.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View Profile →
                </a>
              ) : (
                <span className="text-zinc-500">Not provided</span>
              )}
            </div>
            <div className="flex justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400">Website</span>
              {organizer?.website ? (
                <a
                  href={organizer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Visit Website →
                </a>
              ) : (
                <span className="text-zinc-500">Not provided</span>
              )}
            </div>
            <div className="flex justify-between py-3 border-b border-zinc-800">
              <span className="text-zinc-400">Verification Status</span>
              <span
                className={`${organizer?.isVerified ? "text-emerald-500" : "text-amber-500"}`}
              >
                {organizer?.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-zinc-400">Organizer Since</span>
              <span className="text-white">
                {formatDate(organizer?.createdAt)}
              </span>
            </div>
          </div>

          {/* About Section */}
          {organizer?.about && (
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">About</h3>
              <p className="text-white leading-relaxed">{organizer.about}</p>
            </div>
          )}
        </div>
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

export default OrganizerProfile;
