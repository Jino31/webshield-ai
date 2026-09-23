import React from 'react';
import { Shield, Globe, Cpu, CheckCircle2, Activity, Lock, Zap } from 'lucide-react';

export default function Hero3DShield() {
  return (
    <div className="relative w-full max-w-5xl mx-auto h-[480px] sm:h-[560px] flex items-center justify-center my-8 [perspective:1200px] select-none pointer-events-none">
      
      {/* Background Ambient Holographic Glow Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-[#8B5CF6]/30 via-[#EC4899]/20 to-transparent rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0,transparent_70%)] pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. LEFT FLOATING TELEMETRY HUD CARDS                      */}
      {/* ========================================================= */}
      <div className="absolute left-2 sm:left-6 lg:left-12 top-12 sm:top-16 z-30 flex flex-col gap-4 animate-floatSlow">
        {/* Card 1: Scanning URL */}
        <div className="backdrop-blur-xl bg-[#13111C]/80 border border-purple-500/30 px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.2)] flex items-center gap-3 w-56 sm:w-64">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-1">
              <span>Scanning URL...</span>
              <span className="text-purple-400">98%</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-1.5 overflow-hidden border border-purple-500/20">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[98%] rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Card 2: Analyzing Threats */}
        <div className="backdrop-blur-xl bg-[#13111C]/80 border border-purple-500/30 px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.2)] flex items-center gap-3 w-56 sm:w-64 translate-x-[-10px] sm:translate-x-[-20px]">
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-1">
              <span>Analyzing Threats...</span>
              <span className="text-pink-400">Active</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-1.5 overflow-hidden border border-pink-500/20">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full w-[85%] rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Card 3: AI Detection */}
        <div className="backdrop-blur-xl bg-[#13111C]/80 border border-purple-500/30 px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(139,92,246,0.2)] flex items-center gap-3 w-56 sm:w-64">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-1">
              <span>AI Detection...</span>
              <span className="text-purple-400">Stable</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-1.5 overflow-hidden border border-purple-500/20">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full w-[100%] rounded-full" />
            </div>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* 2. RIGHT FLOATING TELEMETRY HUD CARDS                     */}
      {/* ========================================================= */}
      <div className="absolute right-2 sm:right-6 lg:right-12 top-12 sm:top-16 z-30 flex flex-col gap-4 animate-floatFast">
        {/* Card 4: Safe Browsing */}
        <div className="backdrop-blur-xl bg-[#13111C]/80 border border-pink-500/30 px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(236,72,153,0.2)] flex items-center gap-3 w-52 sm:w-60">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Safe Browsing</p>
            <p className="text-[10px] text-emerald-400 font-mono">Status: Verified Secure</p>
          </div>
        </div>

        {/* Card 5: Real-Time Protection */}
        <div className="backdrop-blur-xl bg-[#13111C]/80 border border-pink-500/30 px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(236,72,153,0.2)] flex items-center gap-3 w-52 sm:w-60 translate-x-[10px] sm:translate-x-[20px]">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Real-Time Defense</p>
            <p className="text-[10px] text-purple-400 font-mono">0.42s Latency</p>
          </div>
        </div>

        {/* Card 6: A Safer Internet */}
        <div className="backdrop-blur-xl bg-[#13111C]/80 border border-pink-500/30 px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(236,72,153,0.2)] flex items-center gap-3 w-52 sm:w-60">
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Global Grid</p>
            <p className="text-[10px] text-pink-400 font-mono">142,850+ Indexed</p>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* 3. CENTERPIECE: 3D SHIELD, HOLOGRAPHIC ORBITS & GLOBE      */}
      {/* ========================================================= */}
      <div className="relative z-20 flex flex-col items-center justify-center [transform-style:preserve-3d]">
        
        {/* Holographic Wireframe Globe in Background */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-purple-500/20 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0,transparent_70%)] animate-spinSlow flex items-center justify-center opacity-40">
          <div className="w-full h-full rounded-full border border-dashed border-pink-500/30 animate-pulse" />
        </div>

        {/* Orbiting Ring Beam */}
        <div className="absolute w-[340px] h-[120px] sm:w-[420px] sm:h-[150px] rounded-full border-2 border-purple-500/40 rotate-[-15deg] shadow-[0_0_30px_rgba(139,92,246,0.5)] animate-orbit" />

        {/* Central 3D Metallic Shield Emblem */}
        <div className="relative z-30 flex items-center justify-center animate-floatCenter">
          {/* Outer Neon Aura */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-3xl opacity-70 rounded-full animate-pulse" />

          {/* Shield Container */}
          <div className="relative w-36 h-44 sm:w-44 sm:h-52 bg-gradient-to-b from-[#1A1528] via-[#13111C] to-[#0A0A0F] border-2 border-purple-400/60 rounded-[36px] flex flex-col items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.6)] [clip-path:polygon(50%_0%,100%_15%,100%_75%,50%_100%,0%_75%,0%_15%)]">
            
            {/* Inner Shield Bevel */}
            <div className="absolute inset-1.5 bg-gradient-to-b from-[#13111C] to-[#0A0A0F] rounded-[32px] flex items-center justify-center [clip-path:polygon(50%_0%,100%_15%,100%_75%,50%_100%,0%_75%,0%_15%)] border border-purple-500/30">
              
              {/* WS Logo Typography */}
              <div className="flex items-center font-black text-4xl sm:text-5xl tracking-tighter drop-shadow-[0_0_20px_rgba(139,92,246,0.9)]">
                <span className="text-white">W</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">S</span>
              </div>
            </div>

            {/* Specular Light Reflection Sweep Line */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50 pointer-events-none animate-shimmer" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. CYBER COMMAND PEDESTRIAL STAGE AT THE BOTTOM           */}
        {/* ========================================================= */}
        <div className="absolute -bottom-16 sm:-bottom-20 z-10 flex flex-col items-center">
          {/* Glowing Platform Rings */}
          <div className="w-72 sm:w-96 h-16 sm:h-20 rounded-[100%] bg-gradient-to-r from-purple-600/30 via-pink-600/40 to-purple-600/30 border border-purple-400/50 shadow-[0_0_50px_rgba(139,92,246,0.4)] flex items-center justify-center backdrop-blur-md">
            <div className="w-56 sm:w-72 h-10 sm:h-12 rounded-[100%] border border-pink-500/40 bg-[#0A0A0F]/80" />
          </div>

          {/* Holographic Floor Projection Beam */}
          <div className="w-32 sm:w-48 h-12 bg-gradient-to-t from-transparent via-purple-500/20 to-pink-500/40 blur-xl -mt-6" />
        </div>

      </div>

      {/* CSS Keyframe Animations for Float, Orbit & Shimmer */}
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
          animation: spinSlow 30s linear infinite;
        }

        @keyframes orbit {
          0% { transform: rotateX(70deg) rotateZ(0deg); }
          100% { transform: rotateX(70deg) rotateZ(360deg); }
        }
        .animate-orbit {
          animation: orbit 10s linear infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}