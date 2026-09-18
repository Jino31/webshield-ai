import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Globe, 
  ShieldAlert, 
  BarChart3, 
  Activity, 
  Settings, 
  Bell, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileDropdown, setProfileDropdown] = useState(false);

  // Mock telemetry data
  const recentScans = [
    { url: 'https://example.com', result: 'Safe', risk: 'Low', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { url: 'http://192.168.1.50/login-verify', result: 'Phishing', risk: 'Critical', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { url: 'https://secure-login-apple-support.xyz', result: 'Phishing', risk: 'High', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { url: 'https://github.com', result: 'Safe', risk: 'Low', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-[#05070A] text-[#FAFAFA] flex flex-col">
      
      {/* Admin Top Header Bar */}
      <header className="w-full h-16 bg-[#0D1117]/90 backdrop-blur-md border-b border-neutral-800/80 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">WebShield AI Admin</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="p-2 rounded-xl bg-[#13111C] border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition relative cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#22D3EE] rounded-full"></span>
          </button>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 px-3.5 py-2 rounded-xl text-xs font-medium text-white transition cursor-pointer"
            >
              <span>Admin</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {profileDropdown && (
              <div className="absolute right-0 top-12 w-48 bg-[#0D1117] border border-neutral-800 rounded-xl shadow-2xl p-2 z-50">
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 transition text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#0D1117]/60 border-r border-neutral-800/80 p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'scans', label: 'URL Scans', icon: Globe },
            { id: 'threats', label: 'Threats', icon: ShieldAlert },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'logs', label: 'Activity Logs', icon: Activity },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE]' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
          
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Security Overview</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Real-time system telemetry and platform metrics.</p>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Total Users</span>
              <p className="text-2xl font-bold text-white">1,284</p>
              <span className="text-[10px] text-emerald-400 mt-2 inline-block">+12% this week</span>
            </div>

            <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Total Scans</span>
              <p className="text-2xl font-bold text-[#22D3EE]">8,462</p>
              <span className="text-[10px] text-emerald-400 mt-2 inline-block">+24% today</span>
            </div>

            <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Safe Links</span>
              <p className="text-2xl font-bold text-emerald-400">7,312</p>
              <span className="text-[10px] text-neutral-500 mt-2 inline-block">86.4% accuracy</span>
            </div>

            <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Risk / Phishing</span>
              <p className="text-2xl font-bold text-rose-400">1,150</p>
              <span className="text-[10px] text-rose-400 mt-2 inline-block">Action required</span>
            </div>
          </div>

          {/* Detection Activity Graph Placeholder */}
          <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider">Detection Activity & Threat Trends</h3>
              <span className="text-xs text-neutral-400 font-mono">Last 7 Days</span>
            </div>
            <div className="w-full h-48 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-center text-neutral-500 text-xs font-mono">
              [ Interactive Scan & Threat Telemetry Graph ]
            </div>
          </div>

          {/* Recent Scans Table */}
          <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider">Recent Scans</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500">
                    <th className="pb-3 font-semibold uppercase tracking-wider">URL</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider">Result</th>
                    <th className="pb-3 font-semibold uppercase tracking-wider">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {recentScans.map((scan, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/30 transition">
                      <td className="py-3 text-neutral-300 truncate max-w-xs">{scan.url}</td>
                      <td className="py-3 font-sans font-medium text-white">{scan.result}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-medium border ${scan.color}`}>
                          {scan.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}