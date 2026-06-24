import React from "react";
import RadialGlowBackground from "../ui/RadialGlowBackground";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <RadialGlowBackground>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Zunozo</h1>
          <p className="text-sm text-gray-400">Your next event awaits</p>
        </div>

        {/* Auth Content */}
        <div className="w-full max-w-md">
          {/* Title and Subtitle */}
          {(title || subtitle) && (
            <div className="mb-6 text-center">
              {title && (
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {title}
                </h2>
              )}
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
          )}

          {/* Children (forms, cards, etc.) */}
          {children}
        </div>
      </div>
    </RadialGlowBackground>
  );
};

export default AuthLayout;
