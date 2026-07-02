import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WhyZunozo = () => {
  const pathRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Animate SVG path drawing on scroll
    if (pathRef.current) {
      const path = pathRef.current;
      const pathLength = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: step1Ref.current,
          start: "top 60%",
          end: "bottom+=3500 center",
          scrub: 2,
        },
      });
    }

    // Animate cards appearing as path reaches them
    const cards = [step1Ref, step2Ref, step3Ref, step4Ref, ctaRef];
    cards.forEach((cardRef) => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    });
  }, []);

  return (
    <section className="relative py-32 px-6 bg-[#09090B] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-32">
          <p className="text-zinc-500 text-sm uppercase tracking-wider mb-4">
            How Zunozo Works
          </p>
          <h2 className="font-['Anton'] text-6xl md:text-7xl lg:text-8xl text-white uppercase leading-none mb-6">
            FROM
            <br />
            DISCOVERING EVENTS
            <br />
            <span className="text-zinc-400">TO MAKING</span>
            <br />
            MEMORIES
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Your journey from finding the perfect event to creating
            unforgettable moments
          </p>
        </div>

        {/* Connecting SVG Path - Desktop */}
        <svg
          className="absolute left-0 top-[420px] w-full h-[2600px] pointer-events-none hidden lg:block"
          viewBox="0 0 1200 2600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ zIndex: 0 }}
        >
          <path
            ref={pathRef}
            d="M 350 100 Q 450 150 550 250 Q 700 350 800 500 Q 850 650 650 750 Q 500 820 350 900 Q 300 1050 450 1200 Q 600 1300 750 1450 Q 850 1600 700 1700 Q 550 1800 400 1900 Q 350 2000 500 2100 Q 600 2200 600 2400"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            style={{
              filter: "drop-shadow(0 0 12px rgba(255,255,255,0.25))",
            }}
          />
        </svg>

        {/* Mobile Timeline */}
        <svg
          className="absolute left-1/2 -translate-x-1/2 top-[420px] w-4 h-[2200px] pointer-events-none lg:hidden"
          viewBox="0 0 20 2200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 10 0 Q 10 100 10 200 Q 10 300 10 400 Q 10 500 10 600 Q 10 700 10 800 Q 10 900 10 1000 Q 10 1100 10 1200 Q 10 1300 10 1400 Q 10 1500 10 1600 L 10 2200"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Step 1 - Discover */}
        <div
          ref={step1Ref}
          className="relative grid lg:grid-cols-2 gap-16 items-center mb-48"
          style={{ zIndex: 1 }}
        >
          <div className="space-y-6 order-2 lg:order-1">
            <div className="inline-block px-4 py-1 bg-white/5 rounded-full">
              <span className="text-zinc-400 text-sm">Step 1</span>
            </div>
            <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Discover
              <br />
              Events
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Find concerts, house parties, run clubs, workshops and hidden
              experiences curated just for you. No more endless scrolling.
            </p>
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-zinc-500 text-sm">Live Events</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">50+</p>
                <p className="text-zinc-500 text-sm">Cities</p>
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="aspect-9/16 max-w-xs mx-auto bg-zinc-900 rounded-3xl p-4 shadow-2xl border border-white/10">
              <div className="w-full h-full bg-linear-to-br from-purple-600/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white/50">
                  Event Discovery UI
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 - Book */}
        <div
          ref={step2Ref}
          className="relative grid lg:grid-cols-2 gap-16 items-center mb-48"
          style={{ zIndex: 1 }}
        >
          <div className="relative order-1">
            <div className="aspect-16/10 bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-white/10">
              <div className="w-full h-full bg-linear-to-br from-orange-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white/50">
                  Booking Interface
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6 order-2">
            <div className="inline-block px-4 py-1 bg-white/5 rounded-full">
              <span className="text-zinc-400 text-sm">Step 2</span>
            </div>
            <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Book
              <br />
              Instantly
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Reserve your seat in seconds. Secure payment, instant
              confirmation. Your ticket is ready before you know it.
            </p>
            <button className="inline-flex items-center gap-2 text-white hover:text-zinc-300 transition">
              <span>See how it works</span>
              <svg
                className="w-4 h-4"
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
            </button>
          </div>
        </div>

        {/* Step 3 - Get Ticket */}
        <div
          ref={step3Ref}
          className="relative grid lg:grid-cols-2 gap-16 items-center mb-48"
          style={{ zIndex: 1 }}
        >
          <div className="space-y-6 order-2 lg:order-1">
            <div className="inline-block px-4 py-1 bg-white/5 rounded-full">
              <span className="text-zinc-400 text-sm">Step 3</span>
            </div>
            <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Get Your
              <br />
              Ticket
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              QR ticket delivered instantly. Track your booking status. Set
              reminders. Everything you need in one place.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="px-4 py-2 bg-white/5 rounded-full text-zinc-400 text-sm">
                QR Code
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-full text-zinc-400 text-sm">
                Countdown
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-full text-zinc-400 text-sm">
                Reminders
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="aspect-9/16 max-w-xs mx-auto bg-zinc-900 rounded-3xl p-4 shadow-2xl border border-white/10">
              <div className="w-full h-full bg-linear-to-br from-purple-600/20 to-pink-600/20 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white/50">Ticket UI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 - Enjoy */}
        <div
          ref={step4Ref}
          className="relative grid lg:grid-cols-2 gap-16 items-center mb-32"
          style={{ zIndex: 1 }}
        >
          <div className="relative order-1">
            <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <div className="w-full h-full bg-linear-to-br from-orange-500/30 to-purple-600/30 flex items-center justify-center">
                <div className="text-center text-white/50">
                  Event Experience
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6 order-2">
            <div className="inline-block px-4 py-1 bg-white/5 rounded-full">
              <span className="text-zinc-400 text-sm">Step 4</span>
            </div>
            <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Enjoy
              <br />
              Together
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Meet people, join communities, create memories. This is where the
              magic happens.
            </p>
            <div className="pt-4">
              <p className="text-sm text-zinc-500 mb-2">
                Join thousands already creating memories
              </p>
              <div className="flex -space-x-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-orange-500 border-2 border-zinc-900"
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-zinc-900 flex items-center justify-center text-xs text-zinc-400">
                  +2k
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div ref={ctaRef} className="text-center pt-16" style={{ zIndex: 1 }}>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to start your journey?
          </h3>
          <button className="inline-flex items-center justify-center gap-2 px-10 h-14 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-200 shadow-lg">
            Explore Events
            <svg
              className="w-4 h-4"
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
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyZunozo;
