import { useEffect, useState } from "react";

const ContactUsModal = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false);

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
        .contact-us-hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .contact-us-hide-scrollbar {
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
        className={`contact-us-hide-scrollbar relative w-full max-w-[800px] bg-[#09090b] border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] md:max-h-[85vh] transition-all duration-400 ease-out transform ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-us-title"
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
        <div className="px-6 md:px-12 pb-12 space-y-12 md:space-y-16">
          
          {/* Main Title */}
          <section className="mt-6 md:mt-8">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Support & Inquiries</h3>
            <h1 id="contact-us-title" className="font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-white max-w-3xl mb-6">
              GET IN TOUCH<br />WITH US.
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl">
              Have questions about an event, need help with your bookings, or want to partner with Zunozo? Reach out directly.
            </p>
          </section>

          {/* Contact Details Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Phone Contact Card */}
            <a
              href="tel:6261362971"
              className="group p-8 bg-[#121215] border border-white/10 rounded-xl space-y-6 hover:border-white/20 hover:bg-[#16161a] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Phone / WhatsApp</h4>
                <span className="text-white text-xl md:text-2xl font-medium tracking-tight block">
                  6261362971
                </span>
              </div>
            </a>

            {/* Email Contact Card */}
            <a
              href="mailto:divyjain1969@gmail.com"
              className="group p-8 bg-[#121215] border border-white/10 rounded-xl space-y-6 hover:border-white/20 hover:bg-[#16161a] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Email Address</h4>
                <span className="text-white text-lg md:text-xl font-medium tracking-tight block break-words">
                  divyjain1969@gmail.com
                </span>
              </div>
            </a>

          </section>

          {/* Response Message & Close */}
          <section className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-zinc-500 text-sm leading-relaxed">
              Our team typically responds within a few hours.
            </p>
            <button
              onClick={onClose}
              className="px-7 py-3 bg-[#121215] hover:bg-[#1a1a20] text-white border border-white/15 hover:border-white/30 rounded-lg text-xs font-semibold tracking-widest uppercase transition-all duration-200 w-full md:w-auto text-center"
            >
              CLOSE
            </button>
          </section>
          
        </div>
      </div>
    </div>
  );
};

export default ContactUsModal;
