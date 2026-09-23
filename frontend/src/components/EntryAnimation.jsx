import React from 'react';

export default function EntryAnimation() {
  return (
    <div 
      aria-label="WebShield AI initializing"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0F] text-[#FAFAFA] overflow-hidden select-none"
      style={{ animation: 'webshieldEntryFade 0.3s ease-out forwards' }}
    >
      <style>{`
        @keyframes webshieldEntryFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes webshieldLogoReveal {
          from {
            opacity: 0;
            transform: scale(0.75) rotate(-8deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes webshieldLogoGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.15), 0 0 50px rgba(236, 72, 153, 0.05);
          }
          50% {
            box-shadow: 0 0 35px rgba(139, 92, 246, 0.45), 0 0 80px rgba(236, 72, 153, 0.18);
          }
        }

        @keyframes webshieldRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes webshieldRingReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes webshieldTextReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes webshieldStatusBlink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @keyframes webshieldScanLine {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes webshieldProgress {
          from { width: 0%; }
          to { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* Atmospheric Background Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-[#8B5CF6]/12 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#EC4899]/80 blur-[130px] pointer-events-none opacity-40" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        
        {/* Logo Container with Rotating Rings & Scanner */}
        <div 
          className="relative w-24 h-24 sm:w-28 sm:h-28 mb-8 flex items-center justify-center"
          style={{ animation: 'webshieldLogoReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}
        >
          {/* Outer Rotating Ring (Clockwise) */}
          <div 
            className="absolute inset-[-10px] rounded-full border border-transparent border-t-[#8B5CF6]/60 border-r-[#EC4899]/40 pointer-events-none"
            style={{ animation: 'webshieldRing 12s linear infinite' }}
          />

          {/* Inner Dashed Ring (Counter-Clockwise) */}
          <div 
            className="absolute inset-[-4px] rounded-full border border-dashed border-[#8B5CF6]/30 pointer-events-none"
            style={{ animation: 'webshieldRingReverse 8s linear infinite' }}
          />

          {/* Central Logo Box */}
          <div 
            className="w-full h-full rounded-3xl bg-[#13111C] border border-[#231E33] flex items-center justify-center overflow-hidden relative"
            style={{ animation: 'webshieldLogoGlow 3s ease-in-out infinite' }}
          >
            {/* Cybersecurity Scan Line Effect */}
            <div 
              className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-[#8B5CF6]/30 to-transparent pointer-events-none z-10"
              style={{ animation: 'webshieldScanLine 2s ease-in-out infinite' }}
            />

            <img 
              src="/logo.png" 
              alt="WebShield AI Logo" 
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain relative z-0" 
            />
          </div>
        </div>

        {/* Brand Title */}
        <div 
          className="text-center mb-2"
          style={{ animation: 'webshieldTextReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            WebShield AI
          </h1>
        </div>

        {/* Subtitle */}
        <p 
          className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase mb-4 text-center"
          style={{ animation: 'webshieldTextReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both' }}
        >
          INITIALIZING SECURE ENVIRONMENT...
        </p>

        {/* Status Indicator */}
        <div 
          className="flex items-center gap-2 mb-8 text-[11px] font-mono tracking-wide text-neutral-400 bg-[#13111C]/80 border border-[#231E33] px-3.5 py-1.5 rounded-full"
          style={{ animation: 'webshieldTextReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both' }}
        >
          <span 
            className="w-2 h-2 rounded-full bg-[#8B5CF6]" 
            style={{ animation: 'webshieldStatusBlink 1.5s ease-in-out infinite' }}
          />
          <span>INITIALIZING SECURITY MODULES</span>
        </div>

        {/* Progress Bar Container */}
        <div 
          className="w-full space-y-2"
          style={{ animation: 'webshieldTextReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.85s both' }}
        >
          <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
            <span>Security Engine Initialization</span>
            <span className="text-[#8B5CF6] font-semibold">100%</span>
          </div>

          <div className="w-full bg-[#13111C] rounded-full h-1.5 overflow-hidden border border-[#231E33] p-[1px]">
            <div 
              className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] h-full rounded-full"
              style={{ animation: 'webshieldProgress 2.2s cubic-bezier(0.4, 0, 0.2, 1) 0.85s forwards', width: '0%' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}