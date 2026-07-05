import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerField = ({ label, name, value, onChange, error, placeholder, required }) => {
  const selectedDate = value ? new Date(value) : null;

  const handleChange = (date) => {
    if (!date) {
      onChange({ target: { name, value: "" } });
      return;
    }
    // Convert to ISO string to keep robust API compatibility
    onChange({ target: { name, value: date.toISOString() } });
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          showTimeSelect
          timeFormat="h:mm aa"
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="dd MMM yyyy h:mm aa"
          placeholderText={placeholder || "Select date and time"}
          className={`w-full pl-4 pr-12 py-3 bg-zinc-900/50 border rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#6366F1] transition-colors ${
            error ? "border-rose-500" : "border-zinc-800"
          }`}
          wrapperClassName="w-full"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
};

export default DatePickerField;
