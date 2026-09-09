import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../../components/events/EventCard";
import { getApprovedEvents } from "../../api/eventApi";

const BrowseEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Music",
    "Sports",
    "Arts",
    "Technology",
    "Food",
    "Business",
    "Health",
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getApprovedEvents();
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

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (event) =>
          event.category?.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue?.city?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedCategory, events]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        {/* Header */}
        <header className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <button
              onClick={() => navigate("/")}
              className="text-white/60 hover:text-white transition-colors mb-6 flex items-center gap-2"
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
            <h1
              className="text-5xl md:text-6xl font-bold text-white tracking-tight"
              style={{
                fontFamily: '"Geist", sans-serif',
                letterSpacing: "-0.03em",
              }}
            >
              Browse Events
            </h1>
          </div>
        </header>

        {/* Loading State */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-zinc-900 rounded-3xl animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
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
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-500 text-white rounded-full font-semibold hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Header */}
      <header className="border-b border-white/5 sticky top-0 bg-[#09090B]/90 backdrop-blur-xl z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight break-words"
              style={{ fontFamily: '"Geist", sans-serif', letterSpacing: "-0.03em" }}
            >
              Browse Events
            </h1>
            <button
              onClick={() => navigate("/")}
              className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 active:bg-white/10 rounded-full transition-all flex-shrink-0"
              aria-label="Back to Home"
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl mb-6">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search events by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 md:py-4 bg-[#18181B] border border-zinc-800 rounded-xl text-white text-sm md:text-base placeholder-zinc-500 focus:outline-none focus:border-[#6366F1] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-2.5 overflow-x-auto touch-pan-x [&::-webkit-scrollbar]:hidden w-full pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                  selectedCategory === category
                    ? "bg-white text-black"
                    : "bg-[#18181B] text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-zinc-900 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-600" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              No events found
            </h2>
            <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your filters or search query to find more events."
                : "Check back soon for upcoming events."}
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-medium text-zinc-500">
                {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} found
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredEvents.map((event) => (
                <div key={event._id} className="w-full max-w-[340px] sm:max-w-none mx-auto [&>div]:w-full [&>div]:mx-auto">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BrowseEvents;
