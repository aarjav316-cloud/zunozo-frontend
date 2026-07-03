import React from "react";
import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import TrendingEvents from "../../components/landing/TrendingEvents";
import WhyZunozo from "../../components/landing/WhyZunozo";
import Footer from "../../components/landing/Footer";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-[#07070A]">
      <Navbar />
      <Hero />
      <TrendingEvents />
      <WhyZunozo />
      <Footer />
    </div>
  );
};

export default Homepage;
