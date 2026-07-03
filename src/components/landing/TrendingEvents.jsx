import { useState, useEffect, useRef } from "react";
import EventCard from "../events/EventCard";
import { getApprovedEvents } from "../../api/eventApi";

const TrendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const headingContent = (
    <div
      ref={sectionRef}
      className={`mb-10 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <h2
        className="text-4xl md:text-5xl lg:text-6xl text-white mb-4"
        style={{
          fontFamily: '"Geist", sans-serif',
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: "0.95",
        }}
      >
        What's Hot
      </h2>
      <p
        className="text-base lg:text-lg text-gray-400"
        style={{
          fontFamily: '"Geist", sans-serif',
          fontWeight: 400,
        }}
      >
        Events everyone is talking about.
      </p>
    </div>
  );

  if (loading) {
    return (
      <section className="pt-20 md:pt-24 lg:pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {headingContent}

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide mt-10">
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
      <section className="pt-20 md:pt-24 lg:pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {headingContent}

          <div className="text-center py-12 mt-10">
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="pt-20 md:pt-24 lg:pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {headingContent}

          <div className="text-center py-12 mt-10">
            <p className="text-gray-400">No events available at the moment</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-20 md:pt-24 lg:pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {headingContent}

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide mt-10">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingEvents;
