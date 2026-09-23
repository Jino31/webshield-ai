import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { adminService } from '../services/adminService';
import { useTheme } from '../context/ThemeContext';

import {
  LayoutDashboard,
  Users,
  BadgePercent,
  Megaphone,
  Server,
  MessageSquareText,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
  Lock,
  LogOut,
  Send,
  Search,
  Filter,
  Activity,
  Terminal,
  ShieldAlert,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  Database
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Key-gated unlock state
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);

  // UI States (6 Tabs & Enterprise Controls)
  const [activeTab, setActiveTab] = useState('dashboard');
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSyncedTime, setLastSyncedTime] = useState(null);

  // Telemetry Data
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [health, setHealth] = useState([]);
  const [commentsList, setCommentsList] = useState([]);

  // Forms
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [publishingAnn, setPublishingAnn] = useState(false);

  const [adLabel, setAdLabel] = useState('');
  const [adUrl, setAdUrl] = useState('');
  const [adEnabled, setAdEnabled] = useState(true);
  const [savingAd, setSavingAd] = useState(false);

  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUser(null);
        setAuthLoading(false);
        navigate('/login', { replace: true });
        return;
      }
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Unlock handler with Enterprise Welcome Telemetry
  const handleUnlock = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!password.trim()) {
      setPasswordError('Administrative access key is required.');
      return;
    }

    setUnlocking(true);
    try {
      await adminService.unlockAdmin(password);
      setPassword('');
      
      setUnlocking(false);
      setShowWelcomeAnimation(true);
      setTimeout(() => {
        setShowWelcomeAnimation(false);
        setAdminUnlocked(true);
      }, 2500);

    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Invalid cryptographic key.');
      setPassword('');
      setUnlocking(false);
    }
  };

  // Optimized Non-Blocking Real-Time Telemetry Fetcher
  const fetchRealtimeData = useCallback(async () => {
    if (!adminUnlocked) return;
    
    if (!stats) {
      setLoadingData(true);
    }
    setErrorData(null);

    try {
      const sData = await adminService.getAdminStats().catch(() => null);
      setStats(sData);
      setLoadingData(false);
      setLastSyncedTime(new Date().toLocaleTimeString());

      adminService.getUsers().then(u => setUsersList(u || [])).catch(() => {});
      adminService.getSystemHealth().then(h => setHealth(h || [])).catch(() => {});
      adminService.getComments().then(c => setCommentsList(c || [])).catch(() => {});
      adminService.getAdConfig().then(adData => {
        if (adData) {
          setAdLabel(adData.label || '');
          setAdUrl(adData.url || '');
          setAdEnabled(adData.enabled ?? true);
        }
      }).catch(() => {});

    } catch (err) {
      setErrorData('Telemetry stream disconnected from cluster nodes.');
      setLoadingData(false);
    }
  }, [adminUnlocked, stats]);

  // Real-time auto-refresh polling every 10 seconds
  useEffect(() => {
    if (adminUnlocked) {
      fetchRealtimeData();
      const interval = setInterval(() => {
        fetchRealtimeData();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [adminUnlocked, fetchRealtimeData]);

  // Filtered dataset for enterprise data grids
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return usersList;
    return usersList.filter(u => 
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [usersList, searchQuery]);

  const filteredComments = useMemo(() => {
    if (!searchQuery) return commentsList;
    return commentsList.filter(c => 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [commentsList, searchQuery]);

  const themeClasses = {
    dark: 'bg-[#0B0F17] text-[#F3F4F6] font-sans',
    light: 'bg-[#F8FAFC] text-slate-900 font-sans',
    unique: 'bg-[#080212] text-white selection:bg-purple-500 selection:text-white font-sans'
  };

  const cardTheme = {
    dark: 'bg-[#111827] border-neutral-800/80 text-white shadow-xl',
    light: 'bg-white border-slate-200 text-slate-900 shadow-sm',
    unique: 'bg-gradient-to-br from-[#160430] to-[#0A0118] border-purple-500/30 text-purple-100 shadow-2xl shadow-purple-950/40 backdrop-blur-xl'
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#0B0F17] flex items-center justify-center text-white text-xs z-50 font-mono">
        <RefreshCw className="w-4 h-4 animate-spin text-purple-400 mr-2.5" /> Authenticating security clearance...
      </div>
    );
  }

  // Enterprise Welcome Animation
  if (showWelcomeAnimation) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#06080D] text-white flex flex-col items-center justify-center z-50 overflow-hidden font-mono">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/10 via-purple-600/15 to-transparent rounded-full blur-[140px] animate-pulse pointer-events-none" />
        <div className="relative z-15 flex flex-col items-center p-10 rounded-2xl bg-[#0F172A]/80 border border-white/10 shadow-2xl">
          <div className="w-16 h-16 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 shadow-inner">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-wider uppercase text-white mb-1">
            WebShield Cloud Console
          </h1>
          <p className="text-[11px] text-neutral-400 tracking-[0.2em] uppercase">Establishing Secure Cluster Tunnel...</p>
          <div className="w-40 h-1 bg-neutral-800 rounded-full overflow-hidden mt-6">
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[shimmer_1s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  // Key-Gated Unlock Screen
  if (!adminUnlocked) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#0B0F17] text-white flex items-center justify-center p-4 relative z-50 font-sans">
        <div className="absolute top-6 left-6 z-20">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111827] border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition cursor-pointer shadow-md">
            <ArrowLeft className="w-3.5 h-3.5" /> Exit Portal
          </button>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#111827]/95 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">ISO-27001 SECURE</span>
            </div>

            <div className="mb-6">
              <h1 className="text-lg font-bold tracking-tight text-white">Administrator Access</h1>
              <p className="text-xs text-neutral-400 mt-1">Provide administrative security credentials to authenticate.</p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Secret Key</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                    placeholder="Enter security key"
                    className="w-full h-11 pl-10 pr-10 rounded-lg bg-[#0B0F17] border border-neutral-800 text-xs text-white placeholder:text-neutral-600 outline-none focus:border-purple-500 transition font-mono"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {passwordError}
                </div>
              )}

              <button type="submit" disabled={unlocking} className="w-full h-11 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-950/50 disabled:opacity-50">
                {unlocking ? <><RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...</> : <><Lock className="w-4 h-4" /> Authenticate Session</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 ${themeClasses[theme]}`}>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E293B] border border-neutral-700 text-white px-4 py-3 rounded-xl shadow-2xl text-xs flex items-center gap-3 animate-fadeIn font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* Enterprise Top Navigation Bar */}
      <header className={`w-full h-14 border-b px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 backdrop-blur-md ${theme === 'light' ? 'bg-white/90 border-slate-200 text-slate-900 shadow-xs' : theme === 'unique' ? 'bg-[#0D021C]/90 border-purple-500/30' : 'bg-[#0B0F17]/95 border-neutral-800'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${theme === 'light' ? 'border-slate-200 bg-slate-100 hover:bg-slate-200' : 'border-neutral-800 bg-[#111827] hover:bg-neutral-800 text-neutral-200'}`}>
            <ArrowLeft className="w-3.5 h-3.5" /> Portal Home
          </button>
          <div className="h-4 w-[1px] bg-neutral-700/50 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">WebShield Core OS // Region: Global-US-East</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {lastSyncedTime && (
            <span className="hidden md:inline-block text-[11px] font-mono text-neutral-400">
              Synced: {lastSyncedTime}
            </span>
          )}
          <button onClick={fetchRealtimeData} className="p-2 rounded-lg bg-[#111827] border border-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer" title="Refresh Telemetry">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => signOut(auth).then(() => navigate('/'))} className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer">
            <LogOut className="w-3.5 h-3.5" /> Terminate Session
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Enterprise Sidebar Console */}
        <aside className={`w-64 border-r p-4 flex flex-col gap-1 shrink-0 ${theme === 'light' ? 'bg-slate-100 border-slate-200' : theme === 'unique' ? 'bg-[#0B0116] border-purple-500/20' : 'bg-[#090D14] border-neutral-800'}`}>
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">Navigation Controls</div>
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'ad', label: 'Ad Configuration', icon: BadgePercent },
            { id: 'announcement', label: 'Announcements', icon: Megaphone },
            { id: 'monitor', label: 'System Health', icon: Server },
            { id: 'comments', label: 'Feedback Receiver', icon: MessageSquareText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition text-left cursor-pointer ${
                  isActive 
                    ? theme === 'unique' 
                      ? 'bg-purple-600/30 border border-purple-500 text-white font-semibold shadow-md' 
                      : theme === 'light'
                      ? 'bg-purple-600 text-white font-semibold shadow-xs'
                      : 'bg-neutral-800 border border-neutral-700 text-white font-semibold' 
                    : theme === 'light' 
                    ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content View Container */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl">
          {loadingData && !stats ? (
            <div className="flex items-center justify-center h-64 text-xs font-mono text-neutral-400">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-400 mr-2" /> Initializing metrics stream...
            </div>
          ) : errorData ? (
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs text-center font-mono">
              {errorData}
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight">System Telemetry & Analytics</h1>
                      <p className="text-xs text-neutral-400 mt-0.5">Real-time aggregated telemetry across all active microservices.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> 10s Live Polling Active
                      </span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`border rounded-xl p-5 ${cardTheme[theme]}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Total Registered Users</span>
                        <Users className="w-4 h-4 text-neutral-500" />
                      </div>
                      <p className="text-3xl font-extrabold tracking-tight mt-3">{stats?.totalUsers ?? 0}</p>
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <span>↑ Live sync active</span>
                      </div>
                    </div>

                    <div className={`border rounded-xl p-5 ${cardTheme[theme]}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Total URL Scans</span>
                        <Database className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-3xl font-extrabold tracking-tight text-purple-400 mt-3">{stats?.totalScans ?? 0}</p>
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
                        <span>Processed via ML Engine</span>
                      </div>
                    </div>

                    <div className={`border rounded-xl p-5 ${cardTheme[theme]}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Safe URL Verified</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-3xl font-extrabold tracking-tight text-emerald-400 mt-3">{stats?.safeUrls ?? 0}</p>
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <span>Normal behavior</span>
                      </div>
                    </div>

                    <div className={`border rounded-xl p-5 ${cardTheme[theme]}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Threats Neutralized</span>
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                      </div>
                      <p className="text-3xl font-extrabold tracking-tight text-rose-500 mt-3">{stats?.phishingDetected ?? 0}</p>
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                        <span>Phishing / Malware blocked</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. USER DIRECTORY */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight">Active User Directory</h1>
                      <p className="text-xs text-neutral-400 mt-0.5">Manage user accounts and access roles synchronized from MongoDB.</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full h-10 pl-9 pr-4 bg-[#111827] border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-500 outline-none focus:border-purple-500 transition"
                      />
                    </div>
                  </div>

                  <div className={`border rounded-xl overflow-hidden ${cardTheme[theme]}`}>
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-[#1F2937]/40 border-b border-neutral-800 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                        <tr>
                          <th className="px-5 py-3.5">User Identity</th>
                          <th className="px-5 py-3.5">Access Role</th>
                          <th className="px-5 py-3.5">Account Status</th>
                          <th className="px-5 py-3.5">Registered Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60 font-medium">
                        {filteredUsers.length > 0 ? filteredUsers.map(u => (
                          <tr key={u._id || u.id} className="hover:bg-neutral-800/30 transition">
                            <td className="px-5 py-4">
                              <p className="font-bold text-white">{u.name}</p>
                              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{u.email}</p>
                            </td>
                            <td className="px-5 py-4">
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20">{u.role}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{u.status}</span>
                            </td>
                            <td className="px-5 py-4 font-mono text-neutral-400 text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan="4" className="px-5 py-10 text-center text-neutral-500">No user records matched query.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. AD CONFIGURATION */}
              {activeTab === 'ad' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">Ad & Promotion Configuration</h1>
                    <p className="text-xs text-neutral-400 mt-0.5">Control live banner prompts and promotional call-to-actions across client views.</p>
                  </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setSavingAd(true);
                    try {
                      await adminService.updateAdConfig({ label: adLabel, url: adUrl, enabled: adEnabled });
                      showToast('Ad configuration successfully published.');
                    } catch { showToast('Failed to update ad configuration.'); }
                    finally { setSavingAd(false); }
                  }} className={`border rounded-xl p-6 space-y-4 max-w-xl ${cardTheme[theme]}`}>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Banner Call-to-Action Label</label>
                      <input type="text" value={adLabel} onChange={e => setAdLabel(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-[#0B0F17] border border-neutral-800 text-xs text-white outline-none focus:border-purple-500 transition" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Destination Redirect URL</label>
                      <input type="url" value={adUrl} onChange={e => setAdUrl(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-[#0B0F17] border border-neutral-800 text-xs text-white outline-none focus:border-purple-500 transition" />
                    </div>
                    <button type="submit" disabled={savingAd} className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-lg transition cursor-pointer disabled:opacity-50">
                      {savingAd ? 'Saving Configuration...' : 'Save & Broadcast Configuration'}
                    </button>
                  </form>
                </div>
              )}

              {/* 4. ANNOUNCEMENT */}
              {activeTab === 'announcement' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">Global Platform Broadcast</h1>
                    <p className="text-xs text-neutral-400 mt-0.5">Publish system-wide alerts and announcements to all connected users.</p>
                  </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!annTitle || !annMessage) return showToast('All fields are required.');
                    setPublishingAnn(true);
                    try {
                      await adminService.createAnnouncement({ title: annTitle, message: annMessage });
                      showToast('Announcement successfully broadcasted.');
                      setAnnTitle(''); setAnnMessage('');
                    } catch { showToast('Broadcast transmission failed.'); }
                    finally { setPublishingAnn(false); }
                  }} className={`border rounded-xl p-6 space-y-4 max-w-xl ${cardTheme[theme]}`}>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Broadcast Title</label>
                      <input type="text" value={annTitle} onChange={e => setAnnTitle(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-[#0B0F17] border border-neutral-800 text-xs text-white outline-none focus:border-purple-500 transition" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">Message Body</label>
                      <textarea rows="4" value={annMessage} onChange={e => setAnnMessage(e.target.value)} className="w-full p-4 rounded-lg bg-[#0B0F17] border border-neutral-800 text-xs text-white outline-none focus:border-purple-500 transition resize-none" />
                    </div>
                    <button type="submit" disabled={publishingAnn} className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-lg transition cursor-pointer disabled:opacity-50">
                      {publishingAnn ? 'Broadcasting...' : 'Publish Global Broadcast'}
                    </button>
                  </form>
                </div>
              )}

              {/* 5. MONITOR SYSTEM */}
              {activeTab === 'monitor' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">Cluster Node Health Monitor</h1>
                    <p className="text-xs text-neutral-400 mt-0.5">Real-time latency and operational status across microservice backends.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {health.length > 0 ? health.map((h, i) => (
                      <div key={i} className={`border rounded-xl p-5 flex items-center justify-between ${cardTheme[theme]}`}>
                        <div>
                          <p className="text-xs font-bold text-white">{h.service}</p>
                          <p className="text-[11px] font-mono text-neutral-400 mt-1">Latency: {h.latency} • Uptime: {h.uptime}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{h.status}</span>
                      </div>
                    )) : <p className="text-xs font-mono text-neutral-500">Querying cluster diagnostics...</p>}
                  </div>
                </div>
              )}

              {/* 6. COMMENT RECEIVER / FEEDBACK */}
              {activeTab === 'comments' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight">User Feedback & Comment Inbox</h1>
                      <p className="text-xs text-neutral-400 mt-0.5">Review incoming telemetry support tickets and user inquiries.</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search feedback..."
                        className="w-full h-10 pl-9 pr-4 bg-[#111827] border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-500 outline-none focus:border-purple-500 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredComments.length > 0 ? filteredComments.map(c => (
                      <div key={c._id || c.id} className={`border rounded-xl p-5 space-y-3 ${cardTheme[theme]}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{c.name} <span className="text-neutral-400 font-normal font-mono">({c.email})</span></span>
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">{c.category}</span>
                        </div>
                        <p className="text-xs p-3.5 rounded-lg bg-[#0B0F17] border border-neutral-800 text-neutral-300 font-sans leading-relaxed">
                          "{c.message}"
                        </p>
                        <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400">
                          <span>Received: {new Date(c.createdAt).toLocaleDateString()}</span>
                          {c.reviewed ? <span className="text-emerald-400 font-bold">Reviewed ✓</span> : (
                            <button onClick={async () => { await adminService.markCommentReviewed(c._id || c.id); fetchRealtimeData(); showToast('Marked ticket as reviewed.'); }} className="text-purple-400 hover:text-purple-300 font-bold cursor-pointer transition">Mark as Reviewed ✓</button>
                          )}
                        </div>
                      </div>
                    )) : <p className="text-xs font-mono text-neutral-500">No support tickets match query.</p>}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}