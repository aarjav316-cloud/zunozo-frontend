import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../api/authApi";
import Toast from "../../components/ui/Toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, setUser, role } = useAuth();
  const [toast, setToast] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirect organizers to their specific profile page
  useEffect(() => {
    if (!loading && role === "organizer") {
      navigate("/profile/organizer", { replace: true });
      return;
    }
  }, [role, loading, navigate]);

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

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      organizer: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      user: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    };
    return badges[role] || badges.user;
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
          Back to Home
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
                <div className="w-32 h-32 rounded-full bg-[#000000] border border-white/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {getInitials(user?.name)}
                  </span>
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
                    {user?.name}
                  </h1>
                  <p className="text-zinc-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-100 transition-colors self-start"
                >
                  Edit Profile
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <div
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getRoleBadge(user?.role)}`}
                >
                  {user?.role?.toUpperCase()}
                </div>
                <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400">
                  Member since {formatDate(user?.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => navigate("/bookings")}
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
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  My Bookings
                </h3>
                <p className="text-sm text-zinc-400">
                  View and manage your tickets
                </p>
              </div>
            </div>
          </button>

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

        {/* Account Details */}
        <div className="bg-[#18181B] border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Account Details</h2>
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

export default Profile;
