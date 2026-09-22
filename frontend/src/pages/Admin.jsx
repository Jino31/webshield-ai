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
  IMPORTANT SECURITY NOTE

  This password is NOT a secure production secret because React code
  is delivered to the browser.

  For production:
  - Use Firebase Custom Claims or backend authorization.
  - Verify the admin role on every protected API request.
  - Never store a real admin password in frontend source code.

  This value is only being used as an additional frontend gate/session layer.
*/
const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || 'CHANGE_THIS_ADMIN_PASSWORD';

const ADMIN_SESSION_KEY = 'webshield_admin_session';
const ADMIN_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

const AUTHORIZED_ADMIN_EMAILS = [
  'jino@webshield.ai',
  'admin@webshield.ai',
];

export default function Admin() {
  const navigate = useNavigate();

  // ------------------------------------------------------------
  // Authentication
  // ------------------------------------------------------------

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ------------------------------------------------------------
  // Admin Password
  // ------------------------------------------------------------

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // ------------------------------------------------------------
  // Navigation
  // ------------------------------------------------------------

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // ------------------------------------------------------------
  // Data
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
  // Notifications
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
  // FIREBASE AUTH + ADMIN AUTHORIZATION
  // ============================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUser(null);
        setIsAdmin(false);
        setAdminUnlocked(false);
        setAuthLoading(false);

        navigate('/login', { replace: true });
        return;
      }

      const email = user.email?.toLowerCase().trim();

      setCurrentUser(user);

      /*
        IMPORTANT FIX:

        Only explicitly authorized admin emails can enter
        the admin area.

        DO NOT use:

        user.email?.includes('admin')

        because that is not a secure authorization check.
      */
      const authorized = AUTHORIZED_ADMIN_EMAILS.includes(email);

      if (!authorized) {
        setIsAdmin(false);
        setAdminUnlocked(false);
        setAuthLoading(false);

        navigate('/', { replace: true });
        return;
      }

      setIsAdmin(true);

      // Check whether the current browser session has
      // already passed the admin password gate.
      checkAdminSession();

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, checkAdminSession]);

  // ============================================================
  // ADMIN PASSWORD LOGIN
  // ============================================================

  const handleAdminUnlock = (event) => {
    event.preventDefault();

    setPasswordError('');

    if (!password.trim()) {
      setPasswordError('Please enter the admin password.');
      return;
    }

    setUnlocking(true);

    // Small delay for a more natural authentication UX.
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
  // SESSION TIMEOUT
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
  // FETCH ADMIN DATA
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

  // ============================================================
  // LOAD DATA AFTER ADMIN UNLOCK
  // ============================================================

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
  // AUTH LOADING
  // ============================================================

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#05070A] text-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-violet-400 animate-pulse" />
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Activity className="w-4 h-4 text-violet-400 animate-spin" />
            Verifying security clearance...
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // NO USER
  // ============================================================

  if (!currentUser) {
    return null;
  }

  // ============================================================
  // NOT ADMIN
  // ============================================================

  if (!isAdmin) {
    return null;
  }

  // ============================================================
  // ADMIN PASSWORD LOCK SCREEN
  // ============================================================

  if (!adminUnlocked) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative">
          <div className="bg-[#0D1117]/95 backdrop-blur-xl border border-neutral-800 rounded-3xl shadow-2xl p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center">
                <Lock className="w-7 h-7 text-violet-400" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-semibold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                Protected Area
              </div>

              <h1 className="text-2xl font-bold tracking-tight">
                Admin Security Check
              </h1>

              <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                Enter your administrator password to access the WebShield AI
                control center.
              </p>
            </div>

            {/* Password Form */}
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
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-[#05070A] border border-neutral-800 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-300">
                    {passwordError}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={unlocking}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white text-sm font-semibold transition shadow-lg shadow-violet-900/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            {/* Current user */}
            <div className="mt-6 pt-5 border-t border-neutral-800 text-center">
              <p className="text-[10px] text-neutral-500">
                Signed in as
              </p>

              <p className="text-xs text-neutral-300 mt-1 truncate">
                {currentUser.email}
              </p>
            </div>

            {/* Back */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500 hover:text-white transition"
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
  // ADMIN DASHBOARD
  // ============================================================

  return (
    <div className="min-h-screen w-full bg-[#05070A] text-[#FAFAFA] flex flex-col">
      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="w-full h-16 bg-[#0D1117]/95 backdrop-blur-xl border-b border-neutral-800/80 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="md:hidden p-2 rounded-xl bg-[#13111C] border border-neutral-800 text-neutral-300 hover:text-white transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
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
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setNotificationsOpen((value) => !value)
              }
              className="p-2.5 rounded-xl bg-[#13111C] border border-neutral-800 hover:border-violet-500/30 text-neutral-300 hover:text-white transition relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />

              {notifications.some((n) => n.unread) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-72 bg-[#0D1117] border border-neutral-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-xs font-semibold text-white">
                    Security Notifications
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setNotifications((items) =>
                        items.map((item) => ({
                          ...item,
                          unread: false,
                        }))
                      )
                    }
                    className="text-[10px] text-violet-400 hover:underline"
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
                          <span className="w-1.5 h-1.5 bg-pink-500 rounded-full shrink-0" />
                        )}
                      </p>

                      <p className="text-[10px] text-neutral-400">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setProfileDropdown((value) => !value)
              }
              className="flex items-center gap-2 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 px-3.5 py-2 rounded-xl text-xs font-medium text-white transition"
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

                  <p className="text-[10px] text-neutral-400 truncate">
                    {currentUser.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={lockAdminPanel}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-400 hover:bg-amber-950/30 transition text-left"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Lock Admin Panel
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          MAIN LAYOUT
      ======================================================== */}

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-10 md:hidden"
          />
        )}

        {/* Sidebar */}
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
            {
              id: 'dashboard',
              label: 'Dashboard',
              icon: LayoutDashboard,
            },
            {
              id: 'users',
              label: 'Users',
              icon: Users,
            },
            {
              id: 'scans',
              label: 'URL Scans',
              icon: Globe,
            },
            {
              id: 'threats',
              label: 'Threat Intelligence',
              icon: ShieldAlert,
            },
            {
              id: 'analytics',
              label: 'Analytics',
              icon: BarChart3,
            },
            {
              id: 'logs',
              label: 'Activity Logs',
              icon: Activity,
            },
            {
              id: 'health',
              label: 'System Health',
              icon: Server,
            },
            {
              id: 'settings',
              label: 'Settings',
              icon: Settings,
            },
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
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition text-left ${
                  isActive
                    ? 'bg-violet-500/10 border border-violet-500/30 text-violet-400'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Sidebar security status */}
          <div className="mt-auto p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />

              <span className="text-[10px] font-medium text-emerald-400">
                Admin Session Active
              </span>
            </div>

            <p className="text-[9px] text-neutral-500 mt-1">
              Session protected
            </p>
          </div>
        </aside>

        {/* ======================================================
            CONTENT
        ====================================================== */}

        <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
          {errorData ? (
            <div className="p-6 bg-rose-950/30 border border-rose-800/60 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-400" />

              <p className="text-sm font-semibold text-white">
                {errorData}
              </p>

              <button
                type="button"
                onClick={fetchAdminData}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs transition"
              >
                Try Again
              </button>
            </div>
          ) : loadingData ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400 text-xs gap-3">
              <RefreshCw className="w-5 h-5 text-violet-400 animate-spin" />
              Loading control center telemetry...
            </div>
          ) : (
            <>
              {/* ==================================================
                  DASHBOARD
              ================================================== */}

              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      Security Overview
                    </h1>

                    <p className="text-xs text-neutral-400 mt-1">
                      Monitor platform activity, URL detection,
                      threats, and system health.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
                        Total Users
                      </span>

                      <p className="text-2xl font-bold text-white">
                        {stats?.totalUsers ?? 0}
                      </p>

                      <span className="text-[10px] text-emerald-400 mt-2 inline-block">
                        Active accounts
                      </span>
                    </div>

                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
                        Total URL Scans
                      </span>

                      <p className="text-2xl font-bold text-violet-400">
                        {stats?.totalScans ?? 0}
                      </p>

                      <span className="text-[10px] text-violet-400 mt-2 inline-block">
                        Detection rate:{' '}
                        {stats?.detectionRate ?? 'N/A'}
                      </span>
                    </div>

                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
                        Safe URLs
                      </span>

                      <p className="text-2xl font-bold text-emerald-400">
                        {stats?.safeUrls ?? 0}
                      </p>

                      <span className="text-[10px] text-emerald-400 mt-2 inline-block">
                        Verified clean
                      </span>
                    </div>

                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
                        Phishing Detected
                      </span>

                      <p className="text-2xl font-bold text-rose-400">
                        {stats?.phishingDetected ?? 0}
                      </p>

                      <span className="text-[10px] text-rose-400 mt-2 inline-block">
                        Detected threats
                      </span>
                    </div>
                  </div>

                  {/* Recent scans */}
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                        Recent Scans
                      </h3>

                      <button
                        type="button"
                        onClick={() => setActiveTab('scans')}
                        className="text-xs text-neutral-400 hover:text-white transition"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800 text-neutral-500">
                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              URL
                            </th>

                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Result
                            </th>

                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Risk
                            </th>

                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Time
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-800/60">
                          {scans.length > 0 ? (
                            scans.map((scan) => (
                              <tr
                                key={scan.id}
                                className="hover:bg-neutral-900/30 transition"
                              >
                                <td className="py-3 text-neutral-300 truncate max-w-xs">
                                  {scan.url}
                                </td>

                                <td className="py-3 font-medium text-white">
                                  {scan.result}
                                </td>

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

                                <td className="py-3 text-neutral-400">
                                  {scan.time || '—'}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="4"
                                className="py-10 text-center text-neutral-500"
                              >
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

              {/* ==================================================
                  USERS
              ================================================== */}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      User Management
                    </h1>

                    <p className="text-xs text-neutral-400 mt-1">
                      Manage platform accounts, roles, and activity.
                    </p>
                  </div>

                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800 text-neutral-500">
                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              User
                            </th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Role
                            </th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Status
                            </th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Scans
                            </th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Joined
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-800/60">
                          {usersList.length > 0 ? (
                            usersList.map((user) => (
                              <tr
                                key={user.id}
                                className="hover:bg-neutral-900/30 transition"
                              >
                                <td className="py-3">
                                  <p className="font-semibold text-white">
                                    {user.name}
                                  </p>

                                  <p className="text-[10px] text-neutral-400">
                                    {user.email}
                                  </p>
                                </td>

                                <td className="py-3 text-neutral-300">
                                  {user.role}
                                </td>

                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {user.status}
                                  </span>
                                </td>

                                <td className="py-3 text-neutral-300">
                                  {user.scansCount ?? 0}
                                </td>

                                <td className="py-3 text-neutral-400">
                                  {user.joined || '—'}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="5"
                                className="py-10 text-center text-neutral-500"
                              >
                                No users available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================
                  SCANS
              ================================================== */}

              {activeTab === 'scans' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      URL Scan Telemetry
                    </h1>

                    <p className="text-xs text-neutral-400 mt-1">
                      Audit history of analyzed links and classification
                      results.
                    </p>
                  </div>

                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800 text-neutral-500">
                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Target URL
                            </th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Initiator
                            </th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Result
                            </th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Confidence
                            </th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-800/60">
                          {scans.length > 0 ? (
                            scans.map((scan) => (
                              <tr
                                key={scan.id}
                                className="hover:bg-neutral-900/30 transition"
                              >
                                <td className="py-3 text-neutral-300 truncate max-w-sm">
                                  {scan.url}
                                </td>

                                <td className="py-3 text-neutral-400">
                                  {scan.user || '—'}
                                </td>

                                <td className="py-3 font-medium text-white">
                                  {scan.result || '—'}
                                </td>

                                <td className="py-3 text-violet-400">
                                  {scan.confidence || '—'}
                                </td>

                                <td className="py-3">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                    {scan.status || 'Processed'}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="5"
                                className="py-10 text-center text-neutral-500"
                              >
                                No scan telemetry available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================
                  THREATS
              ================================================== */}

              {activeTab === 'threats' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      Threat Intelligence
                    </h1>

                    <p className="text-xs text-neutral-400 mt-1">
                      Review reported phishing threats and malicious
                      indicators.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {threats.length > 0 ? (
                      threats.map((threat) => (
                        <div
                          key={threat.id}
                          className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <span className="font-mono text-sm font-bold text-white">
                              {threat.domain}
                            </span>

                            <p className="text-xs text-neutral-400">
                              Type:{' '}
                              <span className="text-rose-400">
                                {threat.type}
                              </span>{' '}
                              • Source: {threat.source}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              {threat.risk || 'Unknown'} Risk
                            </span>

                            <span className="text-xs font-mono text-violet-400">
                              {threat.confidence || '—'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-10 text-center text-neutral-500 text-sm">
                        No threat intelligence available.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================================================
                  ANALYTICS
              ================================================== */}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      Security Analytics
                    </h1>

                    <p className="text-xs text-neutral-400 mt-1">
                      Platform activity and detection telemetry.
                    </p>
                  </div>

                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-8 text-center space-y-3">
                    <BarChart3 className="w-12 h-12 text-violet-400 mx-auto opacity-80" />

                    <h3 className="text-base font-bold text-white">
                      Analytics Engine Active
                    </h3>

                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      Analytics data is synchronized with the backend
                      service when available.
                    </p>
                  </div>
                </div>
              )}

              {/* ==================================================
                  LOGS
              ================================================== */}

              {activeTab === 'logs' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      Admin Audit Logs
                    </h1>

                    <p className="text-xs text-neutral-400 mt-1">
                      Administrative actions and security events.
                    </p>
                  </div>

                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg space-y-3">
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3 bg-[#05070A] border border-neutral-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="text-violet-400 font-bold">
                              [{log.action}]
                            </span>{' '}
                            <span className="text-neutral-300">
                              {log.actor}
                            </span>{' '}
                            <span className="text-neutral-500">
                              on
                            </span>{' '}
                            <span className="text-neutral-400">
                              {log.resource}
                            </span>
                          </div>

                          <span className="text-neutral-500">
                            {log.timestamp}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center text-neutral-500 text-sm">
                        No activity logs available.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================================================
                  SYSTEM HEALTH
              ================================================== */}

              {activeTab === 'health' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      System Health & Services
                    </h1>

                    <p className="text-xs text-neutral-400 mt-1">
                      Service status and platform health information.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {health.length > 0 ? (
                      health.map((service, index) => (
                        <div
                          key={service.id || index}
                          className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 flex items-center justify-between"
                        >
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-white">
                              {service.service}
                            </p>

                            <p className="text-[10px] text-neutral-400">
                              Latency: {service.latency || '—'} |
                              Uptime: {service.uptime || '—'}
                            </p>
                          </div>

                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3" />
                            {service.status || 'Unknown'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-10 text-center text-neutral-500 text-sm">
                        No system health information available.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================================================
                  SETTINGS
              ================================================== */}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      Admin & Detection Settings
                    </h1>

                    <p className="text-xs text-neutral-400 mt-1">
                      Review administrator and detection configuration.
                    </p>
                  </div>

                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-800">
                      <div>
                        <p className="text-xs font-semibold text-white">
                          Strict Phishing Block Mode
                        </p>

                        <p className="text-[10px] text-neutral-400 mt-1">
                          Automatically quarantine links according to
                          configured backend thresholds.
                        </p>
                      </div>

                      <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs rounded-xl font-medium">
                        Enabled
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-white">
                          Admin Session Timeout
                        </p>

                        <p className="text-[10px] text-neutral-400 mt-1">
                          Frontend admin session expires after 30
                          minutes.
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
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition"
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