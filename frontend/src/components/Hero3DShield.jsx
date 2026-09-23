import React from 'react';
import { Globe, Cpu, CheckCircle2, Activity, Lock, Zap } from 'lucide-react';

export default function Hero3DShield() {
  return (
    <div className="relative w-full max-w-5xl mx-auto h-[380px] sm:h-[440px] flex items-center justify-center my-4 select-none pointer-events-none">
      
      {/* Subtle Ambient Glow */}
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-[#8B5CF6]/15 via-[#EC4899]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. COMPACT LEFT TELEMETRY CARDS                           */}
      {/* ========================================================= */}
      <div className="absolute left-2 sm:left-6 top-8 sm:top-12 z-20 flex flex-col gap-3">
        {/* Card 1 */}
        <div className="backdrop-blur-xl bg-[#13111C]/90 border border-purple-500/30 px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 w-48 sm:w-56">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-0.5">
              <span>URL Analysis</span>
              <span className="text-purple-400 font-bold">98%</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-1 overflow-hidden border border-purple-500/20">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[98%] rounded-full" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="backdrop-blur-xl bg-[#13111C]/90 border border-purple-500/30 px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 w-48 sm:w-56 translate-x-[-8px]">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-0.5">
              <span>Threat Detection</span>
              <span className="text-pink-400 font-bold">Active</span>
            </div>
            <div className="w-full bg-[#0A0A0F] rounded-full h-1 overflow-hidden border border-pink-500/20">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full w-[85%] rounded-full" />
            </div>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* 2. COMPACT RIGHT TELEMETRY CARDS                          */}
      {/* ========================================================= */}
      <div className="absolute right-2 sm:right-6 top-8 sm:top-12 z-20 flex flex-col gap-3">
        {/* Card 3 */}
        <div className="backdrop-blur-xl bg-[#13111C]/90 border border-pink-500/30 px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 w-48 sm:w-56">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white">Security Status</p>
            <p className="text-[10px] text-emerald-400 font-mono">Verified Secure</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="backdrop-blur-xl bg-[#13111C]/90 border border-pink-500/30 px-3.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 w-48 sm:w-56 translate-x-[8px]">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white">Real-Time Defense</p>
            <p className="text-[10px] text-purple-400 font-mono">0.42s Latency</p>
          </div>
        </div>
      </div>


      {/* ========================================================= */}
      {/* 3. CENTERPIECE: LIGHTWEIGHT SHIELD BADGE & PULSE          */}
      {/* ========================================================= */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Outer Pulsing Glow Ring */}
        <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-purple-600/30 to-pink-600/30 blur-xl animate-pulse" />

        {/* Main Logo Shield Container */}
        <div className="relative w-28 h-34 sm:w-32 sm:h-38 bg-gradient-to-b from-[#1A1528] to-[#0A0A0F] border border-purple-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)] p-3">
          <img 
            src="/logo.png" 
            alt="WebShield AI Logo" 
            className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]" 
          />
        </div>

        {/* Minimalist Pedestal Base */}
        <div className="w-48 sm:w-64 h-8 rounded-[100%] bg-gradient-to-r from-transparent via-purple-600/20 to-transparent blur-md mt-4" />
      </div>

    </div>
  );
}