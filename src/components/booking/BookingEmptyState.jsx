import { useNavigate } from "react-router-dom";

/**
 * =====================================================
 * BOOKING EMPTY STATE
 * =====================================================
 * Beautiful empty states for each tab:
 * - upcoming: "No upcoming bookings"
 * - past: "All caught up"
 * - cancelled: "No cancelled bookings"
 *
 * Design: Matches existing empty states from
 * AdminHome.jsx and BrowseEvents.jsx.
 * =====================================================
 */

const BookingEmptyState = ({ activeTab }) => {
  const navigate = useNavigate();

  const states = {
    upcoming: {
      icon: (
        <svg
          className="w-10 h-10 text-[#6366F1]"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
          />
        </svg>
      ),
      title: "No upcoming bookings",
      description: "Browse events and book your next experience!",
      action: {
        label: "Browse Events",
        onClick: () => navigate("/events"),
      },
      bgColor: "bg-[#6366F1]/10",
    },
    past: {
      icon: (
        <svg
          className="w-10 h-10 text-emerald-500"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "All caught up!",
      description: "You don't have any past bookings to show.",
      action: null,
      bgColor: "bg-emerald-500/10",
    },
    cancelled: {
      icon: (
        <svg
          className="w-10 h-10 text-zinc-500"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      ),
      title: "No cancelled bookings",
      description: "Great — none of your bookings have been cancelled.",
      action: null,
      bgColor: "bg-zinc-800",
    },
  };

  const state = states[activeTab] || states.upcoming;

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div
        className={`w-20 h-20 rounded-full ${state.bgColor} flex items-center justify-center mb-6`}
      >
        {state.icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{state.title}</h3>
      <p className="text-zinc-400 text-center max-w-md mb-6">
        {state.description}
      </p>
      {state.action && (
        <button
          onClick={state.action.onClick}
          className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
        >
          {state.action.label}
        </button>
      )}
    </div>
  );
};

export default BookingEmptyState;
