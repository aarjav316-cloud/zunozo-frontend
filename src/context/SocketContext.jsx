import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

/**
 * =====================================================
 * SOCKET CONTEXT
 * =====================================================
 * Provides a single, reusable, authenticated Socket.io
 * connection for the entire application.
 *
 * - Connects only when the user is authenticated
 * - Disconnects on logout / unmount
 * - Reuses existing cookies (withCredentials: true)
 * - Exposes the socket instance via useSocket() hook
 * =====================================================
 */

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD ? "https://zunozo-backend.onrender.com" : "http://localhost:5000");

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect when the user is authenticated
    if (!isAuthenticated || !user) {
      // Disconnect existing socket if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Avoid duplicate connections
    if (socketRef.current?.connected) return;

    // Create the socket connection
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("[Socket.io] Connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket.io] Disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket.io] Connection error:", err.message);
      setIsConnected(false);
    });

    socketRef.current = socket;

    // Cleanup on unmount or auth change
    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  const value = {
    socket: socketRef.current,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
