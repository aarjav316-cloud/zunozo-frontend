import React from "react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-purple-600/50 transition group">
      <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

const WhyZunozo = () => {
  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Discover Faster",
      description:
        "Find the perfect event in seconds with our intelligent search and personalized recommendations.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Verified Organizers",
      description:
        "Every event organizer is verified to ensure authentic and high-quality experiences.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      title: "Instant Booking",
      description:
        "Book your tickets instantly with secure payments and instant confirmation.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-gray-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Why Zunozo?</h2>
          <p className="text-xl text-gray-400">
            The premium platform for discovering experiences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyZunozo;
