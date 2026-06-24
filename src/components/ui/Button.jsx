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
    "px-6 py-3 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500",
    secondary: "bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500",
    outline:
      "border border-gray-700 text-white hover:bg-gray-800 focus:ring-gray-500",
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
