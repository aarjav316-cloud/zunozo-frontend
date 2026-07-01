import { Link } from "react-router-dom";
import heroImage from "../../assets/HEROsection.jpg";

const Hero = () => {
  return (
    <section className="min-h-[85vh] flex items-center pt-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 md:space-y-8 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              DISCOVER
              <br />
              THE NEXT
              <br />
              <span className="bg-linear-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                GENERATION
              </span>
              <br />
              OF EVENTS
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-lg mx-auto md:mx-0">
              Discover concerts, house parties, run clubs, workshops and
              experiences near you.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/events"
                className="px-8 py-4 bg-linear-to-r from-purple-600 to-orange-500 text-white rounded-full font-semibold text-lg hover:opacity-90 transition"
              >
                Explore Events
              </Link>
              <Link
                to="/organizer"
                className="px-8 py-4 bg-gray-800 text-white rounded-full font-semibold text-lg hover:bg-gray-700 transition"
              >
                Become Organizer
              </Link>
            </div>
          </div>

          <div className="relative w-full flex justify-center order-last md:order-none">
            <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative w-full max-w-[320px] sm:max-w-[400px] md:w-[520px] h-[450px] sm:h-[550px] md:h-[700px] rounded-[40px] overflow-hidden border border-gray-700 shadow-2xl">
              <img
                src={heroImage}
                alt="Zunozo Events"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
