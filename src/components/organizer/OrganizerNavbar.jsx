import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../ui/NotificationBell";

const OrganizerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const getInitials = (name) => {
    if (!name) return "O";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/organizer/events", label: "My Events" },
    { to: "/organizer/events/create", label: "Create Event" },
    { to: "/organizer/scan-tickets", label: "Scan Tickets" },
    { to: "/events", label: "Browse Events" },
  ];

  return (
    <>
      <nav className="bg-[#09090B] border-b border-zinc-800 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <span className="font-instrument text-2xl font-normal text-white tracking-wide">Zunozo</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Notification Bell */}
              <NotificationBell />

              {/* Profile Avatar */}
              <Link
                to="/profile/organizer"
                className="w-10 h-10 rounded-full bg-[#000000] border border-white/10 flex items-center justify-center hover:bg-zinc-900 transition-colors shadow-sm shrink-0"
              >
                <span className="text-sm font-bold text-white">
                  {getInitials(user?.name)}
                </span>
              </Link>
            </div>

            {/* Mobile Right Actions */}
            <div className="flex md:hidden items-center gap-3">
              <NotificationBell />

              <Link
                to="/profile/organizer"
                className="w-9 h-9 rounded-full bg-[#000000] border border-white/10 flex items-center justify-center shrink-0"
              >
                <span className="text-xs font-bold text-white">
                  {getInitials(user?.name)}
                </span>
              </Link>

              {/* Hamburger Button (Opens Drawer) */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                aria-label="Open navigation menu"
              >
                <svg className="w-6 h-6" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER LAYER */}
      
      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 transition-opacity md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sliding Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-[#09090B] border-r border-zinc-800 flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-zinc-800 shrink-0">
          <Link
            to="/"
            className="flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="font-instrument text-2xl font-normal text-white tracking-wide">
              Zunozo
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-9 h-9 -mr-2 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            aria-label="Close navigation menu"
          >
            <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="px-4 py-6 space-y-1 flex-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-zinc-800/60 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/40 hover:text-white"
                }`}
                style={{ fontFamily: '"Geist", sans-serif' }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default OrganizerNavbar;
