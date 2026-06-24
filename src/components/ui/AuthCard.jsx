import React from "react";

const AuthCard = ({ children }) => {
  return (
    <div className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-8 shadow-xl">
      {children}
    </div>
  );
};

export default AuthCard;
