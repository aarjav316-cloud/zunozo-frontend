import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

/**
 * Handles the redirect from the backend Google OAuth callback.
 *
 * Flow:
 *  1. Backend redirects here with ?accessToken=...&refreshToken=...
 *  2. This page sends those tokens to /auth/set-token-cookies via AJAX
 *     (which stores them as httpOnly cookies in the correct partition).
 *  3. Refetches user state and navigates to home.
 */
function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      setError("Authentication failed. Missing tokens.");
      setTimeout(() => navigate("/signin"), 2000);
      return;
    }

    // Clear tokens from URL immediately (security: prevent leaking via referrer)
    window.history.replaceState({}, "", "/auth/google/callback");

    const storeTokens = async () => {
      try {
        await axiosInstance.post("/auth/set-token-cookies", {
          accessToken,
          refreshToken,
        });

        // Refresh auth state then navigate to home
        await refetchUser();
        navigate("/");
      } catch (err) {
        console.error("Failed to store OAuth tokens:", err);
        setError("Authentication failed. Please try again.");
        setTimeout(() => navigate("/signin"), 2000);
      }
    };

    storeTokens();
  }, []);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <p>Completing sign in...</p>
    </div>
  );
}

export default GoogleCallbackPage;
