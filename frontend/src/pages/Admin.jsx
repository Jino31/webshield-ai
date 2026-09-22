import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { adminService } from '../services/adminService';

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
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Server,
  Menu,
  X,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';

/*
  IMPORTANT SECURITY NOTE:
  This password check acts as an additional frontend session gate.
  True administrative security and data authorization must be enforced 
  on the backend API endpoints using Firebase ID Tokens and Admin SDK verification.
*/
const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || 'CHANGE_THIS_ADMIN_PASSWORD';

const ADMIN_SESSION_KEY = 'webshield_admin_session';
const ADMIN_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

const AUTHORIZED_ADMIN_EMAILS = [
  'jino@webshield.ai',
  'admin@webshield.ai',
  'jeffrinjinos1@gmail.com'
];

export default function Admin() {
  const navigate = useNavigate();

  // ------------------------------------------------------------
  // Authentication & Authorization States
  // ------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ------------------------------------------------------------
  // Admin Password Gate States
  // ------------------------------------------------------------
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // ------------------------------------------------------------
  // Navigation & UI States
  // ------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // ------------------------------------------------------------
  // Telemetry & Data States
  // ------------------------------------------------------------
  const [stats, setStats] = useState(null);
  const [scans, setScans] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [threats, setThreats] = useState([]);
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);

  // ------------------------------------------------------------
  // Notifications State
  // ------------------------------------------------------------
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Critical Phishing Blocked',
      time: '5m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'ML Classifier Updated',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'High Traffic Alert',
      time: '3h ago',
      unread: false,
    },
  ]);

  // ============================================================
  // CHECK EXISTING ADMIN SESSION
  // ============================================================
  const checkAdminSession = useCallback(() => {
    try {
      const storedSession = sessionStorage.getItem(ADMIN_SESSION_KEY);

      if (!storedSession) {
        setAdminUnlocked(false);
        return false;
      }

      const session = JSON.parse(storedSession);

      if (!session?.unlockedAt) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setAdminUnlocked(false);
        return false;
      }

      const sessionAge = Date.now() - Number(session.unlockedAt);

      if (sessionAge >= ADMIN_SESSION_DURATION) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setAdminUnlocked(false);
        return false;
      }

      setAdminUnlocked(true);
      return true;
    } catch (error) {
      console.error('Invalid admin session:', error);
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setAdminUnlocked(false);
      return false;
    }
  }, []);

  // ============================================================
  // FIREBASE AUTH + STRICT ALLOWLIST AUTHORIZATION
  // ============================================================
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

      // Strict allowlist validation
      const authorized = AUTHORIZED_ADMIN_EMAILS.includes(email);

      if (!authorized) {
        setIsAdmin(false);
        setAdminUnlocked(false);
        setAuthLoading(false);
        return;
      }

      setIsAdmin(true);
      checkAdminSession();
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [checkAdminSession]);

  // ============================================================
  // ADMIN PASSWORD UNLOCK
  // ============================================================
  const handleAdminUnlock = (event) => {
    event.preventDefault();
    setPasswordError('');

    if (!password.trim()) {
      setPasswordError('Please enter the admin password.');
      return;
    }

    setUnlocking(true);

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        const session = {
          unlockedAt: Date.now(),
          email: currentUser?.email || '',
        };

        sessionStorage.setItem(
          ADMIN_SESSION_KEY,
          JSON.stringify(session)
        );

        setAdminUnlocked(true);
        setPassword('');
        setPasswordError('');
      } else {
        setPasswordError('Incorrect admin password.');
        setPassword('');
      }

      setUnlocking(false);
    }, 400);
  };

  // ============================================================
  // LOCK ADMIN PANEL
  // ============================================================
  const lockAdminPanel = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminUnlocked(false);
    setPassword('');
    setPasswordError('');
  }, []);

  // ============================================================
  // SESSION TIMEOUT LISTENER
  // ============================================================
  useEffect(() => {
    if (!adminUnlocked) return;

    const checkSession = () => {
      const valid = checkAdminSession();
      if (!valid) {
        setPasswordError(
          'Your admin session expired. Please authenticate again.'
        );
      }
    };

    const interval = setInterval(checkSession, 60 * 1000);
    return () => clearInterval(interval);
  }, [adminUnlocked, checkAdminSession]);

  // ============================================================
  // FETCH ADMIN TELEMETRY DATA
  // ============================================================
  const fetchAdminData = useCallback(async () => {
    if (!isAdmin || !adminUnlocked) return;

    setLoadingData(true);
    setErrorData(null);

    try {
      const [
        sData,
        scData,
        uData,
        tData,
        lData,
        hData,
      ] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getRecentScans(),
        adminService.getUsers(),
        adminService.getThreats(),
        adminService.getActivityLogs(),
        adminService.getSystemHealth(),
      ]);

      setStats(sData);
      setScans(Array.isArray(scData) ? scData : []);
      setUsersList(Array.isArray(uData) ? uData : []);
      setThreats(Array.isArray(tData) ? tData : []);
      setLogs(Array.isArray(lData) ? lData : []);
      setHealth(Array.isArray(hData) ? hData : []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setErrorData(
        'Unable to load security data. Please check the backend connection.'
      );
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin, adminUnlocked]);

  useEffect(() => {
    if (!isAdmin || !adminUnlocked) return;
    fetchAdminData();
  }, [isAdmin, adminUnlocked, fetchAdminData]);

  // ============================================================
  // SIGN OUT
  // ============================================================
  const handleSignOut = async () => {
    try {
      lockAdminPanel();
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // ============================================================
  // RENDER STATES (LOADING & EXPLICIT ACCESS GUARDS)
  // ============================================================
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#05070A] text-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-[#8B5CF6] animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Activity className="w-4 h-4 text-[#8B5CF6] animate-spin" />
            Verifying security clearance...
          </div>
        </div>
      </div>
    );
  }

  // If user is not logged in at all, show clear prompt or redirect
  if (!currentUser) {
    return (
      <div role="alert" className="min-h-screen bg-[#05070A] text-[#FAFAFA] flex flex-col items-center justify-center p-6">
        <div className="bg-[#0D1117] border border-neutral-800 p-8 rounded-3xl text-center shadow-2xl max-w-md w-full space-y-4">
          <div className="w-14 h-14 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-2xl flex items-center justify-center text-[#8B5CF6] mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white mb-1">Authentication Required</h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Please sign in with an authorized administrator account to access this area.
            </p>
          </div>
          <button 
            onClick={() => navigate('/login', { replace: true })}
            className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-lg shadow-purple-950/40"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If user is logged in but NOT on the allowlist, show an explicit Access Denied screen
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
              Logged in as <span className="text-white font-mono">{currentUser.email}</span>. Administrator privileges are required to access this area.
            </p>
          </div>
          <button 
            onClick={() => navigate('/', { replace: true })}
            className="w-full py-3 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
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
                <ShieldCheck className="w-3.5 h-3.5" />
                Protected Area
              </div>

              <h1 className="text-2xl font-bold tracking-tight">
                Admin Security Check
              </h1>

              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                Enter your administrator password to access the WebShield AI control center.
              </p>
            </div>

            <form onSubmit={handleAdminUnlock} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-medium text-neutral-300 mb-2"
                >
                  Administrator Password
                </label>

                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />

                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-[#05070A] border border-neutral-800 text-xs text-white placeholder:text-neutral-600 outline-none focus:border-[#8B5CF6] transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
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

              <button
                type="submit"
                disabled={unlocking}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white text-xs font-semibold transition shadow-lg shadow-purple-900/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {unlocking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Unlock Admin Panel
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-neutral-800 text-center">
              <p className="text-[10px] text-neutral-500">Signed in as</p>
              <p className="text-xs text-neutral-300 mt-1 truncate">{currentUser.email}</p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to WebShield AI
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // FULL ADMIN DASHBOARD INTERFACE
  // ============================================================
  return (
    <div className="min-h-screen w-full bg-[#05070A] text-[#FAFAFA] flex flex-col">
      {/* Header */}
      <header className="w-full h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-neutral-800/80 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="md:hidden p-2 rounded-xl bg-[#13111C] border border-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-white block">
              WebShield AI
            </span>
            <span className="hidden sm:block text-[9px] text-neutral-500 uppercase tracking-widest">
              Admin Control Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          {/* Notifications dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((value) => !value)}
              className="p-2.5 rounded-xl bg-[#13111C] border border-neutral-800 hover:border-[#8B5CF6]/30 text-neutral-300 hover:text-white transition relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.some((n) => n.unread) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EC4899] rounded-full" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-72 bg-[#0D1117] border border-neutral-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-xs font-semibold text-white">Security Notifications</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNotifications((items) =>
                        items.map((item) => ({ ...item, unread: false }))
                      )
                    }
                    className="text-[10px] text-[#8B5CF6] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-2.5 bg-[#05070A] border border-neutral-800/60 rounded-xl text-xs space-y-1"
                    >
                      <p className="font-medium text-white flex items-center justify-between gap-2">
                        {notification.title}
                        {notification.unread && (
                          <span className="w-1.5 h-1.5 bg-[#EC4899] rounded-full shrink-0" />
                        )}
                      </p>
                      <p className="text-[10px] text-neutral-400">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdown((value) => !value)}
              className="flex items-center gap-2 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 px-3.5 py-2 rounded-xl text-xs font-medium text-white transition cursor-pointer"
            >
              <span className="truncate max-w-[100px]">
                {currentUser.displayName || currentUser.email}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {profileDropdown && (
              <div className="absolute right-0 top-12 w-56 bg-[#0D1117] border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                  <p className="text-xs font-semibold text-white truncate">
                    {currentUser.displayName || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate">{currentUser.email}</p>
                </div>

                <button
                  type="button"
                  onClick={lockAdminPanel}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-400 hover:bg-amber-950/30 transition text-left cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Lock Admin Panel
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-10 md:hidden"
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`
            fixed md:relative z-20 inset-y-0 left-0
            w-64 bg-[#0D1117] border-r border-neutral-800/80
            p-4 flex flex-col gap-1
            transition-transform duration-300
            md:translate-x-0
            ${mobileMenuOpen ? 'translate-x-0 top-16' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="px-3 py-2 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
            Control Center
          </div>

          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'scans', label: 'URL Scans', icon: Globe },
            { id: 'threats', label: 'Threat Intelligence', icon: ShieldAlert },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'logs', label: 'Activity Logs', icon: Activity },
            { id: 'health', label: 'System Health', icon: Server },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#C4B5FD]'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="mt-auto p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-400">Admin Session Active</span>
            </div>
            <p className="text-[9px] text-neutral-500 mt-1">Session protected</p>
          </div>
        </aside>

        {/* Content Section */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
          {errorData ? (
            <div className="p-6 bg-rose-950/30 border border-rose-800/60 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
              <p className="text-xs font-semibold text-white">{errorData}</p>
              <button
                type="button"
                onClick={fetchAdminData}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs transition cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : loadingData ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400 text-xs gap-3">
              <RefreshCw className="w-5 h-5 text-[#8B5CF6] animate-spin" />
              Loading control center telemetry...
            </div>
          ) : (
            <>
              {/* Dashboard View */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Security Overview</h1>
                    <p className="text-xs text-neutral-400 mt-1">
                      Monitor platform activity, URL detection, threats, and system health.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Total Users</span>
                      <p className="text-2xl font-bold text-white">{stats?.totalUsers ?? 0}</p>
                      <span className="text-[10px] text-emerald-400 mt-2 inline-block">Active accounts</span>
                    </div>

                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Total URL Scans</span>
                      <p className="text-2xl font-bold text-[#8B5CF6]">{stats?.totalScans ?? 0}</p>
                      <span className="text-[10px] text-[#8B5CF6] mt-2 inline-block">
                        Detection rate: {stats?.detectionRate ?? 'N/A'}
                      </span>
                    </div>

                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Safe URLs</span>
                      <p className="text-2xl font-bold text-emerald-400">{stats?.safeUrls ?? 0}</p>
                      <span className="text-[10px] text-emerald-400 mt-2 inline-block">Verified clean</span>
                    </div>

                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Phishing Detected</span>
                      <p className="text-2xl font-bold text-rose-400">{stats?.phishingDetected ?? 0}</p>
                      <span className="text-[10px] text-rose-400 mt-2 inline-block">Detected threats</span>
                    </div>
                  </div>

                  {/* Recent Scans Table */}
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-wider">Recent Scans</h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('scans')}
                        className="text-xs text-neutral-400 hover:text-white transition cursor-pointer"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800 text-neutral-500">
                            <th className="pb-3 font-semibold uppercase tracking-wider">URL</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Result</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Risk</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60">
                          {scans.length > 0 ? (
                            scans.map((scan) => (
                              <tr key={scan.id} className="hover:bg-neutral-900/30 transition">
                                <td className="py-3 text-neutral-300 truncate max-w-xs">{scan.url}</td>
                                <td className="py-3 font-medium text-white">{scan.result}</td>
                                <td className="py-3">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                                      scan.risk === 'Critical'
                                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                                        : scan.risk === 'High'
                                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                    }`}
                                  >
                                    {scan.risk || 'Unknown'}
                                  </span>
                                </td>
                                <td className="py-3 text-neutral-400">{scan.time || '—'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="py-10 text-center text-neutral-500">
                                No recent scans available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Users View */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-xs text-neutral-400 mt-1">Manage platform accounts, roles, and activity.</p>
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
                            <th className="pb-3 font-semibold uppercase tracking-wider">Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60">
                          {usersList.length > 0 ? (
                            usersList.map((user) => (
                              <tr key={user.id} className="hover:bg-neutral-900/30 transition">
                                <td className="py-3">
                                  <p className="font-semibold text-white">{user.name}</p>
                                  <p className="text-[10px] text-neutral-400">{user.email}</p>
                                </td>
                                <td className="py-3 text-neutral-300">{user.role}</td>
                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {user.status}
                                  </span>
                                </td>
                                <td className="py-3 text-neutral-300">{user.scansCount ?? 0}</td>
                                <td className="py-3 text-neutral-400">{user.joined || '—'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="py-10 text-center text-neutral-500">No users available.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Scans View */}
              {activeTab === 'scans' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">URL Scan Telemetry</h1>
                    <p className="text-xs text-neutral-400 mt-1">Audit history of analyzed links and classification results.</p>
                  </div>
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800 text-neutral-500">
                            <th className="pb-3 font-semibold uppercase tracking-wider">Target URL</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Initiator</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Result</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Confidence</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60">
                          {scans.length > 0 ? (
                            scans.map((scan) => (
                              <tr key={scan.id} className="hover:bg-neutral-900/30 transition">
                                <td className="py-3 text-neutral-300 truncate max-w-sm">{scan.url}</td>
                                <td className="py-3 text-neutral-400">{scan.user || '—'}</td>
                                <td className="py-3 font-medium text-white">{scan.result || '—'}</td>
                                <td className="py-3 text-[#8B5CF6]">{scan.confidence || '—'}</td>
                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
                                    {scan.status || 'Processed'}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="py-10 text-center text-neutral-500">No scan telemetry available.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Threats View */}
              {activeTab === 'threats' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Threat Intelligence</h1>
                    <p className="text-xs text-neutral-400 mt-1">Review reported phishing threats and malicious indicators.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {threats.length > 0 ? (
                      threats.map((threat) => (
                        <div key={threat.id} className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <span className="font-mono text-xs font-bold text-white">{threat.domain}</span>
                            <p className="text-xs text-neutral-400">
                              Type: <span className="text-rose-400">{threat.type}</span> • Source: {threat.source}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              {threat.risk || 'Unknown'} Risk
                            </span>
                            <span className="text-xs font-mono text-[#8B5CF6]">{threat.confidence || '—'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-10 text-center text-neutral-500 text-xs">
                        No threat intelligence available.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Analytics View */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Security Analytics</h1>
                    <p className="text-xs text-neutral-400 mt-1">Platform activity and detection telemetry.</p>
                  </div>
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-8 text-center space-y-3">
                    <BarChart3 className="w-12 h-12 text-[#8B5CF6] mx-auto opacity-80" />
                    <h3 className="text-sm font-bold text-white">Analytics Engine Active</h3>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      Analytics data is synchronized with the backend service when available.
                    </p>
                  </div>
                </div>
              )}

              {/* Activity Logs View */}
              {activeTab === 'logs' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Audit Logs</h1>
                    <p className="text-xs text-neutral-400 mt-1">Administrative actions and security events.</p>
                  </div>
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg space-y-3">
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <div key={log.id} className="p-3 bg-[#05070A] border border-neutral-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                          <div>
                            <span className="text-[#8B5CF6] font-bold">[{log.action}]</span>{' '}
                            <span className="text-neutral-300">{log.actor}</span>{' '}
                            <span className="text-neutral-500">on</span>{' '}
                            <span className="text-neutral-400">{log.resource}</span>
                          </div>
                          <span className="text-neutral-500">{log.timestamp}</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center text-neutral-500 text-xs">No activity logs available.</div>
                    )}
                  </div>
                </div>
              )}

              {/* System Health View */}
              {activeTab === 'health' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Health & Services</h1>
                    <p className="text-xs text-neutral-400 mt-1">Service status and platform health information.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {health.length > 0 ? (
                      health.map((service, index) => (
                        <div key={service.id || index} className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-white">{service.service}</p>
                            <p className="text-[10px] text-neutral-400">
                              Latency: {service.latency || '—'} | Uptime: {service.uptime || '—'}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3" />
                            {service.status || 'Unknown'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-10 text-center text-neutral-500 text-xs">
                        No system health information available.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Settings View */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin & Detection Settings</h1>
                    <p className="text-xs text-neutral-400 mt-1">Review administrator and detection configuration.</p>
                  </div>
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-800">
                      <div>
                        <p className="text-xs font-semibold text-white">Strict Phishing Block Mode</p>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Automatically quarantine links according to configured backend thresholds.
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] text-xs rounded-xl font-medium">
                        Enabled
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-white">Admin Session Timeout</p>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Frontend admin session expires after 30 minutes of inactivity.
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-xl font-medium">
                        30 Minutes
                      </span>
                    </div>

                    <div className="pt-4 border-t border-neutral-800">
                      <button
                        type="button"
                        onClick={lockAdminPanel}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        Lock Admin Panel Now
                      </button>
                    </div>
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