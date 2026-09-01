import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../ui/NotificationBell";

const AdminNavbar = () => {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  return (
    <nav className="bg-[#09090B] border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-instrument text-2xl font-normal text-white tracking-wide">Zunozo</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/dashboard"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Pending Reviews
            </Link>
            <Link
              to="/admin/organizers"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Organizers
            </Link>
            <Link
              to="/events"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              All Events
            </Link>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Profile Avatar */}
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full bg-white text-black font-semibold flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-sm"
            >
              <span className="text-sm font-bold text-black">
                {getInitials(user?.name)}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
