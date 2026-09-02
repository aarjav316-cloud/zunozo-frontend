import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AboutUsModal = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setShow(true), 10);
    
    return () => {
      document.body.style.overflow = "";
      setShow(false);
      clearTimeout(timer);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      <style>{`
        .about-us-hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .about-us-hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 transition-opacity duration-300 ease-out ${show ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        className={`about-us-hide-scrollbar relative w-full max-w-[800px] bg-[#09090b] border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] md:max-h-[85vh] transition-all duration-400 ease-out transform ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-us-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-12 pt-6 md:pt-10 pb-4 bg-gradient-to-b from-[#09090b] via-[#09090b] to-transparent">
          <h2 className="font-bold text-2xl text-white">Zunozo</h2>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white rounded-full hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 md:px-12 pb-12 space-y-16 md:space-y-24">
          
          {/* Brand Intro */}
          <section className="mt-8 md:mt-12">
            <h1 id="about-us-title" className="font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-white max-w-3xl mb-8">
              EVENTS ARE BETTER<br />WHEN THEY FEEL LIKE YOU.
            </h1>
            <div className="space-y-6 text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl">
              <p>
                Zunozo is built for a generation that doesn't just want somewhere to go — they want something to remember.
              </p>
              <p>
                Discover concerts, house parties, run clubs, workshops and experiences happening around you.
              </p>
            </div>
          </section>

          {/* Why Zunozo */}
          <section>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">Why Zunozo?</h3>
            <div className="space-y-6 text-zinc-300 text-lg md:text-xl leading-relaxed max-w-2xl">
              <p>
                Finding something to do shouldn't be this hard.
              </p>
              <p>
                Events are scattered across Instagram stories, WhatsApp groups, posters and different platforms.
              </p>
              <p>
                Zunozo brings those experiences together so you can discover what's happening around you and find something worth showing up for.
              </p>
            </div>
          </section>

          {/* Our Vision */}
          <section>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">Our Vision</h3>
            <div className="space-y-6 text-zinc-300 text-lg md:text-xl leading-relaxed max-w-2xl">
              <p>
                We're building the home for real-world experiences.
              </p>
              <p>
                Zunozo aims to become the place where people discover, book and experience the events that define their city.
              </p>
            </div>
          </section>

          {/* What You Can Discover */}
          <section>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-8">What's Happening?</h3>
            <div className="flex flex-wrap gap-3 text-zinc-200 text-sm md:text-base">
              <span className="px-4 py-2 border border-white/10 bg-white/5">Concerts & Music</span>
              <span className="px-4 py-2 border border-white/10 bg-white/5">Run Clubs</span>
              <span className="px-4 py-2 border border-white/10 bg-white/5">House Parties</span>
              <span className="px-4 py-2 border border-white/10 bg-white/5">Workshops</span>
              <span className="px-4 py-2 border border-white/10 bg-white/5">Shows</span>
              <span className="px-4 py-2 border border-white/10 bg-white/5">Experiences</span>
              <span className="px-4 py-2 border border-white/10 bg-white/5">Pop-ups</span>
              <span className="px-4 py-2 border border-white/10 bg-white/5">Fitness Events</span>
            </div>
          </section>

          {/* Built For Creators */}
          <section>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">Built For Creators</h3>
            <h2 className="font-bold text-3xl md:text-4xl leading-tight text-white mb-6">
              BUILT FOR THE PEOPLE<br />CREATING THE MOMENTS.
            </h2>
            <div className="space-y-6 text-zinc-300 text-lg md:text-xl leading-relaxed max-w-2xl">
              <p>
                Zunozo gives event organizers the tools to create, manage and sell experiences while helping them reach people who are actually looking for what they're creating.
              </p>
            </div>
          </section>

          {/* Brand Philosophy */}
          <section>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">Brand Philosophy</h3>
            <h2 className="font-bold text-3xl md:text-4xl leading-tight text-white mb-6">
              LESS SCROLLING.<br />MORE EXPERIENCING.
            </h2>
            <div className="space-y-6 text-zinc-300 text-lg md:text-xl leading-relaxed max-w-2xl">
              <p>
                The best memories aren't made behind a screen.
              </p>
              <p>
                They're made at a concert, during a sunrise run, at a house party, at a workshop, or while meeting people you've never met before.
              </p>
              <p>
                That's what Zunozo is about.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="pt-8 md:pt-12 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-white/10">
            <h2 className="font-bold text-3xl md:text-4xl leading-tight text-white max-w-sm">
              YOUR NEXT MEMORY<br />IS OUT THERE.
            </h2>
            <button
              onClick={() => {
                onClose();
                navigate('/events');
              }}
              className="px-8 py-4 bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors w-full md:w-auto text-center tracking-wide"
            >
              EXPLORE EVENTS →
            </button>
          </section>
          
        </div>
      </div>
    </div>
  );
};

export default AboutUsModal;
