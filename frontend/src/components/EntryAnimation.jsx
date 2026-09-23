import React from 'react';

export default function EntryAnimation() {
  return (
    <div 
      aria-label="WebShield AI initializing"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0F] text-white select-none"
      style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      
      <div className="flex flex-col items-center space-y-4 px-4 text-center" style={{ animation: 'scaleUp 0.4s ease-out forwards' }}>
        {/* Simple Logo Box */}
        <div className="w-20 h-20 rounded-2xl bg-[#13111C] border border-[#231E33] flex items-center justify-center overflow-hidden shadow-xl shadow-purple-950/40">
          <img 
            src="/logo.png" 
            alt="WebShield AI Logo" 
            className="w-12 h-12 object-contain" 
          />
        </div>
        
        {/* Brand Title */}
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent tracking-wide">
          WebShield AI
        </h1>
        
        {/* Subtitle */}
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
          Initializing Secure Environment...
        </p>
      </div>
    </div>
  );
}