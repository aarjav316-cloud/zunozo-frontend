import Navbar from "../landing/Navbar";
import Hero from "../landing/Hero";
import TrendingEvents from "../landing/TrendingEvents";
import WhyZunozo from "../landing/WhyZunozo";
import Footer from "../landing/Footer";

const UserHome = () => {
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

export default UserHome;
