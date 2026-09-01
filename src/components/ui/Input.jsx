import React from "react";

const Input = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={id}
          className="block text-[11px] font-semibold text-zinc-400 mb-2 uppercase tracking-widest"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:bg-white/10 focus:border-white/30 focus:ring-0 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300"
      />
    </div>
  );
};

export default Input;
