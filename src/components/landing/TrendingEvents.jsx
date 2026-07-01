import { useState, useEffect } from "react";
import EventCard from "../events/EventCard";
import { getApprovedEvents } from "../../api/eventApi";

const TrendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getApprovedEvents();
        if (response.success && response.events) {
          setEvents(response.events.slice(0, 8));
        }
      } catch (err) {
        setError(err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-white mb-4">
              Trending Near You
            </h2>
            <p className="text-xl text-gray-400">
              Handpicked experiences this week
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-none w-80">
                <div className="aspect-3/4 bg-gray-800 rounded-2xl animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-6 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 bg-gray-800 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-white mb-4">
              Trending Near You
            </h2>
            <p className="text-xl text-gray-400">
              Handpicked experiences this week
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-white mb-4">
              Trending Near You
            </h2>
            <p className="text-xl text-gray-400">
              Handpicked experiences this week
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-gray-400">No events available at the moment</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Trending Near You
          </h2>
          <p className="text-xl text-gray-400">
            Handpicked experiences this week
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingEvents;
