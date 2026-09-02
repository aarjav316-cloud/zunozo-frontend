import { useEffect, useState } from "react";

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
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
        .privacy-policy-hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .privacy-policy-hide-scrollbar {
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
        className={`privacy-policy-hide-scrollbar relative w-full max-w-[800px] bg-[#09090b] border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] md:max-h-[85vh] transition-all duration-400 ease-out transform ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-policy-title"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-12 pt-6 md:pt-10 pb-4 bg-gradient-to-b from-[#09090b] via-[#09090b] to-transparent">
          <h2 className="font-bold text-xs uppercase tracking-widest text-zinc-400">PRIVACY POLICY</h2>
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

        {/* Scrollable Content Body */}
        <div className="px-6 md:px-12 pb-12 space-y-10 md:space-y-12">
          
          {/* Main Title & Last Updated */}
          <section className="mt-4 md:mt-6">
            <h1 id="privacy-policy-title" className="font-bold text-4xl md:text-5xl leading-tight tracking-tight text-white mb-3">
              Privacy Policy
            </h1>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
              Last Updated: September 2026
            </p>
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-2xl">
              Zunozo respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              1. Information We Collect
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              We may collect information such as your name, email address, phone number, account details, booking information, and event-related information when you use Zunozo.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              2. How We Use Your Information
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-3">
              We use your information to:
            </p>
            <ul className="space-y-2 text-zinc-400 text-sm md:text-base pl-4 list-disc list-inside leading-relaxed">
              <li>Create and manage your account</li>
              <li>Process event bookings and payments</li>
              <li>Provide tickets and QR codes</li>
              <li>Send booking confirmations and important notifications</li>
              <li>Improve the Zunozo experience</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              3. Payments
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Payments are processed through secure third-party payment providers. Zunozo does not store your complete card or banking details.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              4. Event Organizers
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              When you book an event, limited information necessary for ticket verification and event management may be shared with the event organizer.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              5. Data Security
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              We take reasonable measures to protect your personal information from unauthorized access, misuse, or disclosure. However, no online service can guarantee complete security.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              6. Your Choices
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              You may request access, correction, or deletion of your personal information, subject to applicable laws and operational requirements.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              7. Third-Party Services
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Zunozo may use trusted third-party services for authentication, payments, hosting, notifications, and other essential platform functions.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              8. Changes to This Policy
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              We may update this Privacy Policy when necessary. Any significant changes will be reflected on this page.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              9. Contact Us
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              For privacy-related questions or requests, contact us through the Contact Us section of Zunozo.
            </p>
          </section>

          {/* Agreement Notice & Close Button */}
          <section className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">
              By using Zunozo, you agree to this Privacy Policy.
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

export default PrivacyPolicyModal;
