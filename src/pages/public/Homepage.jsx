import React from "react";
import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import TrendingEvents from "../../components/landing/TrendingEvents";
import WhyZunozo from "../../components/landing/WhyZunozo";
import BrowseCTA from "../../components/landing/BrowseCTA";
import Footer from "../../components/landing/Footer";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-[#07070A]">
      <Navbar />
      <Hero />
      <TrendingEvents />
      <WhyZunozo />
      <BrowseCTA />
      <Footer />
    </div>
  );
};

export default Homepage;
