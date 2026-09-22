import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { adminService } from '../services/adminService';

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
  Menu,
  ArrowLeft,
  Settings,
  Palette,
  Sun,
  Moon,
  Sparkles,
  Lock,
  LogOut
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Key-gated unlock state (Clears on refresh automatically)
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // UI States (6 Tabs)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState('dark'); // 'light' | 'dark' | 'unique'

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

  // Check if user is logged into website via Firebase
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

  // Unlock handler using key
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
      setAdminUnlocked(true);
      setPassword('');
      showToast('Admin panel unlocked successfully.');
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Invalid admin key.');
      setPassword('');
    } finally {
      setUnlocking(false);
    }
  };

  const fetchRealtimeData = useCallback(async () => {
    if (!adminUnlocked) return;
    setLoadingData(true);
    setErrorData(null);
    try {
      const [sData, uData, hData, cData, adData] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getUsers(),
        adminService.getSystemHealth(),
        adminService.getComments(),
        adminService.getAdConfig()
      ]);
      setStats(sData);
      setUsersList(uData);
      setHealth(hData);
      setCommentsList(cData);
      if (adData) {
        setAdLabel(adData.label || '');
        setAdUrl(adData.url || '');
        setAdEnabled(adData.enabled ?? true);
      }
    } catch (err) {
      setErrorData('Failed to connect to backend server.');
    } finally {
      setLoadingData(false);
    }
  }, [adminUnlocked]);

  useEffect(() => {
    fetchRealtimeData();
  }, [fetchRealtimeData]);

  // Theme styling classes
  const themeClasses = {
    dark: 'bg-[#05070A] text-[#FAFAFA]',
    light: 'bg-slate-100 text-slate-900',
    unique: 'bg-[#120822] text-[#F3E8FF]'
  };

  const cardTheme = {
    dark: 'bg-[#0D1117] border-neutral-800 text-white',
    light: 'bg-white border-slate-200 text-slate-900 shadow-sm',
    unique: 'bg-[#1A0B2E] border-purple-900/50 text-purple-100'
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#05070A] flex items-center justify-center text-white text-xs">
        <RefreshCw className="w-5 h-5 animate-spin text-[#8B5CF6] mr-2" /> Checking authentication...
      </div>
    );
  }

  // Key-Gated Unlock Screen (Always prompts on refresh)
  if (!adminUnlocked) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex items-center justify-center px-4 relative">
        <div className="w-full max-w-md bg-[#0D1117] border border-neutral-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">Admin Authentication</h1>
            <p className="text-xs text-neutral-400 mt-1">Enter your admin access key to continue.</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                placeholder="Enter admin key"
                className="w-full h-12 pl-10 pr-11 rounded-xl bg-[#05070A] border border-neutral-800 text-xs text-white outline-none focus:border-[#8B5CF6]"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {passwordError}
              </div>
            )}

            <button type="submit" disabled={unlocking} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-semibold shadow-lg disabled:opacity-50">
              {unlocking ? 'Verifying Key...' : 'Access Admin Dashboard'}
            </button>
          </form>

          <button onClick={() => navigate('/')} className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex flex-col transition-colors duration-300 ${themeClasses[theme]}`}>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#13111C] border border-[#8B5CF6]/40 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* Header with Top-Left Buttons */}
      <header className={`w-full h-16 border-b px-4 flex items-center justify-between z-30 sticky top-0 backdrop-blur-xl ${theme === 'light' ? 'bg-white/80 border-slate-200' : 'bg-[#0D1117]/80 border-neutral-800'}`}>
        <div className="flex items-center gap-3 relative">
          {/* 3-Line Menu Button for Admin Settings */}
          <button onClick={() => setSettingsOpen(v => !v)} className="p-2 rounded-xl border border-neutral-700/50 hover:bg-neutral-800/30 transition">
            <Menu className="w-5 h-5" />
          </button>

          {settingsOpen && (
            <div className={`absolute left-0 top-12 w-52 border rounded-2xl shadow-2xl p-3 z-50 space-y-2 ${cardTheme[theme]}`}>
              <div className="flex items-center gap-2 text-xs font-semibold px-2 pb-1 border-b border-neutral-700/40">
                <Settings className="w-3.5 h-3.5" /> Admin Settings
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 px-2 mb-1">Select Theme</p>
                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => setTheme('light')} className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 border ${theme === 'light' ? 'bg-purple-500/20 border-purple-500' : 'border-transparent'}`}><Sun className="w-3.5 h-3.5" /> Light</button>
                  <button onClick={() => setTheme('dark')} className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 border ${theme === 'dark' ? 'bg-purple-500/20 border-purple-500' : 'border-transparent'}`}><Moon className="w-3.5 h-3.5" /> Dark</button>
                  <button onClick={() => setTheme('unique')} className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 border ${theme === 'unique' ? 'bg-purple-500/20 border-purple-500' : 'border-transparent'}`}><Sparkles className="w-3.5 h-3.5" /> Unique</button>
                </div>
              </div>
            </div>
          )}

          {/* Back Button to Home */}
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-700/50 text-xs font-medium hover:bg-neutral-800/30 transition">
            <ArrowLeft className="w-4 h-4" /> Home
          </button>

          <span className="font-bold text-sm tracking-tight ml-2">WebShield Admin</span>
        </div>

        <button onClick={() => signOut(auth).then(() => navigate('/'))} className="flex items-center gap-2 text-xs text-rose-400 px-3 py-1.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10">
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar - 6 Requested Buttons */}
        <aside className={`w-64 border-r p-4 flex flex-col gap-1.5 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#0D1117] border-neutral-800'}`}>
          <div className="px-3 py-2 text-[10px] font-semibold text-neutral-500 uppercase">Navigation</div>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition text-left ${
                  isActive ? 'bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#C4B5FD]' : 'opacity-70 hover:opacity-100 hover:bg-neutral-800/40'
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
          {loadingData ? (
            <div className="flex items-center justify-center h-64 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin text-[#8B5CF6] mr-2" /> Loading telemetry...
            </div>
          ) : errorData ? (
            <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs text-center">
              {errorData}
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`border rounded-2xl p-5 ${cardTheme[theme]}`}><span className="text-[11px] opacity-60">Total Users</span><p className="text-2xl font-bold mt-1">{stats?.totalUsers ?? 42}</p></div>
                    <div className={`border rounded-2xl p-5 ${cardTheme[theme]}`}><span className="text-[11px] opacity-60">Total Scans</span><p className="text-2xl font-bold text-[#8B5CF6] mt-1">{stats?.totalScans ?? 0}</p></div>
                    <div className={`border rounded-2xl p-5 ${cardTheme[theme]}`}><span className="text-[11px] opacity-60">Safe URLs</span><p className="text-2xl font-bold text-emerald-400 mt-1">{stats?.safeUrls ?? 0}</p></div>
                    <div className={`border rounded-2xl p-5 ${cardTheme[theme]}`}><span className="text-[11px] opacity-60">Threats Blocked</span><p className="text-2xl font-bold text-rose-400 mt-1">{stats?.phishingDetected ?? 0}</p></div>
                  </div>
                </div>
              )}

              {/* 2. USERS */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold tracking-tight">User Accounts</h1>
                  <div className={`border rounded-2xl p-6 ${cardTheme[theme]}`}>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-700/50 opacity-60">
                          <th className="pb-3">User</th>
                          <th className="pb-3">Role</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-700/30">
                        {usersList.map(u => (
                          <tr key={u.id} className="py-3">
                            <td className="py-3"><p className="font-semibold">{u.name}</p><p className="text-[10px] opacity-60">{u.email}</p></td>
                            <td className="py-3">{u.role}</td>
                            <td className="py-3"><span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400">{u.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. AD */}
              {activeTab === 'ad' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold tracking-tight">AD Configuration</h1>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setSavingAd(true);
                    try {
                      await adminService.updateAdConfig({ label: adLabel, url: adUrl, enabled: adEnabled });
                      showToast('AD configuration updated.');
                    } catch { showToast('Failed to update AD.'); }
                    finally { setSavingAd(false); }
                  }} className={`border rounded-2xl p-6 space-y-4 ${cardTheme[theme]}`}>
                    <div><label className="block text-xs mb-1">Button Label</label><input type="text" value={adLabel} onChange={e => setAdLabel(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-black/20 border border-neutral-700 text-xs outline-none" /></div>
                    <div><label className="block text-xs mb-1">Destination URL</label><input type="url" value={adUrl} onChange={e => setAdUrl(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-black/20 border border-neutral-700 text-xs outline-none" /></div>
                    <button type="submit" disabled={savingAd} className="px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-semibold rounded-xl">{savingAd ? 'Saving...' : 'Save AD Config'}</button>
                  </form>
                </div>
              )}

              {/* 4. ANNOUNCEMENT */}
              {activeTab === 'announcement' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold tracking-tight">Platform Announcement</h1>
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
                    <div><label className="block text-xs mb-1">Title</label><input type="text" value={annTitle} onChange={e => setAnnTitle(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-black/20 border border-neutral-700 text-xs outline-none" /></div>
                    <div><label className="block text-xs mb-1">Message</label><textarea rows="3" value={annMessage} onChange={e => setAnnMessage(e.target.value)} className="w-full p-4 rounded-xl bg-black/20 border border-neutral-700 text-xs outline-none resize-none" /></div>
                    <button type="submit" disabled={publishingAnn} className="px-5 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-semibold rounded-xl">{publishingAnn ? 'Publishing...' : 'Publish Announcement'}</button>
                  </form>
                </div>
              )}

              {/* 5. MONITOR SYSTEM */}
              {activeTab === 'monitor' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold tracking-tight">System Monitor</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {health.map((h, i) => (
                      <div key={i} className={`border rounded-2xl p-5 flex items-center justify-between ${cardTheme[theme]}`}>
                        <div><p className="text-xs font-semibold">{h.service}</p><p className="text-[10px] opacity-60">Latency: {h.latency}</p></div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400">{h.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. COMMENT RECEIVER */}
              {activeTab === 'comments' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold tracking-tight">User Comment Receiver</h1>
                  <div className="space-y-3">
                    {commentsList.length > 0 ? commentsList.map(c => (
                      <div key={c._id} className={`border rounded-2xl p-5 space-y-2 ${cardTheme[theme]}`}>
                        <div className="flex justify-between"><span className="text-xs font-bold">{c.name} ({c.email})</span><span className="text-[10px] text-[#8B5CF6]">{c.category}</span></div>
                        <p className="text-xs opacity-80 bg-black/20 p-3 rounded-xl">"{c.message}"</p>
                        <div className="flex justify-between items-center text-[10px] opacity-60">
                          <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                          {c.reviewed ? <span className="text-emerald-400">Reviewed ✓</span> : (
                            <button onClick={async () => { await adminService.markCommentReviewed(c._id); fetchRealtimeData(); showToast('Marked reviewed.'); }} className="text-[#8B5CF6] hover:underline">Mark as Reviewed ✓</button>
                          )}
                        </div>
                      </div>
                    )) : <p className="text-xs opacity-60">No feedback comments received yet.</p>}
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