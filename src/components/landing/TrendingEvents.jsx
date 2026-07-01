import React from "react";

const EventCard = ({ event }) => {
  return (
    <div className="flex-none w-80 group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl transition-transform duration-300 group-hover:scale-103">
        <div className="aspect-3/4 bg-linear-to-br from-purple-600 to-orange-500"></div>
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-xl font-semibold text-white">{event.title}</h3>
        <p className="text-gray-400">{event.location}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">{event.date}</span>
          <span className="text-purple-500 font-semibold">{event.price}</span>
        </div>
      </div>
    </div>
  );
};

const TrendingEvents = () => {
  const events = [
    {
      id: 1,
      title: "Summer Music Festival",
      location: "Mumbai, India",
      date: "Aug 15, 2026",
      price: "₹1,299",
    },
    {
      id: 2,
      title: "Tech Startup Mixer",
      location: "Bangalore, India",
      date: "Aug 20, 2026",
      price: "Free",
    },
    {
      id: 3,
      title: "Sunset Beach Party",
      location: "Goa, India",
      date: "Aug 25, 2026",
      price: "₹899",
    },
    {
      id: 4,
      title: "Art & Wine Night",
      location: "Delhi, India",
      date: "Aug 30, 2026",
      price: "₹599",
    },
  ];

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
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingEvents;
