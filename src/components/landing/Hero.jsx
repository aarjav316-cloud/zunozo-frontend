import { Link } from "react-router-dom";
import heroImage from "../../assets/HEROsection.jpg";

const Hero = () => {
  return (
    <section className="min-h-[85vh] flex items-center pt-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
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

            <p className="text-xl text-gray-400 max-w-lg">
              Discover concerts, house parties, run clubs, workshops and
              experiences near you.
            </p>

            <div className="flex flex-wrap gap-4">
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

          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-linear-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden border border-gray-700 h-[500px]">
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
