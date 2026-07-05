import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles = [],
}) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // If route requires authentication but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/signin" replace />;
  }

  // If route requires specific roles and user doesn't have the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
