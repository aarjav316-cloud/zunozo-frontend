import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEvents, deleteEvent } from "../../api/eventApi";
import PremiumEventCard from "../../components/organizer/PremiumEventCard";
import StatCard from "../../components/organizer/StatCard";
import EmptyState from "../../components/organizer/EmptyState";
import NoResults from "../../components/organizer/NoResults";
import DeleteModal from "../../components/organizer/DeleteModal";
import SkeletonCard from "../../components/organizer/SkeletonCard";
import Dropdown from "../../components/ui/Dropdown";
import Toast from "../../components/ui/Toast";

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [toast, setToast] = useState(null);

  const statusOptions = [
    "ALL",
    "APPROVED",
    "PENDING_REVIEW",
    "REJECTED",
    "CHANGES_REQUESTED",
    "CANCELLED",
    "COMPLETED",
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getMyEvents();
      if (response.success && response.events) {
        setEvents(response.events);
        setFilteredEvents(response.events);
      }
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = events;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    setFilteredEvents(filtered);
  }, [searchQuery, statusFilter, events, sortBy]);

  // Calculate statistics from fetched events
  const stats = {
    total: events.length,
    approved: events.filter((e) => e.status === "APPROVED").length,
    pending: events.filter((e) => e.status === "PENDING_REVIEW").length,
    rejected: events.filter((e) => e.status === "REJECTED").length,
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteEvent(eventToDelete._id);
      setEvents(events.filter((event) => event._id !== eventToDelete._id));
      setDeleteModalOpen(false);
      setEventToDelete(null);
      setToast({ message: "Event deleted successfully", type: "success" });
    } catch (err) {
      setDeleteError(err.message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <div className="h-14 w-64 bg-zinc-900 rounded animate-pulse mb-3" />
            <div className="h-5 w-96 bg-zinc-900 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-zinc-900 rounded-xl animate-pulse"
              />
            ))}
          </div>

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
          <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
          <button
            onClick={fetchEvents}
            className="px-6 py-2.5 bg-white text-black rounded-[14px] font-medium hover:bg-zinc-100 transition-colors"
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
                My Events
              </h1>
              <p className="text-zinc-500">Manage and track all your events</p>
            </div>
            <button
              onClick={() => navigate("/organizer/events/create")}
              className="px-6 py-3 bg-white text-black rounded-[14px] font-medium hover:bg-zinc-100 transition-colors flex items-center gap-2 self-start"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Create Event
            </button>
          </div>

          {/* Statistics */}
          {events.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                label="Pending"
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
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                label="Rejected"
                value={stats.rejected}
                color="rose"
              />
            </div>
          )}

          {/* Search & Filters */}
          {events.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
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
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 bg-[#18181B] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#6366F1] transition-colors"
                  />
                </div>

                <Dropdown
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { value: "newest", label: "Newest First" },
                    { value: "oldest", label: "Oldest First" },
                  ]}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      statusFilter === status
                        ? "bg-white text-black"
                        : "bg-transparent text-zinc-400 border border-zinc-800 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {status.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {events.length === 0 ? (
          <EmptyState
            onCreateEvent={() => navigate("/organizer/events/create")}
          />
        ) : filteredEvents.length === 0 ? (
          <NoResults onClearFilters={handleClearFilters} />
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
                <PremiumEventCard
                  key={event._id}
                  event={event}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setEventToDelete(null);
            setDeleteError(null);
          }
        }}
        onConfirm={handleDeleteConfirm}
        eventTitle={eventToDelete?.title || ""}
        isDeleting={isDeleting}
        error={deleteError}
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

export default MyEvents;
