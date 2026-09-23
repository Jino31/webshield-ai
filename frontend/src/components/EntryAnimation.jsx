import React from 'react';

export default function EntryAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0F] backdrop-blur-2xl animate-fadeIn transition-opacity duration-700">
      <div className="flex flex-col items-center space-y-6 animate-pulse">
        {/* Logo Container */}
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl shadow-purple-950/60 bg-[#13111C] border border-[#231E33]">
          <img 
            src="/logo.png" 
            alt="WebShield AI Logo" 
            className="w-full h-full object-cover scale-150" 
          />
        </div>

        {/* Welcome Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            Welcome to WebShield AI
          </h2>
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
            INITIALIZING SECURE ENVIRONMENT...
          </p>
        </div>
      </div>
    </div>
  );
}