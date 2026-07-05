import { useAuth } from "../context/AuthContext";
import GuestHome from "../components/home/GuestHome";
import UserHome from "../components/home/UserHome";
import OrganizerHome from "../components/home/OrganizerHome";
import AdminHome from "../components/home/AdminHome";

const HomePage = () => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Role-based homepage rendering
  if (!user || role === "user") {
    return role === "user" ? <UserHome /> : <GuestHome />;
  }

  if (role === "organizer") {
    return <OrganizerHome />;
  }

  if (role === "admin") {
    return <AdminHome />;
  }

  // Fallback to guest home
  return <GuestHome />;
};

export default HomePage;
