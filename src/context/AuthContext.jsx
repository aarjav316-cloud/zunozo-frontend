import { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      if (response.success && response.user) {
        // Fetch full user data including timestamps if not provided
        const userData = {
          ...response.user,
          createdAt: response.user.createdAt || new Date().toISOString(),
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    role: user?.role || null,
    refetchUser: fetchUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
