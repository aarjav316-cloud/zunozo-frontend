import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.slug}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div onClick={handleClick} className="flex-none w-80 group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-103">
        <div className="aspect-3/4 bg-gradient-to-br from-gray-800 to-gray-900">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-purple-600 to-orange-500" />
          )}
        </div>
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-xl font-semibold text-white line-clamp-2">
          {event.title}
        </h3>
        <p className="text-gray-400 text-sm">
          {event.venue?.city}, {event.venue?.state}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">
            {formatDate(event.startDate)}
          </span>
          <span className="text-purple-500 font-semibold">
            {event.isFree ? "Free" : `₹${event.price}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
