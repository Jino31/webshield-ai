import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { adminService } from '../services/adminService';

import {
  LayoutDashboard,
  Users,
  Server,
  Megaphone,
  BadgePercent,
  MessageSquareText,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Menu,
  X,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  ShieldAlert,
  LogOut
} from 'lucide-react';

const ADMIN_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

const AUTHORIZED_ADMIN_EMAILS = [
  'jino@webshield.ai',
  'admin@webshield.ai',
  'jeffrinjinos1@gmail.com'
];

export default function Admin() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Password Verification State
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [tokenExpiry, setTokenExpiry] = useState(null);

  // 6 Requested Tabs
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  // Telemetry States
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [health, setHealth] = useState([]);
  const [commentsList, setCommentsList] = useState([]);
  
  // Announcements Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [publishingAnn, setPublishingAnn] = useState(false);

  // AD Config State
  const [adLabel, setAdLabel] = useState('');
  const [adUrl, setAdUrl] = useState('');
  const [adEnabled, setAdEnabled] = useState(true);
  const [savingAd, setSavingAd] = useState(false);

  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Lock Admin Panel (Refresh forces password screen as requested)
  const lockAdminPanel = useCallback(() => {
    setAdminUnlocked(false);
    setPassword('');
    setPasswordError('');
    setTokenExpiry(null);
  }, []);

  // Session Timeout Check (30 min)
  useEffect(() => {
    if (!adminUnlocked || !tokenExpiry) return;

    const interval = setInterval(() => {
      if (Date.now() >= tokenExpiry) {
        lockAdminPanel();
        setPasswordError('Your admin session has expired after 30 minutes. Please enter your password again.');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [adminUnlocked, tokenExpiry, lockAdminPanel]);

  // Firebase Auth & Allowlist Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUser(null);
        setIsAdmin(false);
        setAdminUnlocked(false);
        setAuthLoading(false);
        return;
      }

      const email = user.email?.toLowerCase().trim();
      setCurrentUser(user);

      if (!AUTHORIZED_ADMIN_EMAILS.includes(email)) {
        setIsAdmin(false);
        setAdminUnlocked(false);
        setAuthLoading(false);
        return;
      }

      setIsAdmin(true);
      // Explicitly require password on every fresh refresh
      setAdminUnlocked(false);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Secure Backend Password Verification
  const handleAdminUnlock = async (event) => {
    event.preventDefault();
    setPasswordError('');

    if (!password.trim()) {
      setPasswordError('Please enter the administrator password.');
      return;
    }

    setUnlocking(true);

    try {
      await adminService.unlockAdmin(password);
      setAdminUnlocked(true);
      setTokenExpiry(Date.now() + ADMIN_SESSION_DURATION);
      setPassword('');
      showToast('Admin panel unlocked successfully.');
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Invalid administrator credentials');
      setPassword('');
    } finally {
      setUnlocking(false);
    }
  };

  // Fetch Telemetry Data
  const fetchAdminData = useCallback(async () => {
    if (!isAdmin || !adminUnlocked) return;

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
      setUsersList(Array.isArray(uData) ? uData : []);
      setHealth(Array.isArray(hData) ? hData : []);
      setCommentsList(Array.isArray(cData) ? cData : []);
      
      if (adData) {
        setAdLabel(adData.label || '');
        setAdUrl(adData.url || '');
        setAdEnabled(adData.enabled ?? true);
      }
    } catch (error) {
      setErrorData('Unable to load security telemetry from backend.');
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin, adminUnlocked]);

  useEffect(() => {
    if (!isAdmin || !adminUnlocked) return;
    fetchAdminData();
  }, [isAdmin, adminUnlocked, fetchAdminData]);

  const handleSignOut = async () => {
    try {
      lockAdminPanel();
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleReviewComment = async (id) => {
    try {
      await adminService.markCommentReviewed(id);
      setCommentsList(prev => prev.map(c => c._id === id || c.id === id ? { ...c, reviewed: true } : c));
      showToast('Comment marked as reviewed.');
    } catch (err) {
      showToast('Failed to update comment status.');
    }
  };

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) {
      showToast('Title and message cannot be empty.');
      return;
    }
    setPublishingAnn(true);
    try {
      await adminService.createAnnouncement({ title: annTitle.trim(), message: annMessage.trim() });
      showToast('Announcement published successfully.');
      setAnnTitle('');
      setAnnMessage('');
    } catch (err) {
      showToast('Failed to publish announcement.');
    } finally {
      setPublishingAnn(false);
    }
  };

  const handleSaveAdConfig = async (e) => {
    e.preventDefault();
    try {
      const parsedUrl = new URL(adUrl.trim());
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        showToast('Only HTTP and HTTPS URLs are allowed.');
        return;
      }
    } catch (_) {
      showToast('Please enter a valid destination URL.');
      return;
    }

    setSavingAd(true);
    try {
      await adminService.updateAdConfig({ label: adLabel.trim(), url: adUrl.trim(), enabled: adEnabled });
      showToast('AD configuration updated successfully.');
    } catch (err) {
      showToast('Failed to save AD configuration.');
    } finally {
      setSavingAd(false);
    }
  };

  // Render Guards
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#05070A] text-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#8B5CF6] animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <RefreshCw className="w-4 h-4 text-[#8B5CF6] animate-spin" />
            Verifying security clearance...
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div role="alert" className="min-h-screen bg-[#05070A] text-[#FAFAFA] flex flex-col items-center justify-center p-6">
        <div className="bg-[#0D1117] border border-neutral-800 p-8 rounded-3xl text-center shadow-2xl max-w-md w-full space-y-4">
          <div className="w-14 h-14 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-2xl flex items-center justify-center text-[#8B5CF6] mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white mb-1">Authentication Required</h1>
            <p className="text-xs text-neutral-400 leading-relaxed">Please sign in with an authorized administrator account.</p>
          </div>
          <button onClick={() => navigate('/login', { replace: true })} className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white rounded-xl text-xs font-semibold transition cursor-pointer">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div role="alert" className="min-h-screen bg-[#05070A] text-[#FAFAFA] flex flex-col items-center justify-center p-6">
        <div className="bg-[#0D1117] border border-rose-500/30 p-8 rounded-3xl text-center shadow-2xl max-w-md w-full space-y-4">
          <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white mb-1">Access Denied</h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Logged in as <span className="text-white font-mono">{currentUser.email}</span>. Administrator privileges are required.
            </p>
          </div>
          <button onClick={() => navigate('/', { replace: true })} className="w-full py-3 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!adminUnlocked) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#0D1117]/95 backdrop-blur-xl border border-neutral-800 rounded-3xl shadow-2xl p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20 border border-[#8B5CF6]/30 flex items-center justify-center">
                <Lock className="w-7 h-7 text-[#8B5CF6]" />
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#C4B5FD] text-[10px] font-semibold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure Authentication Gate
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Password Screen</h1>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Enter your administrator password to unlock the WebShield AI control center.
              </p>
            </div>

            <form onSubmit={handleAdminUnlock} className="space-y-4">
              <div>
                <label htmlFor="admin-password" className="block text-xs font-medium text-neutral-300 mb-2">Administrator Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-[#05070A] border border-neutral-800 text-xs text-white placeholder:text-neutral-600 outline-none focus:border-[#8B5CF6] transition"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div role="alert" className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-300">{passwordError}</p>
                </div>
              )}

              <button type="submit" disabled={unlocking} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white text-xs font-semibold transition shadow-lg shadow-purple-900/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
                {unlocking ? <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying...</> : <><ShieldCheck className="w-4 h-4" /> Unlock Dashboard</>}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-neutral-800 text-center">
              <p className="text-[10px] text-neutral-500">Signed in as</p>
              <p className="text-xs text-neutral-300 mt-1 truncate">{currentUser.email}</p>
            </div>

            <button type="button" onClick={() => navigate('/')} className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500 hover:text-white transition cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to WebShield AI
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Interface (6 Requested Tabs)
  return (
    <div className="min-h-screen w-full bg-[#05070A] text-[#FAFAFA] flex flex-col">
      {toastMessage && (
        <div role="status" className="fixed bottom-6 right-6 z-50 bg-[#13111C] border border-[#8B5CF6]/40 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="w-full h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-neutral-800/80 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileMenuOpen((v) => !v)} className="md:hidden p-2 rounded-xl bg-[#13111C] border border-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-white block">WebShield AI</span>
            <span className="hidden sm:block text-[9px] text-neutral-500 uppercase tracking-widest">Admin Control Center</span>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          <button type="button" onClick={() => setProfileDropdown((v) => !v)} className="flex items-center gap-2 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 px-3.5 py-2 rounded-xl text-xs font-medium text-white transition cursor-pointer">
            <span className="truncate max-w-[100px]">{currentUser.displayName || currentUser.email}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {profileDropdown && (
            <div className="absolute right-0 top-12 w-56 bg-[#0D1117] border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                <p className="text-xs font-semibold text-white truncate">{currentUser.displayName || 'Administrator'}</p>
                <p className="text-[10px] text-neutral-400 truncate">{currentUser.email}</p>
              </div>
              <button type="button" onClick={lockAdminPanel} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-400 hover:bg-amber-950/30 transition text-left cursor-pointer">
                <Lock className="w-3.5 h-3.5" /> Lock Admin Panel
              </button>
              <button type="button" onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition text-left cursor-pointer">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {mobileMenuOpen && (
          <button type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 z-10 md:hidden" />
        )}

        {/* Sidebar Navigation - Strictly 6 requested buttons */}
        <aside className={`fixed md:relative z-20 inset-y-0 left-0 w-64 bg-[#0D1117] border-r border-neutral-800/80 p-4 flex flex-col gap-1.5 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0 top-16' : '-translate-x-full md:translate-x-0'}`}>
          <div className="px-3 py-2 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Management Console</div>

          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'system_monitor', label: 'System Monitor', icon: Server },
            { id: 'announcements', label: 'Announcements', icon: Megaphone },
            { id: 'ad_button', label: 'AD Button', icon: BadgePercent },
            { id: 'comment_receiver', label: 'User Comment Receiver', icon: MessageSquareText },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition text-left cursor-pointer ${
                  isActive ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#C4B5FD]' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="mt-auto p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-400">Admin Session Active</span>
            </div>
            <p className="text-[9px] text-neutral-500 mt-1">Backend Verified</p>
          </div>
        </aside>

        {/* Content Section */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
          {errorData ? (
            <div className="p-6 bg-rose-950/30 border border-rose-800/60 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
              <p className="text-xs font-semibold text-white">{errorData}</p>
              <button type="button" onClick={fetchAdminData} className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-xl text-xs transition cursor-pointer">
                Try Again
              </button>
            </div>
          ) : loadingData ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400 text-xs gap-3">
              <RefreshCw className="w-5 h-5 text-[#8B5CF6] animate-spin" />
              Loading system telemetry...
            </div>
          ) : (
            <>
              {/* 1. DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-xs text-neutral-400 mt-1">Platform metrics, user growth, and core performance stats.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Total Users</span>
                      <p className="text-2xl font-bold text-white">{stats?.totalUsers ?? '--'}</p>
                    </div>
                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Total Scans</span>
                      <p className="text-2xl font-bold text-[#8B5CF6]">{stats?.totalScans ?? '--'}</p>
                      <span className="text-[10px] text-[#8B5CF6] mt-2 inline-block">Detection rate: {stats?.detectionRate ?? '—'}</span>
                    </div>
                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Safe URLs</span>
                      <p className="text-2xl font-bold text-emerald-400">{stats?.safeUrls ?? '--'}</p>
                    </div>
                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Threats Blocked</span>
                      <p className="text-2xl font-bold text-rose-400">{stats?.phishingDetected ?? '--'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. USERS */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-xs text-neutral-400 mt-1">Manage registered accounts and permission tiers.</p>
                  </div>
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800 text-neutral-500">
                            <th className="pb-3 font-semibold uppercase tracking-wider">User</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Role</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Status</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Scans</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60">
                          {usersList.length > 0 ? (
                            usersList.map((user) => (
                              <tr key={user.id || user.email} className="hover:bg-neutral-900/30 transition">
                                <td className="py-3">
                                  <p className="font-semibold text-white">{user.name}</p>
                                  <p className="text-[10px] text-neutral-400">{user.email}</p>
                                </td>
                                <td className="py-3 text-neutral-300">{user.role}</td>
                                <td className="py-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{user.status}</span></td>
                                <td className="py-3 text-neutral-300">{user.scansCount ?? 0}</td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="4" className="py-10 text-center text-neutral-500">No users found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SYSTEM MONITOR */}
              {activeTab === 'system_monitor' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-white tracking-tight">System Monitor</h1>
                      <p className="text-xs text-neutral-400 mt-1">Real-time service health and latency check.</p>
                    </div>
                    <button onClick={fetchAdminData} className="px-3 py-1.5 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 text-neutral-300 rounded-xl text-xs flex items-center gap-2 cursor-pointer">
                      <RefreshCw className="w-3.5 h-3.5" /> Refresh Health
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {health.length > 0 ? (
                      health.map((srv, idx) => (
                        <div key={idx} className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-white">{srv.service}</p>
                            <p className="text-[10px] text-neutral-400">Latency: {srv.latency || '—'} | Uptime: {srv.uptime || '—'}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3" /> {srv.status || 'Operational'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-10 text-center text-neutral-500 text-xs">
                        Unable to retrieve health information
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. ANNOUNCEMENTS */}
              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Platform Announcements</h1>
                    <p className="text-xs text-neutral-400 mt-1">Broadcast security notices or updates to all platform users.</p>
                  </div>
                  <form onSubmit={handlePublishAnnouncement} className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Announcement Title</label>
                      <input type="text" maxLength={100} value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="e.g. Scheduled Maintenance Update" className="w-full h-11 px-4 rounded-xl bg-[#05070A] border border-neutral-800 text-xs text-white outline-none focus:border-[#8B5CF6]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">Message Content</label>
                      <textarea rows="3" maxLength={500} value={annMessage} onChange={(e) => setAnnMessage(e.target.value)} placeholder="Write broadcast notice..." className="w-full p-4 rounded-xl bg-[#05070A] border border-neutral-800 text-xs text-white outline-none focus:border-[#8B5CF6] resize-none" />
                    </div>
                    <button type="submit" disabled={publishingAnn} className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-semibold transition cursor-pointer shadow-lg shadow-purple-950/40 disabled:opacity-50">
                      {publishingAnn ? 'Publishing...' : 'Publish Announcement'}
                    </button>
                  </form>
                </div>
              )}

              {/* 5. AD BUTTON */}
              {activeTab === 'ad_button' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">AD Button & Promotion Management</h1>
                    <p className="text-xs text-neutral-400 mt-1">Configure featured promotional buttons and sponsor links across the UI.</p>
                  </div>
                  <form onSubmit={handleSaveAdConfig} className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">Button Label</label>
                        <input type="text" value={adLabel} onChange={(e) => setAdLabel(e.target.value)} placeholder="Upgrade to Pro" className="w-full h-11 px-4 rounded-xl bg-[#05070A] border border-neutral-800 text-xs text-white outline-none focus:border-[#8B5CF6]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-300 mb-1">Target Destination URL (HTTP/HTTPS)</label>
                        <input type="url" value={adUrl} onChange={(e) => setAdUrl(e.target.value)} placeholder="https://webshield.ai/pro" className="w-full h-11 px-4 rounded-xl bg-[#05070A] border border-neutral-800 text-xs text-white outline-none focus:border-[#8B5CF6]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                        <input type="checkbox" checked={adEnabled} onChange={(e) => setAdEnabled(e.target.checked)} className="rounded bg-[#05070A] border-neutral-800" /> Enable AD Banner
                      </label>
                      <button type="submit" disabled={savingAd} className="ml-auto px-4 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-lg">
                        {savingAd ? 'Saving...' : 'Save Configuration'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 6. USER COMMENT RECEIVER */}
              {activeTab === 'comment_receiver' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">User Comment Receiver</h1>
                    <p className="text-xs text-neutral-400 mt-1">Review feedback and comments submitted from the WebShield AI Feedback center.</p>
                  </div>
                  <div className="space-y-3">
                    {commentsList.length > 0 ? (
                      commentsList.map((c) => {
                        const cid = c._id || c.id;
                        return (
                          <div key={cid} className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white">{c.name}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">({c.email})</span>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
                                {c.category}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-300 bg-[#05070A] p-3 rounded-xl border border-neutral-800/60">
                              "{c.message}"
                            </p>
                            <div className="flex justify-between items-center text-[10px] text-neutral-500">
                              <span>Submitted {new Date(c.createdAt || Date.now()).toLocaleDateString()}</span>
                              {c.reviewed ? (
                                <span className="text-emerald-400 font-semibold">Reviewed ✓</span>
                              ) : (
                                <button type="button" onClick={() => handleReviewComment(cid)} className="text-[#8B5CF6] hover:underline cursor-pointer">
                                  Mark as Reviewed ✓
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-10 text-center text-neutral-500 text-xs">
                        No user feedback yet.
                      </div>
                    )}
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