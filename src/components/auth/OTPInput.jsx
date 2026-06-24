import React, { useRef, useState } from "react";

const OTPInput = ({ length = 6, value, onChange }) => {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(length).fill(""));

  const handleChange = (index, val) => {
    if (isNaN(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChange(otpString);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    const newOtp = [...otp];

    pastedData.split("").forEach((char, i) => {
      if (i < length && !isNaN(char)) {
        newOtp[i] = char;
      }
    });

    setOtp(newOtp);
    onChange(newOtp.join(""));

    const lastFilledIndex = Math.min(pastedData.length, length) - 1;
    inputRefs.current[lastFilledIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center mb-6">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl font-semibold bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
        />
      ))}
    </div>
  );
};

export default OTPInput;
