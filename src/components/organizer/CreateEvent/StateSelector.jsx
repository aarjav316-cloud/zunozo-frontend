import { useState, useRef, useEffect } from "react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const StateSelector = ({ label, name, value, onChange, error, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const lookupRef = useRef(null);

  // Sync initial value or external value resets
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (lookupRef.current && !lookupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStates = INDIAN_STATES.filter((state) =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (stateName) => {
    setSearchTerm(stateName);
    setIsOpen(false);
    onChange({ target: { name, value: stateName } });
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    onChange({ target: { name, value: e.target.value } });
  };

  return (
    <div className="space-y-2 relative" ref={lookupRef}>
      <label htmlFor={name} className="block text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Select or type a state"
          className={`w-full px-4 py-3 bg-zinc-900/50 border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366F1] transition-colors ${
            error ? "border-rose-500" : "border-zinc-800"
          }`}
          autoComplete="off"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
          <svg className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#18181B] border border-zinc-800 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] max-h-60 overflow-y-auto scrollbar-hide">
          {filteredStates.length > 0 ? (
            <ul className="py-2">
              {filteredStates.map((state) => (
                <li
                  key={state}
                  onClick={() => handleSelect(state)}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    value === state
                      ? "bg-[#6366F1]/10 text-[#6366F1]"
                      : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                  }`}
                >
                  {state}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-zinc-500 text-center">
              No states found
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
};

export default StateSelector;
