import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyBookings } from "../../api/bookingApi";
import BookingCard from "../../components/booking/BookingCard";
import BookingCardSkeleton from "../../components/booking/BookingCardSkeleton";
import BookingEmptyState from "../../components/booking/BookingEmptyState";
import Toast from "../../components/ui/Toast";

/**
 * =====================================================
 * MY BOOKINGS PAGE
 * =====================================================
 * User Booking Dashboard with:
 * - Tab filters: Upcoming / Past / Cancelled
 * - Backend-driven filtering via bookingStatus
 * - Pagination
 * - Loading skeletons
 * - Beautiful empty states
 * - Error handling
 *
 * Design: Matches existing pages like BrowseEvents.jsx
 * and Profile.jsx with consistent bg-[#09090B] dark theme.
 * =====================================================
 */

const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "upcoming";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  /**
   * ---------------------------------------------------
   * Build query params based on active tab
   * ---------------------------------------------------
   * - upcoming: CONFIRMED bookings, sorted by createdAt desc
   * - past: CONFIRMED bookings (frontend filters by date)
   * - cancelled: CANCELLED bookings
   */
  const buildQueryParams = useCallback(
    (page = 1) => {
      const params = {
        page,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      switch (activeTab) {
        case "upcoming":
          params.bookingStatus = "CONFIRMED";
          break;
        case "past":
          params.bookingStatus = "CONFIRMED";
          break;
        case "cancelled":
          params.bookingStatus = "CANCELLED";
          break;
        default:
          params.bookingStatus = "CONFIRMED";
      }

      return params;
    },
    [activeTab]
  );

  /**
   * ---------------------------------------------------
   * Fetch bookings from API
   * ---------------------------------------------------
   */
  const fetchBookings = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);

      try {
        const params = buildQueryParams(page);
        const response = await getMyBookings(params);

        if (response.success && response.data) {
          let fetchedBookings = response.data.bookings || [];

          // Frontend date filtering for upcoming vs past
          const now = new Date();
          if (activeTab === "upcoming") {
            fetchedBookings = fetchedBookings.filter(
              (b) => b.event && new Date(b.event.startDate) > now
            );
          } else if (activeTab === "past") {
            fetchedBookings = fetchedBookings.filter(
              (b) => b.event && new Date(b.event.startDate) <= now
            );
          }

          setBookings(fetchedBookings);
          setPagination(
            response.data.pagination || {
              currentPage: page,
              totalPages: 1,
              totalBookings: fetchedBookings.length,
              hasNextPage: false,
              hasPrevPage: false,
            }
          );
        }
      } catch (err) {
        if (err.message?.includes("Unauthorized") || err.status === 401) {
          navigate("/signin", { replace: true });
          return;
        }
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    },
    [buildQueryParams, activeTab, navigate]
  );

  /**
   * ---------------------------------------------------
   * Fetch on mount and tab change
   * ---------------------------------------------------
   */
  useEffect(() => {
    fetchBookings(1);
  }, [fetchBookings]);

  /**
   * ---------------------------------------------------
   * Tab change handler
   * ---------------------------------------------------
   */
  const handleTabChange = (tabKey) => {
    setSearchParams({ tab: tabKey });
  };

  /**
   * ---------------------------------------------------
   * Pagination handlers
   * ---------------------------------------------------
   */
  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      fetchBookings(pagination.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      fetchBookings(pagination.currentPage - 1);
    }
  };

  /**
   * ---------------------------------------------------
   * Callback after cancel booking success
   * ---------------------------------------------------
   */
  const handleBookingCancelled = (bookingId) => {
    setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
    setToast({
      message: "Booking cancelled successfully.",
      type: "success",
    });
  };

  /**
   * ---------------------------------------------------
   * Error state
   * ---------------------------------------------------
   */
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
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

          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-rose-500"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-zinc-400 mb-6">{error}</p>
            <button
              onClick={() => fetchBookings(1)}
              className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
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

        {/* Page Header */}
        <div className="mb-10">
          <h1
            className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-3"
            style={{
              fontFamily: '"Geist", sans-serif',
              letterSpacing: "-0.03em",
            }}
          >
            My Bookings
          </h1>
          <p className="text-zinc-500 text-lg">
            Manage your event tickets and bookings
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-3 mb-10 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-white text-black"
                  : "bg-zinc-900/50 text-zinc-400 border border-white/10 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          /* Loading Skeletons */
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <BookingEmptyState activeTab={activeTab} />
        ) : (
          <>
            {/* Booking count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-zinc-500 text-sm">
                {pagination.totalBookings}{" "}
                {pagination.totalBookings === 1 ? "booking" : "bookings"}
              </p>
            </div>

            {/* Booking Cards */}
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.bookingId || booking._id}
                  booking={booking}
                  onCancelled={handleBookingCancelled}
                  onViewDetails={() =>
                    navigate(`/bookings/${booking.bookingId}`)
                  }
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={handlePrevPage}
                  disabled={!pagination.hasPrevPage}
                  className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-zinc-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNextPage}
                  className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
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

export default MyBookings;
