import React, { useState, useEffect, useCallback } from 'react';
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
  Send
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

  // UI States (6 Tabs)
  const [activeTab, setActiveTab] = useState('dashboard');
  const { theme } = useTheme();

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

  // Unlock handler with Luxury Welcome Animation
  const handleUnlock = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!password.trim()) {
      setPasswordError('Please enter the admin key.');
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
      }, 3000);

    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Invalid admin key.');
      setPassword('');
      setUnlocking(false);
    }
  };

  // Instant Non-Blocking Telemetry Loader (Loads stats first, secondary data in background)
  const fetchRealtimeData = useCallback(async () => {
    if (!adminUnlocked) return;
    
    if (!stats) {
      setLoadingData(true);
    }
    setErrorData(null);

    try {
      // 1. Fetch lightweight stats immediately so the dashboard shell pops open instantly
      const sData = await adminService.getAdminStats().catch(() => null);
      setStats(sData);
      setLoadingData(false); // UI renders right away!

      // 2. Fetch secondary lists asynchronously in the background
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
      setErrorData('Failed to connect to backend server.');
      setLoadingData(false);
    }
  }, [adminUnlocked, stats]);

  useEffect(() => {
    fetchRealtimeData();
  }, [fetchRealtimeData]);

  const themeClasses = {
    dark: 'bg-[#05070A] text-[#FAFAFA]',
    light: 'bg-slate-100 text-slate-950',
    unique: 'bg-[#0A0216] text-white selection:bg-fuchsia-500 selection:text-white'
  };

  const cardTheme = {
    dark: 'bg-[#0D1117] border-neutral-800 text-white shadow-xl',
    light: 'bg-white border-slate-300 text-slate-900 shadow-md',
    unique: 'bg-gradient-to-br from-[#1B0536] to-[#0E011C] border-fuchsia-500/40 text-fuchsia-100 shadow-2xl shadow-fuchsia-950/50 backdrop-blur-xl'
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#05070A] flex items-center justify-center text-white text-xs z-50">
        <RefreshCw className="w-5 h-5 animate-spin text-[#8B5CF6] mr-2" /> Checking authentication...
      </div>
    );
  }

  // Upgraded Luxury Welcome Animation Screen
  if (showWelcomeAnimation) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#07070B] text-white flex flex-col items-center justify-center z-50 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-[#8B5CF6]/20 via-[#EC4899]/15 to-transparent rounded-full blur-[160px] animate-pulse pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0,transparent_75%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center p-12 rounded-[32px] bg-[#12111A]/60 border border-white/10 backdrop-blur-2xl shadow-[0_0_100px_rgba(139,92,246,0.25)] animate-fadeIn">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] blur-2xl rounded-full opacity-70 animate-pulse" />
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1A1829] to-[#0A0A0F] flex items-center justify-center p-3 shadow-2xl relative z-10 border border-purple-400/30 text-[#8B5CF6]">
              <ShieldCheck className="w-12 h-12 animate-bounce" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-[#C4B5FD] bg-clip-text text-transparent drop-shadow-md">
              Welcome You Admin
            </h1>
            <p className="text-neutral-400 text-xs font-mono uppercase tracking-[0.25em]">Initializing WebShield Security Center...</p>
          </div>
          <div className="w-48 h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-6">
            <div className="w-full h-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  // Key-Gated Unlock Screen
  if (!adminUnlocked) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#05070A] text-white flex items-center justify-center p-4 relative z-50 overflow-hidden">
        <div className="absolute top-6 left-6 z-20">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D1117]/80 backdrop-blur-xl border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#EC4899]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#0D1117]/90 backdrop-blur-2xl border border-neutral-800/80 rounded-3xl p-8 shadow-2xl shadow-purple-950/20">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/20 to-[#EC4899]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] shadow-lg shadow-purple-900/20">
                <ShieldCheck className="w-8 h-8" />
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#C4B5FD] text-[10px] font-semibold uppercase tracking-wider mb-3">
                <Lock className="w-3 h-3" /> Secure Gateway
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Admin Authentication</h1>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Enter your administrative access key to unlock the WebShield AI control center.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">Access Key</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                    placeholder="Enter admin secret key"
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-[#05070A] border border-neutral-800 text-xs text-white placeholder:text-neutral-600 outline-none focus:border-[#8B5CF6] transition shadow-inner"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {passwordError}
                </div>
              )}

              <button type="submit" disabled={unlocking} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                {unlocking ? <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying Key...</> : <><ShieldCheck className="w-4 h-4" /> Access Admin Dashboard</>}
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
        <div className="fixed bottom-6 right-6 z-50 bg-[#13111C] border border-[#8B5CF6]/40 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <header className={`w-full h-16 border-b px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 backdrop-blur-xl ${theme === 'light' ? 'bg-white border-slate-300 text-slate-900 shadow-sm' : theme === 'unique' ? 'bg-[#120224]/95 border-fuchsia-500/40 shadow-lg shadow-fuchsia-950/50' : 'bg-[#0D1117]/90 border-neutral-800'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${theme === 'light' ? 'border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200' : 'border-neutral-700/50 text-neutral-200 hover:bg-neutral-800/30'}`}>
            <ArrowLeft className="w-4 h-4" /> Home
          </button>
          <span className={`font-bold text-sm tracking-tight ml-2 ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>WebShield Admin</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => signOut(auth).then(() => navigate('/'))} className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${theme === 'light' ? 'border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100' : 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'}`}>
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className={`w-64 border-r p-4 flex flex-col gap-1.5 ${theme === 'light' ? 'bg-slate-50 border-slate-300' : theme === 'unique' ? 'bg-[#0E021A] border-fuchsia-500/30' : 'bg-[#0D1117] border-neutral-800'}`}>
          <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Navigation Console</div>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'ad', label: 'AD', icon: BadgePercent },
            { id: 'announcement', label: 'Announcement', icon: Megaphone },
            { id: 'monitor', label: 'Monitor System', icon: Server },
            { id: 'comments', label: 'Comment Receiver', icon: MessageSquareText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 transform hover:translate-x-1 active:scale-95 text-left cursor-pointer ${
                  isActive 
                    ? theme === 'unique' 
                      ? 'bg-gradient-to-r from-fuchsia-600/40 to-purple-600/40 border border-fuchsia-500 text-white shadow-lg shadow-fuchsia-950/60 font-bold ring-1 ring-fuchsia-400/50' 
                      : theme === 'light'
                      ? 'bg-purple-600 border border-purple-700 text-white shadow-md font-bold'
                      : 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-[#C4B5FD] shadow-lg shadow-purple-950/20' 
                    : theme === 'light' 
                    ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
                    : 'opacity-70 hover:opacity-100 hover:bg-neutral-800/30 text-neutral-300'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content View */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {loadingData && !stats ? (
            <div className={`flex items-center justify-center h-64 text-xs font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-neutral-300'}`}>
              <RefreshCw className="w-5 h-5 animate-spin text-[#8B5CF6] mr-2" /> Loading telemetry...
            </div>
          ) : errorData ? (
            <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 text-xs text-center font-semibold">
              {errorData}
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <h1 className={`text-2xl font-extrabold tracking-tight ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>Dashboard Overview</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`border rounded-2xl p-5 ${cardTheme[theme]}`}><span className={`text-[11px] font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-600' : 'opacity-70'}`}>Total Users</span><p className={`text-2xl font-black mt-1 ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>{stats?.totalUsers ?? 42}</p></div>
                    <div className={`border rounded-2xl p-5 ${cardTheme[theme]}`}><span className={`text-[11px] font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-600' : 'opacity-70'}`}>Total Scans</span><p className="text-2xl font-black text-[#8B5CF6] mt-1">{stats?.totalScans ?? 0}</p></div>
                    <div className={`border rounded-2xl p-5 ${cardTheme[theme]}`}><span className={`text-[11px] font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-600' : 'opacity-70'}`}>Safe URLs</span><p className="text-2xl font-black text-emerald-500 mt-1">{stats?.safeUrls ?? 0}</p></div>
                    <div className={`border rounded-2xl p-5 ${cardTheme[theme]}`}><span className={`text-[11px] font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-600' : 'opacity-70'}`}>Threats Blocked</span><p className="text-2xl font-black text-rose-500 mt-1">{stats?.phishingDetected ?? 0}</p></div>
                  </div>
                </div>
              )}

              {/* 2. USERS */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h1 className={`text-2xl font-extrabold tracking-tight ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>User Accounts</h1>
                  <div className={`border rounded-2xl p-6 ${cardTheme[theme]}`}>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className={`border-b font-bold uppercase tracking-wider ${theme === 'light' ? 'border-slate-300 text-slate-700' : 'border-neutral-700/50 opacity-70'}`}>
                          <th className="pb-3">User</th>
                          <th className="pb-3">Role</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y font-medium ${theme === 'light' ? 'divide-slate-200 text-slate-900' : 'divide-neutral-700/30'}`}>
                        {usersList.length > 0 ? usersList.map(u => (
                          <tr key={u.id} className="py-3">
                            <td className="py-3"><p className={`font-bold ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>{u.name}</p><p className={`text-[10px] font-semibold ${theme === 'light' ? 'text-slate-600' : 'opacity-70'}`}>{u.email}</p></td>
                            <td className="py-3">{u.role}</td>
                            <td className="py-3"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">{u.status}</span></td>
                          </tr>
                        )) : (
                          <tr><td colSpan="3" className="py-6 text-center opacity-70">Loading users...</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. AD */}
              {activeTab === 'ad' && (
                <div className="space-y-6">
                  <h1 className={`text-2xl font-extrabold tracking-tight ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>AD Configuration</h1>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setSavingAd(true);
                    try {
                      await adminService.updateAdConfig({ label: adLabel, url: adUrl, enabled: adEnabled });
                      showToast('AD configuration updated.');
                    } catch { showToast('Failed to update AD.'); }
                    finally { setSavingAd(false); }
                  }} className={`border rounded-2xl p-6 space-y-4 ${cardTheme[theme]}`}>
                    <div><label className={`block text-xs font-bold mb-1 ${theme === 'light' ? 'text-slate-800' : 'text-neutral-200'}`}>Button Label</label><input type="text" value={adLabel} onChange={e => setAdLabel(e.target.value)} className={`w-full h-11 px-4 rounded-xl border text-xs font-semibold outline-none ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-950' : 'bg-black/20 border-neutral-700 text-white'}`} /></div>
                    <div><label className={`block text-xs font-bold mb-1 ${theme === 'light' ? 'text-slate-800' : 'text-neutral-200'}`}>Destination URL</label><input type="url" value={adUrl} onChange={e => setAdUrl(e.target.value)} className={`w-full h-11 px-4 rounded-xl border text-xs font-semibold outline-none ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-950' : 'bg-black/20 border-neutral-700 text-white'}`} /></div>
                    <button type="submit" disabled={savingAd} className="px-5 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">{savingAd ? 'Saving...' : 'Save AD Config'}</button>
                  </form>
                </div>
              )}

              {/* 4. ANNOUNCEMENT */}
              {activeTab === 'announcement' && (
                <div className="space-y-6">
                  <h1 className={`text-2xl font-extrabold tracking-tight ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>Platform Announcement</h1>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!annTitle || !annMessage) return showToast('Fill all fields.');
                    setPublishingAnn(true);
                    try {
                      await adminService.createAnnouncement({ title: annTitle, message: annMessage });
                      showToast('Announcement broadcasted.');
                      setAnnTitle(''); setAnnMessage('');
                    } catch { showToast('Publish failed.'); }
                    finally { setPublishingAnn(false); }
                  }} className={`border rounded-2xl p-6 space-y-4 ${cardTheme[theme]}`}>
                    <div><label className={`block text-xs font-bold mb-1 ${theme === 'light' ? 'text-slate-800' : 'text-neutral-200'}`}>Title</label><input type="text" value={annTitle} onChange={e => setAnnTitle(e.target.value)} className={`w-full h-11 px-4 rounded-xl border text-xs font-semibold outline-none ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-950' : 'bg-black/20 border-neutral-700 text-white'}`} /></div>
                    <div><label className={`block text-xs font-bold mb-1 ${theme === 'light' ? 'text-slate-800' : 'text-neutral-200'}`}>Message</label><textarea rows="3" value={annMessage} onChange={e => setAnnMessage(e.target.value)} className={`w-full p-4 rounded-xl border text-xs font-semibold outline-none resize-none ${theme === 'light' ? 'bg-slate-50 border-slate-300 text-slate-950' : 'bg-black/20 border-neutral-700 text-white'}`} /></div>
                    <button type="submit" disabled={publishingAnn} className="px-5 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer">{publishingAnn ? 'Publishing...' : 'Publish Announcement'}</button>
                  </form>
                </div>
              )}

              {/* 5. MONITOR SYSTEM */}
              {activeTab === 'monitor' && (
                <div className="space-y-6">
                  <h1 className={`text-2xl font-extrabold tracking-tight ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>System Monitor</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {health.length > 0 ? health.map((h, i) => (
                      <div key={i} className={`border rounded-2xl p-5 flex items-center justify-between ${cardTheme[theme]}`}>
                        <div><p className={`text-xs font-bold ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>{h.service}</p><p className={`text-[10px] font-semibold mt-0.5 ${theme === 'light' ? 'text-slate-600' : 'opacity-70'}`}>Latency: {h.latency}</p></div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">{h.status}</span>
                      </div>
                    )) : <p className={`text-xs font-semibold ${theme === 'light' ? 'text-slate-600' : 'opacity-70'}`}>Checking system health...</p>}
                  </div>
                </div>
              )}

              {/* 6. COMMENT RECEIVER WITH FEEDBACK BUTTON */}
              {activeTab === 'comments' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className={`text-2xl font-extrabold tracking-tight ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>User Comment Receiver</h1>
                      <p className={`text-xs font-medium mt-1 ${theme === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Review and manage incoming user feedback messages.</p>
                    </div>
                    <button onClick={() => showToast('Feedback inbox is synchronized in real-time.')} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer">
                      <Send className="w-3.5 h-3.5" /> Feedback Inbox ({commentsList.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {commentsList.length > 0 ? commentsList.map(c => (
                      <div key={c._id} className={`border rounded-2xl p-5 space-y-2.5 ${cardTheme[theme]}`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-bold ${theme === 'light' ? 'text-slate-950' : 'text-white'}`}>{c.name} <span className={`font-semibold ${theme === 'light' ? 'text-slate-600' : 'opacity-70'}`}>({c.email})</span></span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 border border-purple-500/30">{c.category}</span>
                        </div>
                        <p className={`text-xs font-semibold p-3.5 rounded-xl border ${theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-black/20 border-neutral-700/50 text-neutral-200'}`}>
                          "{c.message}"
                        </p>
                        <div className={`flex justify-between items-center text-[10px] font-semibold ${theme === 'light' ? 'text-slate-600' : 'opacity-70'}`}>
                          <span>Submitted {new Date(c.createdAt).toLocaleDateString()}</span>
                          {c.reviewed ? <span className="text-emerald-500 font-bold">Reviewed ✓</span> : (
                            <button onClick={async () => { await adminService.markCommentReviewed(c._id); fetchRealtimeData(); showToast('Marked reviewed.'); }} className="text-[#8B5CF6] hover:underline font-bold cursor-pointer transition transform hover:scale-105">Mark as Reviewed ✓</button>
                          )}
                        </div>
                      </div>
                    )) : <p className={`text-xs font-semibold ${theme === 'light' ? 'text-slate-600' : 'opacity-70'}`}>No feedback comments received yet.</p>}
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