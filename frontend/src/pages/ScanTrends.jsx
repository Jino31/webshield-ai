import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ShieldCheck, AlertTriangle, Globe, Activity, BarChart3, ShieldAlert } from 'lucide-react';

export default function ScanTrends() {
  const navigate = useNavigate();

  const trendingThreats = [
    { title: 'Fake Banking Portals', percentage: '38%', risk: 'Critical', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { title: 'Credential Harvesting Grids', percentage: '27%', risk: 'High', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { title: 'Imitation E-Commerce Stores', percentage: '19%', risk: 'Medium', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { title: 'Crypto Drainer Links', percentage: '16%', risk: 'Critical', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center px-4 sm:px-8 lg:px-16 py-10 bg-[#05070A] text-[#FAFAFA]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#22D3EE]/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Header Row */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-[#22D3EE] bg-[#0D1117] border border-neutral-800/80 px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#22D3EE]" /> Back
        </button>
        <div className="flex items-center gap-2 text-neutral-400 text-xs font-medium">
          <TrendingUp className="w-4 h-4 text-[#22D3EE]" /> Global Threat Intelligence
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl space-y-6">
        
        {/* Top Banner */}
        <div className="w-full bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-xs font-medium">
              <Activity className="w-3.5 h-3.5" /> Real-Time Telemetry
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Scan Trends & Threat Analytics</h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              Aggregated insights into current phishing campaigns, lexical anomalies, and machine learning model detection frequencies.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#05070A] border border-neutral-800 text-center min-w-[160px]">
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Total Analyzed URLs</p>
            <p className="text-xl font-bold text-[#22D3EE] mt-1">142,850+</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Safe Links Verified</p>
              <p className="text-lg font-bold text-white mt-0.5">88.4%</p>
            </div>
          </div>

          <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Threats Blocked</p>
              <p className="text-lg font-bold text-white mt-0.5">11.6%</p>
            </div>
          </div>

          <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#22D3EE]/10 text-[#22D3EE]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Avg Scan Speed</p>
              <p className="text-lg font-bold text-white mt-0.5">&lt; 0.4s</p>
            </div>
          </div>
        </div>

        {/* Trending Threat Breakdown */}
        <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <h2 className="text-sm font-semibold text-[#22D3EE] uppercase tracking-wider">
            Most Active Phishing Vectors This Week
          </h2>

          <div className="space-y-4">
            {trendingThreats.map((threat, index) => (
              <div key={index} className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#13111C] border border-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                    0{index + 1}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">{threat.title}</h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Detected via lexical URL patterns & AI heuristics</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${threat.color}`}>
                    {threat.risk} Risk
                  </span>
                  <span className="text-xs font-bold text-white font-mono">{threat.percentage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}