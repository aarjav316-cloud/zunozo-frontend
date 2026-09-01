import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../api/authApi";
import heroImage from "../../assets/HEROsection.jpg";

const Hero = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
          console.log("User data:", response.user); // Debug log
          console.log("User role:", response.user.role); // Debug log
        }
      } catch (error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <section className="min-h-0 lg:min-h-[85vh] flex items-center pt-28 pb-10 lg:pt-20 lg:pb-0 px-4 sm:px-6">
      <div className="max-w-[1300px] mx-auto w-full lg:px-6">
        <div className="grid lg:grid-cols-[53%_47%] gap-10 lg:gap-16 items-center">
          <div className="space-y-8 lg:space-y-8 text-center md:text-left ">
            <h1 className="font-['Anton'] text-[52px] leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white uppercase tracking-tight lg:tracking-wide lg:mt-10">
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

            <p className="text-base font-medium sm:text-[17px] md:text-lg text-zinc-400 leading-relaxed max-w-[480px] mx-auto md:mx-0 px-2 lg:px-0">
              Discover concerts, house parties, run clubs, workshops and
              experiences near you.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start px-2 lg:px-0 pt-2 lg:pt-0">
              <Link
                to="/events"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 h-14 bg-white text-black rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
              >
                Explore Events
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              {!authLoading && (
                <>
                  {user?.role === "organizer" ? (
                    <Link
                      to="/organizer/events"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-10 h-14 bg-transparent text-white border border-zinc-700 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-zinc-900 hover:border-zinc-600 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      My Events
                    </Link>
                  ) : (
                    <Link
                      to="/become-organizer"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-10 h-14 bg-transparent text-white border border-zinc-700 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-zinc-900 hover:border-zinc-600 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Become Organizer
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="hidden lg:flex relative w-full justify-center lg:mt-10">
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
