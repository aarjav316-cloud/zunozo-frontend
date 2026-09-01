import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  fullWidth = false,
}) => {
  const baseStyles =
    "px-6 py-3.5 rounded-xl text-[13px] uppercase font-bold tracking-[0.1em] transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-white text-black hover:bg-zinc-100 shadow-[0_4px_10px_rgba(0,0,0,0.2)] border border-transparent",
    secondary: "bg-white/10 text-white hover:bg-white/15",
    outline: "border border-white/10 text-white hover:bg-white/5",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${widthStyles}`}
    >
      {children}
    </button>
  );
};

export default Button;
