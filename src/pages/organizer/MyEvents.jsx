import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEvents, deleteEvent } from "../../api/eventApi";
import MyEventCard from "../../components/organizer/MyEventCardNew";

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("newest");

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

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    setFilteredEvents(filtered);
  }, [searchQuery, statusFilter, events, sortBy]);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await deleteEvent(eventId);
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (err) {
      alert(err.message || "Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <div className="h-12 w-64 bg-zinc-900 rounded animate-pulse mb-4" />
            <div className="h-6 w-96 bg-zinc-900 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-zinc-900 rounded-[20px] animate-pulse"
              />
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
        <div className="mb-12">
          <div className="flex items-start justify-between mb-4">
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
              <p className="text-zinc-500 text-base">
                Manage and track all your events
              </p>
            </div>
            <button
              onClick={() => navigate("/organizer/events/create")}
              className="px-6 py-2.5 bg-white text-black rounded-[14px] font-medium hover:bg-zinc-100 transition-colors flex items-center gap-2"
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
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search & Controls */}
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
                className="w-full h-10 pl-11 pr-4 bg-[#18181B] border border-zinc-800 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-4 bg-[#18181B] border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#6366F1] transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            <div className="hidden md:flex items-center gap-2 bg-[#18181B] border border-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Grid
              </button>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
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

        {/* Events List/Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-zinc-900 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-zinc-600"
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
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {events.length === 0 ? "No events yet" : "No events found"}
            </h2>
            <p className="text-zinc-500 mb-6 text-sm">
              {events.length === 0
                ? "Start creating your first event"
                : "Try adjusting your filters"}
            </p>
            {events.length === 0 ? (
              <button
                onClick={() => navigate("/organizer/events/create")}
                className="px-6 py-2.5 bg-white text-black rounded-[14px] font-medium hover:bg-zinc-100 transition-colors inline-flex items-center gap-2"
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
            ) : (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-[14px] font-medium hover:bg-zinc-800 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-zinc-500 text-sm">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "event" : "events"}
              </p>
            </div>
            <div
              className={
                viewMode === "list"
                  ? "space-y-4"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              }
            >
              {filteredEvents.map((event) => (
                <MyEventCard
                  key={event._id}
                  event={event}
                  onDelete={handleDelete}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
