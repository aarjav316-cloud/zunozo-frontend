import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../ui/NotificationBell";
import { searchEvents } from "../../api/eventApi";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  const handleSearch = useCallback(async (query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    try {
      const data = await searchEvents(trimmed);
      setSearchResults(data.events || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const onInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    // Debounce 400ms
    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 400);
  };

  const onResultClick = (slug) => {
    setShowDropdown(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/events/${slug}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const formatPrice = (event) => {
    if (event.isFree) return "Free";
    return `₹${event.price}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 md:bg-black/60 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20">
        <div className="flex items-center justify-between h-full gap-4 md:gap-6">
          {/* Logo & Search Bar */}
          <div className="flex items-center gap-6 flex-1">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <span className="font-instrument text-3xl font-normal text-white tracking-wide transition-colors duration-200">
                Zunozo
              </span>
            </Link>

            {/* Search Bar */}
            <div
              className="hidden md:flex items-center max-w-xs relative"
              ref={searchRef}
            >
              <div className="relative w-full">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={onInputChange}
                  onKeyDown={onKeyDown}
                  onFocus={() => {
                    if (searchQuery.trim() && searchResults.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-zinc-500 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all duration-200"
                />
              </div>

              {/* Search Results Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 w-[340px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[60]">
                  {isSearching ? (
                    <div className="px-5 py-6 flex items-center justify-center gap-2.5">
                      <svg
                        className="w-4 h-4 text-zinc-500 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      <span className="text-sm text-zinc-500">
                        Searching...
                      </span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="px-5 py-6 text-center">
                      <p className="text-sm text-zinc-400 mb-1">
                        No events found for &quot;{searchQuery.trim()}&quot;
                      </p>
                      <p className="text-xs text-zinc-600">
                        Try searching by event name or organizer
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-[380px] overflow-y-auto overscroll-contain">
                      {searchResults.map((event) => (
                        <button
                          key={event._id}
                          onClick={() => onResultClick(event.slug)}
                          className="w-full flex items-center gap-3.5 px-4 py-3 hover:bg-zinc-900/80 transition-colors text-left border-b border-zinc-800/50 last:border-0"
                        >
                          {/* Event Thumbnail */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                            {event.coverImage ? (
                              <img
                                src={event.coverImage}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-zinc-800" />
                            )}
                          </div>

                          {/* Event Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate leading-tight">
                              {event.title}
                            </p>
                            {event.organizerName && (
                              <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                                by {event.organizerName}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              {event.venue?.city && (
                                <span className="text-[11px] text-zinc-500 truncate">
                                  {event.venue.city}
                                </span>
                              )}
                              <span className="text-[11px] font-semibold text-zinc-300">
                                {formatPrice(event)}
                              </span>
                            </div>
                          </div>

                          {/* Arrow */}
                          <svg
                            className="w-4 h-4 text-zinc-600 shrink-0"
                            fill="none"
                            strokeWidth="2"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/events"
              className="hidden lg:block text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Browse Events
            </Link>
            <Link
              to="/become-organizer"
              className="hidden lg:block text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Become Organizer
            </Link>

            {/* Auth Button/Avatar */}
            {authLoading ? (
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
              <>
                <NotificationBell />
                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center w-10 h-10 bg-[#000000] border border-white/10 text-white rounded-full text-sm font-semibold hover:bg-zinc-900 transition-all duration-200 shadow-sm"
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </Link>
              </>
            ) : (
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-6 h-10 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
