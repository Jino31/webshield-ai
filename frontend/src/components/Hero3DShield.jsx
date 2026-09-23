import React from 'react';
import { Globe, Cpu, CheckCircle2, Activity, Lock, Zap } from 'lucide-react';

export default function Hero3DShield() {
  return (
    <div className="relative w-full max-w-6xl mx-auto h-[500px] sm:h-[600px] flex items-center justify-center my-6 [perspective:1400px] select-none pointer-events-none">
      
      {/* Deep Cyberpunk Atmospheric Glows */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-[#8B5CF6]/25 via-[#EC4899]/15 to-transparent rounded-full blur-[160px] animate-pulse pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0,transparent_75%)] pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. LEFT TELEMETRY HUD CARDS                               */}
      {/* ========================================================= */}
      <div className="absolute left-2 sm:left-8 lg:left-14 top-16 sm:top-20 z-30 flex flex-col gap-5 animate-floatSlow">
        {/* Card 1 */}
        <div className="backdrop-blur-2xl bg-[#13111C]/90 border border-purple-500/30 px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.25)] flex items-center gap-3.5 w-60 sm:w-68">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
            <Globe className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
              <span>Scanning URL...</span>
              <span className="text-purple-400 font-bold">98%</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-1.5 overflow-hidden border border-purple-500/20">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[98%] rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="backdrop-blur-2xl bg-[#13111C]/90 border border-purple-500/30 px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.25)] flex items-center gap-3.5 w-60 sm:w-68 translate-x-[-12px] sm:translate-x-[-24px]">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0 shadow-inner">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
              <span>Analyzing Threats...</span>
              <span className="text-pink-400 font-bold">Active</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-1.5 overflow-hidden border border-pink-500/20">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full w-[85%] rounded-full animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="backdrop-blur-2xl bg-[#13111C]/90 border border-purple-500/30 px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.25)] flex items-center gap-3.5 w-60 sm:w-68">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs font-mono text-neutral-300 mb-1">
              <span>AI Detection...</span>
              <span className="text-purple-400 font-bold">Stable</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-1.5 overflow-hidden border border-purple-500/20">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-[100%] rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            </div>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* 2. RIGHT TELEMETRY HUD CARDS                              */}
      {/* ========================================================= */}
      <div className="absolute right-2 sm:right-8 lg:right-14 top-16 sm:top-20 z-30 flex flex-col gap-5 animate-floatFast">
        {/* Card 4 */}
        <div className="backdrop-blur-2xl bg-[#13111C]/90 border border-pink-500/30 px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.25)] flex items-center gap-3.5 w-56 sm:w-64">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white tracking-wide">Safe Browsing</p>
            <p className="text-[11px] text-emerald-400 font-mono">Status: Verified Secure</p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="backdrop-blur-2xl bg-[#13111C]/90 border border-pink-500/30 px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.25)] flex items-center gap-3.5 w-56 sm:w-64 translate-x-[12px] sm:translate-x-[24px]">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white tracking-wide">Real-Time Defense</p>
            <p className="text-[11px] text-purple-400 font-mono">0.42s Latency</p>
          </div>
        </div>

        {/* Card 6 */}
        <div className="backdrop-blur-2xl bg-[#13111C]/90 border border-pink-500/30 px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(236,72,153,0.25)] flex items-center gap-3.5 w-56 sm:w-64">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0 shadow-inner">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white tracking-wide">Global Grid</p>
            <p className="text-[11px] text-pink-400 font-mono">142,850+ Indexed</p>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* 3. CENTERPIECE: 3D HOLOGRAPHIC SHIELD & ORBITAL RINGS     */}
      {/* ========================================================= */}
      <div className="relative z-20 flex flex-col items-center justify-center [transform-style:preserve-3d]">
        
        {/* Holographic Wireframe Globe Background */}
        <div className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full border border-purple-500/25 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0,transparent_75%)] animate-spinSlow flex items-center justify-center opacity-50">
          <div className="w-full h-full rounded-full border border-dashed border-pink-500/30 animate-pulse" />
        </div>

        {/* Orbital Neon Energy Beam Ring */}
        <div className="absolute w-[380px] h-[130px] sm:w-[480px] sm:h-[160px] rounded-full border-2 border-purple-500/50 rotate-[-18deg] shadow-[0_0_40px_rgba(139,92,246,0.7)] animate-orbit" />

        {/* Upgraded 3D Multi-Layered Shield Emblem */}
        <div className="relative z-30 flex items-center justify-center animate-floatCenter">
          {/* Intense Outer Neon Rim Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-500 blur-3xl opacity-80 rounded-full animate-pulse" />

          {/* Outer Shield Bevel Shell */}
          <div className="relative w-40 h-48 sm:w-48 sm:h-56 bg-gradient-to-b from-[#2A2045] via-[#13111C] to-[#0A0A0F] border-[2.5px] border-purple-400/80 rounded-[40px] flex flex-col items-center justify-center shadow-[0_0_80px_rgba(139,92,246,0.7)] [clip-path:polygon(50%_0%,100%_15%,100%_75%,50%_100%,0%_75%,0%_15%)]">
            
            {/* Middle Inset Glass Layer */}
            <div className="absolute inset-1.5 bg-gradient-to-b from-[#1A1528] to-[#0A0A0F] rounded-[36px] flex items-center justify-center [clip-path:polygon(50%_0%,100%_15%,100%_75%,50%_100%,0%_75%,0%_15%)] border border-purple-500/40">
              
              {/* Deep Inner Core Dark Plate */}
              <div className="absolute w-[82%] h-[82%] bg-[#0A0A0F] rounded-[28px] border border-purple-400/30 flex items-center justify-center [clip-path:polygon(50%_0%,100%_15%,100%_75%,50%_100%,0%_75%,0%_15%)] shadow-inner">
                
                {/* WS Typography with Precision Gradient */}
                <div className="flex items-center font-black text-5xl sm:text-6xl tracking-tighter drop-shadow-[0_0_25px_rgba(139,92,246,0.95)]">
                  <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]">W</span>
                  <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-pink-500 bg-clip-text text-transparent ml-0.5">S</span>
                </div>
              </div>
            </div>

            {/* Specular Light Reflection Sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-60 pointer-events-none animate-shimmer" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. CYBER COMMAND PEDESTAL STAGE                           */}
        {/* ========================================================= */}
        <div className="absolute -bottom-18 sm:-bottom-24 z-10 flex flex-col items-center">
          {/* Grounding Holographic Rings */}
          <div className="w-80 sm:w-[420px] h-20 sm:h-24 rounded-[100%] bg-gradient-to-r from-purple-600/30 via-pink-600/50 to-purple-600/30 border-2 border-purple-400/60 shadow-[0_0_70px_rgba(139,92,246,0.55)] flex items-center justify-center backdrop-blur-xl">
            <div className="w-60 sm:w-80 h-12 sm:h-14 rounded-[100%] border border-pink-500/50 bg-[#0A0A0F]/90 shadow-inner" />
          </div>

          {/* Upward Volumetric Floor Beam */}
          <div className="w-40 sm:w-56 h-16 bg-gradient-to-t from-transparent via-purple-500/30 to-pink-500/50 blur-2xl -mt-8" />
        </div>

      </div>

      {/* Advanced Animation Keyframes */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-floatSlow {
          animation: floatSlow 6s ease-in-out infinite;
        }

        @keyframes floatFast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        .animate-floatFast {
          animation: floatFast 5s ease-in-out infinite;
        }

        @keyframes floatCenter {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          50% { transform: translateY(-10px) rotateX(5deg); }
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

        @keyframes orbit {
          0% { transform: rotateX(72deg) rotateZ(0deg); }
          100% { transform: rotateX(72deg) rotateZ(360deg); }
        }
        .animate-orbit {
          animation: orbit 12s linear infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}