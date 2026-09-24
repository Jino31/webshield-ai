import React, { useEffect, useState } from 'react';

export default function IntroAnimation({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out at 2.4s, complete at 3.0s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2400);

    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[300] bg-[#0A0A0F] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 select-none pointer-events-none ${
        isFadingOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Deep Cyberpunk Ambient Lighting */}
      <div className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-[#8B5CF6]/30 via-[#EC4899]/20 to-transparent rounded-full blur-[180px] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0,transparent_75%)]" />

      {/* Floating Cyber Particle Matrix */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"
            style={{
              top: `${15 + (i * 7)}%`,
              left: `${10 + (i * 8)}%`,
              animationDuration: `${1.5 + (i % 3)}s`,
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>

      {/* 3D Vault Core Container */}
      <div className="relative z-10 flex flex-col items-center animate-vaultReveal">
        
        {/* Rotating Orbital Holographic Rings */}
        <div className="absolute -inset-10 rounded-full border border-purple-500/30 animate-spinSlow pointer-events-none" />
        <div className="absolute -inset-16 rounded-full border border-dashed border-pink-500/20 animate-spinReverse pointer-events-none" />

        {/* Glowing Logo Container */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] blur-3xl opacity-80 rounded-full animate-pulse" />
          
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-[#1A1528] via-[#13111C] to-[#0A0A0F] flex items-center justify-center p-3.5 shadow-[0_0_60px_rgba(139,92,246,0.7)] relative z-20 border-2 border-purple-400/60 animate-shieldBounce">
            <img 
              src="/logo.png" 
              alt="WebShield AI Logo" 
              className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(139,92,246,0.9)] filter brightness-110" 
            />
          </div>

          {/* High-Speed Scanning Laser Ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-pink-500/80 animate-laserScan pointer-events-none" />
        </div>

        {/* Typography Reveal */}
        <div className="flex items-center font-extrabold text-3xl sm:text-5xl tracking-tight mb-3 animate-textReveal">
          <span className="text-[#FAFAFA] drop-shadow-[0_2px_20px_rgba(255,255,255,0.4)]">WebShield</span>
          <span className="bg-gradient-to-r from-[#8B5CF6] via-purple-300 to-[#EC4899] bg-clip-text text-transparent ml-2.5 drop-shadow-[0_0_35px_rgba(139,92,246,0.8)]">AI</span>
        </div>

        {/* SecOps Subtitle & Terminal Loader */}
        <div className="flex items-center space-x-2.5 mt-2 animate-fadeInDelay">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-neutral-400 text-xs font-mono uppercase tracking-[0.3em]">
            Initializing Secure AI Core...
          </p>
        </div>

        {/* Energy Charging Progress Line */}
        <div className="w-56 h-1 bg-[#1A1528] rounded-full mt-6 overflow-hidden border border-purple-500/30">
          <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] animate-progressFill shadow-[0_0_12px_#8B5CF6]" />
        </div>
      </div>

      {/* Cinematic Keyframe Styles */}
      <style>{`
        @keyframes vaultReveal {
          0% {
            opacity: 0;
            transform: scale(0.6) translateY(40px);
            filter: blur(20px);
          }
          60% {
            opacity: 1;
            transform: scale(1.04) translateY(0);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }
        .animate-vaultReveal {
          animation: vaultReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes shieldBounce {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        .animate-shieldBounce {
          animation: shieldBounce 2.5s ease-in-out infinite;
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spinSlow {
          animation: spinSlow 12s linear infinite;
        }

        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spinReverse {
          animation: spinReverse 15s linear infinite;
        }

        @keyframes laserScan {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-laserScan {
          animation: laserScan 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes textReveal {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-textReveal {
          animation: textReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          opacity: 0;
        }

        @keyframes fadeInDelay {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeInDelay {
          animation: fadeInDelay 0.5s ease-out 0.6s forwards;
          opacity: 0;
        }

        @keyframes progressFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progressFill {
          animation: progressFill 2.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}