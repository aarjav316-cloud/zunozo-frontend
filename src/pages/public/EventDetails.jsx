import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventBySlug, getEventById } from "../../api/eventApi";

const EventDetails = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      console.log("EventDetails params:", { slug, id });
      try {
        let response;
        if (id) {
          console.log("Fetching by ID:", id);
          response = await getEventById(id);
        } else if (slug) {
          console.log("Fetching by slug:", slug);
          response = await getEventBySlug(slug);
        }

        console.log("Response:", response);
        if (response?.success && response.event) {
          setEvent(response.event);
        }
      } catch (err) {
        console.error("EventDetails fetch error:", err);
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug, id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-zinc-900 rounded" />
            <div className="h-12 w-3/4 bg-zinc-900 rounded" />
            <div className="h-6 w-1/2 bg-zinc-900 rounded" />
            <div className="aspect-video bg-zinc-900 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            {error || "Event not found"}
          </h2>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-3 bg-[#6366F1] text-white rounded-full font-semibold hover:bg-[#5558E3] transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[70%_30%] gap-12">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
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
              Back
            </button>

            {/* Category Badge */}
            <div className="inline-block">
              <div className="backdrop-blur-xl bg-white/[0.08] border border-white/10 rounded-full px-4 py-2">
                <span className="text-sm font-semibold text-white tracking-wide">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Event Title */}
            <h1
              className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
              style={{
                fontFamily: '"Geist", sans-serif',
                letterSpacing: "-0.03em",
              }}
            >
              {event.title}
            </h1>

            {/* Short Description */}
            <p className="text-xl text-gray-400 leading-relaxed">
              {event.shortDescription}
            </p>

            {/* Date, Time, and Venue Row */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#6366F1]"
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
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-white font-semibold">
                    {formatDate(event.startDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#6366F1]"
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
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-white font-semibold">
                    {formatTime(event.startDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#6366F1]"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="text-white font-semibold">
                    {event.venue.venueName}
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* About Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                About This Event
              </h2>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Event Information */}
            <div className="bg-zinc-900/50 rounded-3xl p-8 border border-white/5">
              <h2 className="text-2xl font-bold text-white mb-6">
                Event Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="text-white font-medium">
                    {event.venue.venueName}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-white font-medium">
                    {event.venue.city}, {event.venue.state}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-white font-medium">
                    {formatDate(event.startDate)} at{" "}
                    {formatTime(event.startDate)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="text-white font-medium">
                    {formatDate(event.endDate)} at {formatTime(event.endDate)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="text-white font-medium">
                    {event.capacity} people
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-white font-medium">
                    {event.isFree ? "Free" : `₹${event.price}`}
                  </p>
                </div>

                {event.organizer && (
                  <div className="space-y-2 md:col-span-2">
                    <p className="text-sm text-gray-500">Organized By</p>
                    <p className="text-white font-medium">
                      {event.organizer.name || event.organizer.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Section */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Gallery</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {event.galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video rounded-2xl overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${event.title} gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Booking Card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-zinc-900/50 rounded-3xl p-8 border border-white/5 space-y-6">
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">
                    {event.isFree ? "Free" : `₹${event.price}`}
                  </span>
                  {!event.isFree && (
                    <span className="text-gray-500 text-sm">per person</span>
                  )}
                </div>
              </div>

              <div className="space-y-4 py-6 border-y border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white font-medium text-right">
                    {formatDate(event.startDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Time</span>
                  <span className="text-white font-medium">
                    {formatTime(event.startDate)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Venue</span>
                  <span className="text-white font-medium text-right">
                    {event.venue.venueName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Capacity</span>
                  <span className="text-white font-medium">
                    {event.capacity} people
                  </span>
                </div>
              </div>

              <button className="w-full py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Book Now
              </button>

              <p className="text-center text-sm text-gray-500">
                Booking functionality coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
