import { Link } from "react-router-dom";
import heroImage from "../../assets/HEROsection.jpg";

const Hero = () => {
  return (
    <section className="min-h-[85vh] flex items-center pt-20 px-4 sm:px-6">
      <div className="max-w-[1300px] mx-auto w-full px-6">
        <div className="grid lg:grid-cols-[53%_47%] gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 text-center md:text-left">
            <h1 className="font-['Anton'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white leading-none tracking-wide uppercase lg:mt-10">
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

          <div className="relative w-full flex justify-center order-last md:order-none lg:mt-10">
            <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative w-full max-w-[340px] sm:max-w-[440px] md:w-[580px] lg:w-[760px] aspect-[4/5] rounded-[40px] overflow-hidden border border-gray-700 shadow-2xl">
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
