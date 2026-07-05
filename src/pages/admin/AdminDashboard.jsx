import { useState, useEffect } from "react";
import { getPendingEvents, reviewEvent } from "../../api/eventApi";
import StatCard from "../../components/admin/StatCard";
import PendingEventCard from "../../components/admin/PendingEventCard";
import EventDetailsDrawer from "../../components/admin/EventDetailsDrawer";
import ReviewModal from "../../components/admin/ReviewModal";
import EmptyState from "../../components/admin/EmptyState";
import SkeletonCard from "../../components/admin/SkeletonCard";
import Toast from "../../components/ui/Toast";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING_REVIEW");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPendingEvents();
      if (response.success) {
        setEvents(response.events || []);
        setFilteredEvents(response.events || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = events;

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query) ||
          event.organizer?.fullname.toLowerCase().includes(query),
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, statusFilter, events]);

  // Calculate statistics
  const stats = {
    pending: events.filter((e) => e.status === "PENDING_REVIEW").length,
    approved: events.filter((e) => e.status === "APPROVED").length,
    rejected: events.filter((e) => e.status === "REJECTED").length,
    changesRequested: events.filter((e) => e.status === "CHANGES_REQUESTED")
      .length,
    total: events.length,
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  const handleActionClick = (event, action) => {
    setSelectedEvent(event);
    setReviewAction(action);
    setReviewModalOpen(true);
  };

  const handleReviewConfirm = async (status, comment) => {
    if (!selectedEvent) return;

    try {
      const response = await reviewEvent(selectedEvent._id, {
        status,
        reviewComment: comment,
      });

      if (response.success) {
        // Remove from events list
        setEvents(events.filter((e) => e._id !== selectedEvent._id));

        setReviewModalOpen(false);
        setDrawerOpen(false);
        setSelectedEvent(null);

        setToast({
          message: `Event ${status.toLowerCase().replace(/_/g, " ")} successfully`,
          type: "success",
        });
      }
    } catch (err) {
      setToast({
        message: err.message || "Failed to review event",
        type: "error",
      });
    }
  };

  const statusOptions = [
    { value: "PENDING_REVIEW", label: "Pending Review" },
    { value: "ALL", label: "All" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
    { value: "CHANGES_REQUESTED", label: "Changes Requested" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Skeleton */}
          <div className="mb-10">
            <div className="h-14 w-80 bg-zinc-900 rounded animate-pulse mb-3" />
            <div className="h-5 w-96 bg-zinc-900 rounded animate-pulse mb-8" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-zinc-900 rounded-xl animate-pulse"
              />
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
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
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{error}</h2>
          <button
            onClick={fetchEvents}
            className="mt-4 px-6 py-2.5 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h1
                className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-3"
                style={{
                  fontFamily: '"Geist", sans-serif',
                  letterSpacing: "-0.03em",
                }}
              >
                Admin Dashboard
              </h1>
              <p className="text-zinc-500">
                Review and moderate submitted events
              </p>
            </div>
            <div className="flex items-center gap-3 self-start">
              {stats.pending > 0 && (
                <div className="px-4 py-2 bg-amber-500/10 text-amber-500 rounded-xl text-sm font-medium border border-amber-500/20">
                  {stats.pending} Pending
                </div>
              )}
              <button
                onClick={fetchEvents}
                disabled={loading}
                className="px-5 py-2.5 bg-white text-black rounded-xl font-medium hover:bg-zinc-100 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon={
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              label="Pending Review"
              value={stats.pending}
              color="amber"
            />
            <StatCard
              icon={
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              label="Approved"
              value={stats.approved}
              color="emerald"
            />
            <StatCard
              icon={
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
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              label="Rejected"
              value={stats.rejected}
              color="rose"
            />
            <StatCard
              icon={
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
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              }
              label="Changes Requested"
              value={stats.changesRequested}
              color="blue"
            />
            <StatCard
              icon={
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              }
              label="Total Events"
              value={stats.total}
              color="zinc"
            />
          </div>

          {/* Search & Filters */}
          <div className="space-y-4">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by title, category, or organizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-[#18181B] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    statusFilter === option.value
                      ? "bg-white text-black"
                      : "bg-transparent text-zinc-400 border border-zinc-800 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-zinc-500 text-sm">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "event" : "events"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <PendingEventCard
                  key={event._id}
                  event={event}
                  onViewDetails={handleViewDetails}
                  onAction={handleActionClick}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Event Details Drawer */}
      <EventDetailsDrawer
        event={selectedEvent}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedEvent(null);
        }}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedEvent(null);
          setReviewAction(null);
        }}
        onConfirm={handleReviewConfirm}
        event={selectedEvent}
        action={reviewAction}
      />

      {/* Toast Notification */}
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

export default AdminDashboard;
