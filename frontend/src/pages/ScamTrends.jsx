import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Globe, 
  Activity, 
  BarChart3, 
  ShieldAlert, 
  Download, 
  Filter, 
  Search,
  ExternalLink,
  Lock
} from 'lucide-react';

export default function ScamTrends() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const trendingThreats = [
    { 
      id: 'TR-01', 
      title: 'Fake Banking Portals & Auth Phishing', 
      category: 'Banking',
      percentage: '38%', 
      risk: 'Critical', 
      targetCount: '54,200+',
      trend: '+14.2%',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' 
    },
    { 
      id: 'TR-02', 
      title: 'Credential Harvesting Grids (OAuth Abuse)', 
      category: 'Identity',
      percentage: '27%', 
      risk: 'High', 
      targetCount: '38,900+',
      trend: '+8.5%',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' 
    },
    { 
      id: 'TR-03', 
      title: 'Imitation E-Commerce & Fake Checkout Gateways', 
      category: 'E-Commerce',
      percentage: '19%', 
      risk: 'Medium', 
      targetCount: '27,100+',
      trend: '-2.1%',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' 
    },
    { 
      id: 'TR-04', 
      title: 'Web3 & Crypto Drainer Smart Contracts', 
      category: 'Crypto',
      percentage: '16%', 
      risk: 'Critical', 
      targetCount: '22,650+',
      trend: '+22.4%',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' 
    },
  ];

  const filteredThreats = trendingThreats.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && t.risk.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleExportReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trendingThreats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `webshield_threat_trends_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center px-4 sm:px-8 lg:px-12 py-10 bg-[#0B0F17] text-[#F3F4F6] font-sans">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Navigation Header */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-white bg-[#111827] border border-neutral-800 px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" /> Return Back
        </button>
        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono uppercase tracking-widest bg-[#111827] px-3.5 py-1.5 rounded-lg border border-neutral-800">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Live Telemetry Feed
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl space-y-6">
        
        {/* Top Enterprise Banner */}
        <div className="w-full bg-[#111827] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono uppercase">
              <TrendingUp className="w-3.5 h-3.5" /> Threat Intelligence Core
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Global Scam & Phishing Trends</h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Continuous threat analysis derived from lexical URL heuristics, AI confidence scoring models, and verified community incident feeds.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            <div className="p-4 rounded-xl bg-[#0B0F17] border border-neutral-800 text-center min-w-[140px]">
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Indexed Scans</p>
              <p className="text-xl font-bold text-purple-400 mt-1">142,850+</p>
            </div>
            <button 
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-950/50 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* Enterprise Telemetry Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111827] border border-neutral-800 rounded-2xl p-5 flex items-center gap-4 shadow-md">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Safe Link Accuracy</p>
              <p className="text-xl font-bold text-white mt-0.5">88.4%</p>
            </div>
          </div>

          <div className="bg-[#111827] border border-neutral-800 rounded-2xl p-5 flex items-center gap-4 shadow-md">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Active Threats Blocked</p>
              <p className="text-xl font-bold text-white mt-0.5">11.6%</p>
            </div>
          </div>

          <div className="bg-[#111827] border border-neutral-800 rounded-2xl p-5 flex items-center gap-4 shadow-md">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Average Inference Latency</p>
              <p className="text-xl font-bold text-white mt-0.5">&lt; 0.42s</p>
            </div>
          </div>
        </div>

        {/* Threat Vector Breakdown Panel */}
        <div className="bg-[#111827] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Top Phishing Vectors & Attack Surfaces
              </h2>
              <p className="text-xs text-neutral-400">Categorized by frequency and malicious severity rating.</p>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter vectors..."
                  className="w-40 sm:w-48 h-9 pl-8 pr-3 bg-[#0B0F17] border border-neutral-800 rounded-lg text-xs text-white outline-none focus:border-purple-500 transition"
                />
              </div>
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="h-9 px-3 bg-[#0B0F17] border border-neutral-800 rounded-lg text-xs text-neutral-300 outline-none focus:border-purple-500 transition cursor-pointer"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredThreats.length > 0 ? filteredThreats.map((threat, index) => (
              <div key={threat.id} className="p-4 sm:p-5 bg-[#0B0F17] border border-neutral-800/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-700 transition">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#111827] border border-neutral-800 flex items-center justify-center text-xs font-mono font-bold text-neutral-400 shrink-0">
                    {threat.id}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-white">{threat.title}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-400">{threat.category}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">Observed Volume: <span className="text-white font-mono">{threat.targetCount} attacks</span> • Weekly Trend: <span className="text-emerald-400 font-mono">{threat.trend}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-800">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md border ${threat.color}`}>
                    {threat.risk} Severity
                  </span>
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-extrabold text-white font-mono">{threat.percentage}</span>
                    <p className="text-[10px] text-neutral-500 uppercase font-mono">Share</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-neutral-500 text-xs font-mono">No threat vectors match current query parameters.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}