import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Shield, Cpu, Layers, Terminal } from 'lucide-react';

export default function CyberHUD() {
  const { isDark } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [depthMeter, setDepthMeter] = useState(0);
  const [activeSector, setActiveSector] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY || window.pageYOffset || 0;
      const progress = totalHeight > 0 ? Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100)) : 0;

      setScrollProgress(progress);
      setDepthMeter(Math.round(currentScroll * 1.8));

      // Calculate active sector
      if (progress < 25) {
        setActiveSector(0);
      } else if (progress < 55) {
        setActiveSector(1);
      } else if (progress < 85) {
        setActiveSector(2);
      } else {
        setActiveSector(3);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectors = [
    { label: 'SCANNER', sub: 'SEC-01', icon: Shield, targetY: 0 },
    { label: 'ML CORE', sub: 'SEC-02', icon: Cpu, targetY: 480 },
    { label: 'PIPELINE', sub: 'SEC-03', icon: Layers, targetId: 'how-it-works' },
    { label: 'INTEL', sub: 'SEC-04', icon: Terminal, targetY: 99999 }
  ];

  const scrollToSector = (sector) => {
    if (sector.targetId) {
      const el = document.getElementById(sector.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({
      top: sector.targetY,
      behavior: 'smooth'
    });
  };

  return (
    <aside 
      aria-label="3D Cyber Navigation HUD"
      className="fixed right-3.5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end pointer-events-none select-none"
    >
      {/* 3D Glass HUD Container */}
      <div 
        className={`pointer-events-auto p-3.5 rounded-2xl border backdrop-blur-xl transition-all duration-300 shadow-2xl flex flex-col items-center gap-3.5 ${
          isDark
            ? 'bg-[#0E0D16]/80 border-[#2B2340] shadow-purple-950/40 text-neutral-300'
            : 'bg-white/80 border-slate-200 shadow-slate-300/50 text-slate-700'
        }`}
        style={{
          transform: 'perspective(600px) rotateY(-8deg)',
          transformOrigin: 'right center'
        }}
      >
        {/* HUD Top Header: Depth Metric */}
        <div className="flex flex-col items-center border-b border-purple-500/20 pb-2 w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[9px] font-mono tracking-widest text-[#8B5CF6] font-bold">GRID 3D</span>
          </div>
          <div className="text-[11px] font-mono font-extrabold tracking-tight mt-0.5">
            {depthMeter}m
          </div>
        </div>

        {/* Vertical Energy Progress Rail & Interactive Sector Nodes */}
        <div className="relative flex flex-col gap-4 py-1 items-center">
          {/* Background Energy Rail */}
          <div className="absolute top-2 bottom-2 w-[2px] bg-neutral-700/30 rounded-full overflow-hidden">
            <div 
              className="w-full bg-gradient-to-b from-[#8B5CF6] via-[#EC4899] to-cyan-400 transition-all duration-150"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>

          {/* Sector Nodes */}
          {sectors.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeSector === idx;
            return (
              <button
                key={sec.sub}
                onClick={() => scrollToSector(sec)}
                className={`group relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.6)] scale-110 z-10'
                    : isDark
                    ? 'bg-[#181524] text-neutral-400 hover:text-white hover:bg-[#231E33] border border-[#2B2340]'
                    : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
                title={`${sec.sub}: ${sec.label}`}
                aria-label={`Jump to ${sec.label}`}
              >
                <Icon className="w-3.5 h-3.5" />

                {/* 3D Flyout Label on Hover */}
                <div 
                  className={`absolute right-10 px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-xl border ${
                    isDark
                      ? 'bg-[#12101D] border-[#2B2340] text-purple-300'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                  style={{
                    transform: 'translateZ(20px)'
                  }}
                >
                  <span className="font-bold text-[#8B5CF6] mr-1">{sec.sub}</span>
                  {sec.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* HUD Footer: Percentage */}
        <div className="border-t border-purple-500/20 pt-2 text-[10px] font-mono text-center font-bold text-neutral-400 w-full">
          {Math.round(scrollProgress)}%
        </div>
      </div>
    </aside>
  );
}
