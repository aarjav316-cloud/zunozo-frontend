import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-semibold text-white">Zunozo</span>
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
              to="/events"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              All Events
            </Link>

            {/* Profile Avatar */}
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <span className="text-sm font-bold text-white">
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
