import React from "react";
import RadialGlowBackground from "../ui/RadialGlowBackground";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <RadialGlowBackground>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 font-geist">
        {/* Branding */}
        <div className="mb-10 text-center animate-scale-in">
          <h1 className="font-instrument text-5xl sm:text-6xl text-white font-normal tracking-wide mb-3">
            Zunozo
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-widest uppercase opacity-80">
            Your next event awaits
          </p>
        </div>

        {/* Auth Content */}
        <div className="w-full max-w-md w-[90%] sm:w-full">
          {/* Title and Subtitle */}
          {(title || subtitle) && (
            <div className="mb-8 text-center">
              {title && (
                <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2 tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && <p className="text-sm text-zinc-400 font-light">{subtitle}</p>}
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
