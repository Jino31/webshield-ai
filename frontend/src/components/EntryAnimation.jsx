import React, { useState, useEffect } from 'react';

export default function EntryAnimation() {
  const [percentage, setPercentage] = useState(0);

  // Live counting percentage ticker from 0 to 100% over ~2.4 seconds
  useEffect(() => {
    let start = 0;
    const duration = 2400;
    const stepTime = 24;
    const steps = duration / stepTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= 100) {
        setPercentage(100);
        clearInterval(timer);
      } else {
        setPercentage(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      aria-label="WebShield AI initializing"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0F] text-[#FAFAFA] overflow-hidden select-none"
      style={{ animation: 'webshieldEntryFade 0.4s ease-out forwards' }}
    >
      {/* Self-Contained Keyframe Animations & Reduced Motion Support */}
      <style>{`
        @keyframes webshieldEntryFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes webshieldLogoReveal {
          from {
            opacity: 0;
            transform: scale(0.7) rotate(-12deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes webshieldLogoGlow {
          0%, 100% {
            box-shadow: 0 0 25px rgba(139, 92, 246, 0.2), 0 0 60px rgba(236, 72, 153, 0.08);
          }
          50% {
            box-shadow: 0 0 45px rgba(139, 92, 246, 0.55), 0 0 100px rgba(236, 72, 153, 0.25);
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
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes webshieldStatusBlink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes webshieldScanLine {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes webshieldGridPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* Tactical Grid Background Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"
        style={{ animation: 'webshieldGridPulse 4s ease-in-out infinite' }}
      />

      {/* Atmospheric Background Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#8B5CF6]/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#EC4899]/10 blur-[150px] pointer-events-none" />

      {/* HUD Corner Brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#8B5CF6]/40 pointer-events-none" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#8B5CF6]/40 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#8B5CF6]/40 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#8B5CF6]/40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
        
        {/* Logo Container with Rotating Rings & Scanner */}
        <div 
          className="relative w-28 h-28 sm:w-32 sm:h-32 mb-8 flex items-center justify-center"
          style={{ animation: 'webshieldLogoReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}
        >
          {/* Outer Rotating Ring with Energy Gradient */}
          <div 
            className="absolute inset-[-12px] rounded-full border border-transparent border-t-[#8B5CF6] border-r-[#EC4899]/50 border-b-transparent border-l-[#8B5CF6]/30 pointer-events-none"
            style={{ animation: 'webshieldRing 10s linear infinite' }}
          />

          {/* Inner Dashed Ring */}
          <div 
            className="absolute inset-[-4px] rounded-full border border-dashed border-[#8B5CF6]/40 pointer-events-none"
            style={{ animation: 'webshieldRingReverse 7s linear infinite' }}
          />

          {/* Central Glass Logo Box */}
          <div 
            className="w-full h-full rounded-3xl bg-[#13111C]/90 backdrop-blur-xl border border-[#231E33] flex items-center justify-center overflow-hidden relative shadow-2xl"
            style={{ animation: 'webshieldLogoGlow 3s ease-in-out infinite' }}
          >
            {/* Cybersecurity Laser Scan Line */}
            <div 
              className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#8B5CF6]/40 to-transparent pointer-events-none z-10"
              style={{ animation: 'webshieldScanLine 2.2s ease-in-out infinite' }}
            />

            <img 
              src="/logo.png" 
              alt="WebShield AI Logo" 
              className="w-16 h-16 sm:w-18 sm:h-18 object-contain relative z-0 filter drop-shadow-[0_0_12px_rgba(139,92,246,0.4)]" 
            />
          </div>
        </div>

        {/* Brand Title */}
        <div 
          className="text-center mb-2"
          style={{ animation: 'webshieldTextReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
            WebShield AI
          </h1>
        </div>

        {/* Subtitle */}
        <p 
          className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase mb-5 text-center"
          style={{ animation: 'webshieldTextReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both' }}
        >
          INITIALIZING SECURE ENVIRONMENT...
        </p>

        {/* Status Indicator */}
        <div 
          className="flex items-center gap-2.5 mb-8 text-[11px] font-mono tracking-wide text-neutral-300 bg-[#13111C]/90 border border-[#231E33] px-4 py-2 rounded-full shadow-inner"
          style={{ animation: 'webshieldTextReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.85s both' }}
        >
          <span 
            className="w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]" 
            style={{ animation: 'webshieldStatusBlink 1.4s ease-in-out infinite' }}
          />
          <span>INITIALIZING SECURITY MODULES</span>
        </div>

        {/* Progress Bar Container with Live Percentage */}
        <div 
          className="w-full space-y-2"
          style={{ animation: 'webshieldTextReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1s both' }}
        >
          <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
            <span>Security Engine Initialization</span>
            <span className="text-[#8B5CF6] font-bold font-mono">{percentage}%</span>
          </div>

          <div className="w-full bg-[#13111C] rounded-full h-1.5 overflow-hidden border border-[#231E33] p-[1px] relative shadow-inner">
            <div 
              className="bg-gradient-to-r from-[#8B5CF6] via-[#C084FC] to-[#EC4899] h-full rounded-full transition-all duration-75 relative shadow-[0_0_10px_rgba(139,92,246,0.5)]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}