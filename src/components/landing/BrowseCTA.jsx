import React from "react";
import { Link } from "react-router-dom";

const BrowseCTA = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
          Ready to discover your next experience?
        </h2>
        <Link
          to="/events"
          className="inline-block px-12 py-5 bg-linear-to-r from-purple-600 to-orange-500 text-white rounded-full font-semibold text-xl hover:opacity-90 transition"
        >
          Browse All Events
        </Link>
      </div>
    </section>
  );
};

export default BrowseCTA;
