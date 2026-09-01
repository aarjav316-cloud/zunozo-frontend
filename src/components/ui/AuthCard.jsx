import React from "react";

const AuthCard = ({ children }) => {
  return (
    <div className="w-full bg-[#09090B]/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
      {children}
    </div>
  );
};

export default AuthCard;
