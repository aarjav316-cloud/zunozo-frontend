import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20">
        <div className="flex items-center justify-between h-full gap-6">
          {/* Logo & Search Bar */}
          <div className="flex items-center gap-6 flex-1">
            <Link
              to="/"
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-orange-500 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-semibold text-white transition-colors duration-200">
                Zunozo
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center max-w-xs">
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
                  className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-zinc-500 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all duration-200"
                />
              </div>
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
              to="/organizer"
              className="hidden lg:block text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Become Organizer
            </Link>
            <Link
              to="/signin"
              className="inline-flex items-center justify-center px-6 h-10 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
