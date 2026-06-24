import React from "react";

const RadialGlowBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020617]">
      {/* Amber/golden radial glow - top center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)",
        }}
      />

      {/* Blue/purple subtle glow - adds depth */}
      <div
        className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default RadialGlowBackground;
