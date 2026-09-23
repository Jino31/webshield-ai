import React, { useState, useEffect, useRef } from 'react';
import { Globe, Cpu, CheckCircle2, Activity, Lock, Zap } from 'lucide-react';

export default function Hero3DShield() {
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Performant Mouse Parallax via requestAnimationFrame
  useEffect(() => {
    if (isReducedMotion) return;

    let animationFrameId;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Calculate normalized cursor coordinates (-1 to 1)
      targetX = (e.clientX / innerWidth - 0.5) * 20;
      targetY = (e.clientY / innerHeight - 0.5) * 20;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setMouseOffset({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isReducedMotion]);

  return (
    <div 
      ref={containerRef}
      aria-hidden="true"
      className="relative w-full max-w-7xl mx-auto h-[520px] sm:h-[620px] flex items-center justify-center my-4 sm:my-8 [perspective:1500px] select-none pointer-events-none overflow-hidden"
    >
      
      {/* 1. Cinematic Atmospheric Background Glows */}
      <div className="absolute w-[650px] h-[650px] bg-gradient-to-tr from-[#8B5CF6]/20 via-[#EC4899]/15 to-transparent rounded-full blur-[180px] animate-pulse pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0,transparent,transparent)] pointer-events-none" />

      {/* 2. Floating Lightweight CSS Particle Field */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[
          { top: '15%', left: '22%', size: 'w-1.5 h-1.5', duration: '6s', delay: '0s' },
          { top: '75%', left: '18%', size: 'w-2 h-2', duration: '8s', delay: '1s' },
          { top: '30%', left: '80%', size: 'w-1 h-1', duration: '5s', delay: '2s' },
          { top: '65%', left: '82%', size: 'w-2.5 h-2.5', duration: '7s', delay: '1.5s' },
          { top: '20%', left: '50%', size: 'w-1 h-1', duration: '9s', delay: '0.5s' },
          { top: '85%', left: '48%', size: 'w-1.5 h-1.5', duration: '6s', delay: '2.5s' },
        ].map((p, idx) => (
          <div
            key={idx}
            className={`absolute rounded-full bg-purple-400/60 shadow-[0_0_10px_rgba(139,92,246,0.8)] ${p.size}`}
            style={{
              top: p.top,
              left: p.left,
              animation: isReducedMotion ? 'none' : `particleFloat ${p.duration} ease-in-out infinite ${p.delay}`
            }}
          />
        ))}
      </div>


      {/* ========================================================= */}
      {/* 3. LEFT TELEMETRY HUD PANELS                              */}
      {/* ========================================================= */}
      <div 
        className="absolute left-2 sm:left-6 lg:left-12 top-12 sm:top-16 z-30 flex flex-col gap-4 sm:gap-5"
        style={{ transform: isReducedMotion ? 'none' : `translate(${mouseOffset.x * -0.4}px, ${mouseOffset.y * -0.4}px)` }}
      >
        {/* Panel 1: URL Analysis */}
        <div className={`backdrop-blur-2xl bg-[#13111C]/90 border border-purple-500/30 px-4 sm:px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.2)] flex items-center gap-3 w-56 sm:w-68 ${isReducedMotion ? '' : 'animate-floatSlow'}`}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
            <Globe className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[11px] sm:text-xs font-mono text-neutral-300 mb-1">
              <span>URL Analysis</span>
              <span className="text-purple-400 font-bold">98%</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-1.5 overflow-hidden border border-purple-500/20">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[98%] rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            </div>
          </div>
        </div>

        {/* Panel 2: Threat Detection */}
        <div className={`backdrop-blur-2xl bg-[#13111C]/90 border border-purple-500/30 px-4 sm:px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.2)] flex items-center gap-3 w-56 sm:w-68 translate-x-[-8px] sm:translate-x-[-18px] ${isReducedMotion ? '' : 'animate-floatFast'}`} style={{ animationDelay: '1s' }}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-pink-500/10 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0 shadow-inner">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[11px] sm:text-xs font-mono text-neutral-300 mb-1">
              <span>Threat Detection</span>
              <span className="text-pink-400 font-bold">Active</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-1.5 overflow-hidden border border-pink-500/20">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full w-[85%] rounded-full animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
            </div>
          </div>
        </div>

        {/* Panel 3: AI Classification */}
        <div className={`backdrop-blur-2xl bg-[#13111C]/90 border border-purple-500/30 px-4 sm:px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.2)] flex items-center gap-3 w-56 sm:w-68 ${isReducedMotion ? '' : 'animate-floatSlow'}`} style={{ animationDelay: '2s' }}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[11px] sm:text-xs font-mono text-neutral-300 mb-1">
              <span>AI Classification</span>
              <span className="text-purple-400 font-bold">Stable</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-1.5 overflow-hidden border border-purple-500/20">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-[100%] rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            </div>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* 4. RIGHT TELEMETRY HUD PANELS                             */}
      {/* ========================================================= */}
      <div 
        className="absolute right-2 sm:right-6 lg:right-12 top-12 sm:top-16 z-30 flex flex-col gap-4 sm:gap-5"
        style={{ transform: isReducedMotion ? 'none' : `translate(${mouseOffset.x * -0.4}px, ${mouseOffset.y * -0.4}px)` }}
      >
        {/* Panel 4: Security Status */}
        <div className={`backdrop-blur-2xl bg-[#13111C]/90 border border-pink-500/30 px-4 sm:px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(236,72,153,0.2)] flex items-center gap-3.5 w-52 sm:w-64 ${isReducedMotion ? '' : 'animate-floatFast'}`} style={{ animationDelay: '0.5s' }}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white tracking-wide">Security Status</p>
            <p className="text-[10px] sm:text-[11px] text-emerald-400 font-mono">Verified Secure</p>
          </div>
        </div>

        {/* Panel 5: Real-Time Defense */}
        <div className={`backdrop-blur-2xl bg-[#13111C]/90 border border-pink-500/30 px-4 sm:px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(236,72,153,0.2)] flex items-center gap-3.5 w-52 sm:w-64 translate-x-[8px] sm:translate-x-[18px] ${isReducedMotion ? '' : 'animate-floatSlow'}`} style={{ animationDelay: '1.5s' }}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white tracking-wide">Real-Time Defense</p>
            <p className="text-[10px] sm:text-[11px] text-purple-400 font-mono">0.42s Latency</p>
          </div>
        </div>

        {/* Panel 6: Threat Intelligence */}
        <div className={`backdrop-blur-2xl bg-[#13111C]/90 border border-pink-500/30 px-4 sm:px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(236,72,153,0.2)] flex items-center gap-3.5 w-52 sm:w-64 ${isReducedMotion ? '' : 'animate-floatFast'}`} style={{ animationDelay: '2.5s' }}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-pink-500/10 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0 shadow-inner">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white tracking-wide">Threat Intelligence</p>
            <p className="text-[10px] sm:text-[11px] text-pink-400 font-mono">142,850+ Indexed</p>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* 5. CENTERPIECE CORE: 3D SHIELD, GLOBE & ORBITAL RINGS     */}
      {/* ========================================================= */}
      <div 
        className="relative z-20 flex flex-col items-center justify-center [transform-style:preserve-3d]"
        style={{
          transform: isReducedMotion 
            ? 'none' 
            : `rotateX(${mouseOffset.y * 0.6}deg) rotateY(${mouseOffset.x * 0.6}deg)`
        }}
      >
        
        {/* Holographic Wireframe Globe Background */}
        <div className={`absolute w-72 h-72 sm:w-[400px] sm:h-[400px] rounded-full border border-purple-500/25 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0,transparent,transparent)] flex items-center justify-center opacity-45 ${isReducedMotion ? '' : 'animate-spinSlow'}`}>
          <div className="w-full h-full rounded-full border border-dashed border-pink-500/30 opacity-70" />
          <div className="absolute inset-6 rounded-full border border-purple-400/20" />
        </div>

        {/* 3 Independent 3D Orbital Rings with Nodes */}
        <div className={`absolute w-[360px] h-[120px] sm:w-[460px] sm:h-[150px] rounded-full border-2 border-purple-500/40 rotate-[-15deg] shadow-[0_0_35px_rgba(139,92,246,0.6)] ${isReducedMotion ? '' : 'animate-orbit1'}`}>
          <div className="absolute top-0 left-1/2 w-2.5 h-2.5 bg-pink-400 rounded-full shadow-[0_0_12px_#EC4899]" />
        </div>
        <div className={`absolute w-[320px] h-[140px] sm:w-[420px] sm:h-[180px] rounded-full border border-pink-500/30 rotate-[25deg] ${isReducedMotion ? '' : 'animate-orbit2'}`}>
          <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#8B5CF6]" />
        </div>

        {/* Pseudo-3D Multi-Layered Shield Emblem */}
        <div className={`relative z-30 flex items-center justify-center ${isReducedMotion ? '' : 'animate-floatCenter'}`}>
          
          {/* Intense Outer Rim Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-500 blur-3xl opacity-75 rounded-full animate-pulse" />

          {/* Outer Bevel Shell */}
          <div className="relative w-36 h-44 sm:w-46 sm:h-54 bg-gradient-to-b from-[#2A2045] via-[#13111C] to-[#0A0A0F] border-[2.5px] border-purple-400/80 rounded-[38px] flex flex-col items-center justify-center shadow-[0_0_75px_rgba(139,92,246,0.65)] [clip-path:polygon(50%_0%,100%_15%,100%_75%,50%_100%,0%_75%,0%_15%)]">
            
            {/* Middle Inset Glass Layer */}
            <div className="absolute inset-1.5 bg-gradient-to-b from-[#1A1528] to-[#0A0A0F] rounded-[34px] flex items-center justify-center [clip-path:polygon(50%_0%,100%_15%,100%_75%,50%_100%,0%_75%,0%_15%)] border border-purple-500/40">
              
              {/* Deep Inner Core Dark Plate */}
              <div className="absolute w-[84%] h-[84%] bg-[#0A0A0F] rounded-[26px] border border-purple-400/30 flex items-center justify-center p-3 [clip-path:polygon(50%_0%,100%_15%,100%_75%,50%_100%,0%_75%,0%_15%)] shadow-inner">
                
                {/* Logo Image Asset */}
                <img 
                  src="/logo.png" 
                  alt="WebShield AI Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.85)] filter brightness-110" 
                />
              </div>
            </div>

            {/* Moving Specular Light Sweep Reflection */}
            <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-60 pointer-events-none ${isReducedMotion ? '' : 'animate-shimmer'}`} />
          </div>

          {/* Periodic AI Security Scan Beam */}
          <div className={`absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-purple-400/40 to-transparent blur-md pointer-events-none ${isReducedMotion ? '' : 'animate-scanBeam'}`} />
        </div>

        {/* ========================================================= */}
        {/* 6. CYBER COMMAND PEDESTAL STAGE                           */}
        {/* ========================================================= */}
        <div className="absolute bottom-[-4.5rem] sm:bottom-[-5.5rem] z-10 flex flex-col items-center">
          <div className="w-72 sm:w-[380px] h-16 sm:h-20 rounded-[100%] bg-gradient-to-r from-purple-600/30 via-pink-600/50 to-purple-600/30 border-2 border-purple-400/60 shadow-[0_0_60px_rgba(139,92,246,0.5)] flex items-center justify-center backdrop-blur-xl">
            <div className="w-52 sm:w-72 h-10 sm:h-12 rounded-[100%] border border-pink-500/50 bg-[#0A0A0F]/90 shadow-inner" />
          </div>
          <div className="w-36 sm:w-52 h-14 bg-gradient-to-t from-transparent via-purple-500/30 to-pink-500/50 blur-2xl -mt-6" />
        </div>

      </div>


      {/* ========================================================= */}
      {/* CSS KEYFRAME ANIMATIONS                                   */}
      {/* ========================================================= */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-floatSlow {
          animation: floatSlow 6s ease-in-out infinite;
        }

        @keyframes floatFast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        .animate-floatFast {
          animation: floatFast 5s ease-in-out infinite;
        }

        @keyframes floatCenter {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          50% { transform: translateY(-8px) rotateX(4deg); }
        }
        .animate-floatCenter {
          animation: floatCenter 4s ease-in-out infinite;
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spinSlow {
          animation: spinSlow 35s linear infinite;
        }

        @keyframes orbit1 {
          0% { transform: rotateX(72deg) rotateZ(0deg); }
          100% { transform: rotateX(72deg) rotateZ(360deg); }
        }
        .animate-orbit1 {
          animation: orbit1 12s linear infinite;
        }

        @keyframes orbit2 {
          0% { transform: rotateX(65deg) rotateZ(360deg); }
          100% { transform: rotateX(65deg) rotateZ(0deg); }
        }
        .animate-orbit2 {
          animation: orbit2 16s linear infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3.5s ease-in-out infinite;
        }

        @keyframes scanBeam {
          0% { transform: translateY(-80px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }
        .animate-scanBeam {
          animation: scanBeam 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-15px) scale(1.2); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}