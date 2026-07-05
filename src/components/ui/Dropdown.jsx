import { useState, useRef, useEffect } from "react";

const Dropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event, optionValue) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(optionValue);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-11 px-4 bg-[#18181B] border rounded-xl text-white text-sm font-medium transition-all duration-200 flex items-center justify-between gap-3 min-w-[160px] ${
          isOpen
            ? "border-[#6366F1] shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
            : "border-[#27272A] hover:bg-[#202024] hover:border-[#3F3F46]"
        }`}
      >
        <span>{selectedOption?.label}</span>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 w-full bg-[#18181B] border border-[#27272A] rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
          style={{
            animation: "dropdownOpen 200ms ease-out",
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onKeyDown={(e) => handleKeyDown(e, option.value)}
                className={`w-full h-10 px-3 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center justify-between ${
                  isSelected
                    ? "bg-[#6366F1] text-white"
                    : "text-white hover:bg-[#27272A]"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes dropdownOpen {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Dropdown;
