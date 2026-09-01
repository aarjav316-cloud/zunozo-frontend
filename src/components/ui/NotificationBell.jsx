import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../../context/SocketContext";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";

/**
 * =====================================================
 * NOTIFICATION BELL COMPONENT
 * =====================================================
 * Reusable notification dropdown for all navbars.
 *
 * - Fetches initial notifications + unread count on mount
 * - Listens for `notification:new` via Socket.io
 * - Uses notification _id to prevent duplicates
 * - Dropdown with mark-as-read and mark-all-read
 * - Matches the Zunozo dark theme
 * =====================================================
 */

const NOTIFICATION_ICONS = {
  BOOKING_CONFIRMED: "🎫",
  NEW_BOOKING: "📦",
  TICKET_CHECKED_IN: "✅",
  EVENT_APPROVED: "🎉",
  EVENT_REJECTED: "❌",
  EVENT_SUBMITTED: "📝",
};

const NotificationBell = () => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  /**
   * ---------------------------------------------------
   * Fetch initial data on mount
   * ---------------------------------------------------
   */
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [notifRes, countRes] = await Promise.all([
        getNotifications(1, 15),
        getUnreadCount(),
      ]);
      if (notifRes.success) {
        setNotifications(notifRes.data.notifications);
      }
      if (countRes.success) {
        setUnreadCount(countRes.data.unreadCount);
      }
    } catch (err) {
      // Silently fail — notifications are non-critical UI
      console.error("[NotificationBell] Fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  /**
   * ---------------------------------------------------
   * Socket.io listener for real-time notifications
   * ---------------------------------------------------
   */
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      // Prevent duplicate by checking _id
      setNotifications((prev) => {
        if (prev.some((n) => n._id === notification._id)) return prev;
        return [notification, ...prev].slice(0, 20);
      });
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification:new", handleNewNotification);
    return () => socket.off("notification:new", handleNewNotification);
  }, [socket]);

  /**
   * ---------------------------------------------------
   * Close dropdown on outside click
   * ---------------------------------------------------
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * ---------------------------------------------------
   * Mark single as read
   * ---------------------------------------------------
   */
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true, readAt: new Date() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("[NotificationBell] Mark read failed:", err.message);
    }
  };

  /**
   * ---------------------------------------------------
   * Mark all as read
   * ---------------------------------------------------
   */
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("[NotificationBell] Mark all read failed:", err.message);
    }
  };

  /**
   * ---------------------------------------------------
   * Time ago formatter
   * ---------------------------------------------------
   */
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5 text-zinc-300"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6366F1] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#09090B]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#18181B] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#6366F1] hover:text-[#818CF8] font-medium transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-6 h-6 border-2 border-zinc-700 border-t-[#6366F1] rounded-full animate-spin mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-zinc-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif._id}
                  onClick={() => {
                    if (!notif.isRead) handleMarkAsRead(notif._id);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50 last:border-b-0 ${
                    !notif.isRead ? "bg-[#6366F1]/[0.04]" : ""
                  }`}
                >
                  {/* Icon */}
                  <span className="text-lg mt-0.5 shrink-0">
                    {NOTIFICATION_ICONS[notif.type] || "🔔"}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-medium truncate ${
                          notif.isRead ? "text-zinc-400" : "text-white"
                        }`}
                      >
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#6366F1] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
