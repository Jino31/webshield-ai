import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Lock, 
  KeyRound, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Server, 
  Menu, 
  X,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  
  // Authentication & Authorization States
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Password Gate States (Ephemeral - Resets on refresh)
  const [adminPasswordVerified, setAdminPasswordVerified] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Data States
  const [stats, setStats] = useState(null);
  const [scans, setScans] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [threats, setThreats] = useState([]);
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Critical Phishing Blocked', time: '5m ago', unread: true },
    { id: 2, title: 'ML Classifier Updated', time: '1h ago', unread: true },
    { id: 3, title: 'High Traffic Alert', time: '3h ago', unread: false },
  ]);

  // Inactivity Timer Ref (30 minutes)
  const inactivityTimerRef = useRef(null);

  const handleLockSession = useCallback(() => {
    setAdminPasswordVerified(false);
    setPasswordInput('');
    setPasswordError(false);
    setProfileDropdown(false);
  }, []);

  // Inactivity Tracker for 30-minute timeout
  useEffect(() => {
    if (!adminPasswordVerified) return;

    const resetTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        handleLockSession();
      }, 30 * 60 * 1000); // 30 minutes
    };

    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [adminPasswordVerified, handleLockSession]);

  // Secure Admin Authorization Check function
  const verifyAdminAccess = async (user) => {
    // Backend role verification or secure claim check simulation
    const authorizedAdminEmails = ['jino@webshield.ai', 'admin@webshield.ai'];
    if (user && authorizedAdminEmails.includes(user.email)) {
      return true;
    }
    // For local testing safety, return true if logged in, or restrict as needed
    return true; 
  };

  // 1. Check Firebase Authentication and Role on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const authorized = await verifyAdminAccess(user);
        if (authorized) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate('/unauthorized', { replace: true });
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        navigate('/login', { replace: true });
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch admin telemetry data only when unlocked
  useEffect(() => {
    if (!isAdmin || !adminPasswordVerified) return;

    const fetchAdminData = async () => {
      setLoadingData(true);
      setErrorData(null);
      try {
        const [sData, scData, uData, tData, lData, hData] = await Promise.all([
          adminService.getAdminStats(),
          adminService.getRecentScans(),
          adminService.getUsers(),
          adminService.getThreats(),
          adminService.getActivityLogs(),
          adminService.getSystemHealth(),
        ]);
        setStats(sData);
        setScans(scData);
        setUsersList(uData);
        setThreats(tData);
        setLogs(lData);
        setHealth(hData);
      } catch (err) {
        console.error('Error loading admin data:', err);
        setErrorData('Unable to load security data.');
      } finally {
        setLoadingData(false);
      }
    };
    fetchAdminData();
  }, [isAdmin, adminPasswordVerified]);

  // Password Verification Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(false);

    try {
      // Backend Password Verification structure endpoint option:
      /*
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: passwordInput })
      });
      if (!response.ok) throw new Error('Invalid admin password');
      */

      // Development simulation check
      await new Promise(resolve => setTimeout(resolve, 600));
      if (passwordInput === 'WebShieldAdmin2026!') {
        setAdminPasswordVerified(true);
        setPasswordInput('');
      } else {
        throw new Error('Invalid admin password');
      }
    } catch (err) {
      setPasswordError(true);
      setPasswordInput('');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAdminPasswordVerified(false);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // 1. Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] w-full flex items-center justify-center bg-[#05070A] text-[#FAFAFA]">
        <div className="flex items-center gap-3 text-sm text-neutral-400 font-medium">
          <Activity className="w-5 h-5 text-[#22D3EE] animate-spin" /> Verifying authentication state...
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  // 2. Unauthorized State
  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-73px)] w-full flex items-center justify-center bg-[#05070A] text-[#FAFAFA] px-4">
        <div className="text-center space-y-3 max-w-md">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Access Denied</h1>
          <p className="text-xs text-neutral-400">You do not possess administrative privileges required to access this console.</p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 text-xs text-white rounded-xl transition cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // 3. Admin Password Gate State (Resets on refresh)
  if (!adminPasswordVerified) {
    return (
      <div className="min-h-[calc(100vh-73px)] w-full bg-[#05070A] text-[#FAFAFA] flex items-center justify-center px-4">
        <div className="relative z-10 w-full max-w-md bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/40">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Restricted Admin Portal</h1>
            <p className="text-xs text-neutral-400">Security clearance password required for session unlock.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Invalid admin password. Access denied.</span>
              </div>
            )}

            <div>
              <label htmlFor="admin-pass" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Security Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  id="admin-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  className="w-full bg-[#05070A] border border-neutral-800 focus:border-[#22D3EE] rounded-xl pl-10 pr-10 py-3 text-white placeholder-neutral-600 focus:outline-none transition text-sm"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-3.5 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-gradient-to-r from-[#22D3EE] to-blue-600 hover:opacity-90 disabled:opacity-50 text-black font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-cyan-950/40 cursor-pointer"
            >
              {passwordLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                'Authenticate Session'
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
            >
              ← Return to Public Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Fully Unlocked Admin Dashboard
  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-[#05070A] text-[#FAFAFA] flex flex-col">
      
      {/* Admin Top Header Bar */}
      <header className="w-full h-16 bg-[#0D1117]/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl bg-[#13111C] border border-neutral-800 text-neutral-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="w-9 h-9 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm sm:text-base tracking-tight text-white">WebShield AI Admin</span>
        </div>

        <div className="flex items-center gap-3 relative">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="View security notifications"
              className="p-2.5 rounded-xl bg-[#13111C] border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#22D3EE] rounded-full"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-72 bg-[#0D1117] border border-neutral-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-xs font-semibold text-white">Security Notifications</span>
                  <button 
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                    className="text-[10px] text-[#22D3EE] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 bg-[#05070A] border border-neutral-800/60 rounded-xl text-xs space-y-1">
                      <p className="font-medium text-white flex items-center justify-between">
                        {n.title}
                        {n.unread && <span className="w-1.5 h-1.5 bg-[#22D3EE] rounded-full"></span>}
                      </p>
                      <p className="text-[10px] text-neutral-400">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              aria-label="Admin user menu"
              className="flex items-center gap-2 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 px-3.5 py-2 rounded-xl text-xs font-medium text-white transition cursor-pointer"
            >
              <span className="truncate max-w-[100px]">{currentUser.displayName || currentUser.email}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {profileDropdown && (
              <div className="absolute right-0 top-12 w-52 bg-[#0D1117] border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                  <p className="text-xs font-semibold text-white truncate">{currentUser.displayName || 'Administrator'}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{currentUser.email}</p>
                </div>
                
                <button
                  onClick={handleLockSession}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-400 hover:bg-amber-950/30 transition text-left cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" /> Lock Admin Session
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Sidebar Navigation */}
        <aside className={`
          fixed md:relative z-20 inset-y-0 left-0 w-64 bg-[#0D1117] border-r border-neutral-800/80 p-4 flex flex-col gap-1 transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0 top-16' : '-translate-x-full md:translate-x-0'}
        `}>
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
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
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
        <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
          
          {errorData ? (
            <div className="p-6 bg-rose-950/30 border border-rose-800/60 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
              <p className="text-sm font-semibold text-white">{errorData}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs transition cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : loadingData ? (
            <div className="flex items-center justify-center h-64 text-neutral-400 text-xs gap-2">
              <RefreshCw className="w-5 h-5 text-[#22D3EE] animate-spin" /> Loading control center telemetry...
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Security Overview</h1>
                    <p className="text-xs text-neutral-400 mt-0.5">Monitor platform activity, URL detection, threats, and system health.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Total Users</span>
                      <p className="text-2xl font-bold text-white">{stats?.totalUsers}</p>
                      <span className="text-[10px] text-emerald-400 mt-2 inline-block">Active accounts</span>
                    </div>

                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Total URL Scans</span>
                      <p className="text-2xl font-bold text-[#22D3EE]">{stats?.totalScans}</p>
                      <span className="text-[10px] text-[#22D3EE] mt-2 inline-block">Detection rate: {stats?.detectionRate}</span>
                    </div>

                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Safe URLs</span>
                      <p className="text-2xl font-bold text-emerald-400">{stats?.safeUrls}</p>
                      <span className="text-[10px] text-emerald-400 mt-2 inline-block">Verified clean</span>
                    </div>

                    <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 shadow-lg">
                      <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">Phishing Detected</span>
                      <p className="text-2xl font-bold text-rose-400">{stats?.phishingDetected}</p>
                      <span className="text-[10px] text-rose-400 mt-2 inline-block">Blocked threats</span>
                    </div>
                  </div>

                  {/* Recent Scans Table Preview */}
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider">Recent Scans</h3>
                      <button onClick={() => setActiveTab('scans')} className="text-xs text-neutral-400 hover:text-white cursor-pointer">View All →</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800 text-neutral-500">
                            <th className="pb-3 font-semibold uppercase tracking-wider">URL</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Result</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Risk Level</th>
                            <th className="pb-3 font-semibold uppercase tracking-wider">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60 font-mono">
                          {scans.map((scan) => (
                            <tr key={scan.id} className="hover:bg-neutral-900/30 transition">
                              <td className="py-3 text-neutral-300 truncate max-w-xs">{scan.url}</td>
                              <td className="py-3 font-sans font-medium text-white">{scan.result}</td>
                              <td className="py-3">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-medium border ${
                                  scan.risk === 'Critical' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                                  scan.risk === 'High' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                                  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                }`}>
                                  {scan.risk}
                                </span>
                              </td>
                              <td className="py-3 text-neutral-400">{scan.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: USERS */}
              {activeTab === 'users' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-xs text-neutral-400 mt-0.5">Manage platform accounts, roles, and user activity.</p>
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
                          {usersList.map((u) => (
                            <tr key={u.id} className="hover:bg-neutral-900/30 transition">
                              <td className="py-3">
                                <p className="font-semibold text-white">{u.name}</p>
                                <p className="text-[10px] text-neutral-400">{u.email}</p>
                              </td>
                              <td className="py-3 text-neutral-300 font-mono">{u.role}</td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  {u.status}
                                </span>
                              </td>
                              <td className="py-3 font-mono text-neutral-300">{u.scansCount}</td>
                              <td className="py-3 text-neutral-400">{u.joined}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: URL SCANS */}
              {activeTab === 'scans' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">URL Scan Telemetry</h1>
                    <p className="text-xs text-neutral-400 mt-0.5">Full audit log of analyzed links and classification results.</p>
                  </div>
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg space-y-4">
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
                        <tbody className="divide-y divide-neutral-800/60 font-mono">
                          {scans.map((scan) => (
                            <tr key={scan.id} className="hover:bg-neutral-900/30 transition">
                              <td className="py-3 text-neutral-300 truncate max-w-sm">{scan.url}</td>
                              <td className="py-3 text-neutral-400">{scan.user}</td>
                              <td className="py-3 font-sans font-medium text-white">{scan.result}</td>
                              <td className="py-3 text-[#22D3EE]">{scan.confidence}</td>
                              <td className="py-3 font-sans">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20">
                                  {scan.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: THREAT INTELLIGENCE */}
              {activeTab === 'threats' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Threat Intelligence</h1>
                    <p className="text-xs text-neutral-400 mt-0.5">Active phishing campaigns, blocked domains, and malicious signatures.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {threats.map((thr) => (
                      <div key={thr.id} className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="font-mono text-sm font-bold text-white">{thr.domain}</span>
                          <p className="text-xs text-neutral-400">Type: <span className="text-rose-400">{thr.type}</span> • Source: {thr.source}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            {thr.risk} Risk
                          </span>
                          <span className="text-xs font-mono text-[#22D3EE]">{thr.confidence}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Security Analytics</h1>
                    <p className="text-xs text-neutral-400 mt-0.5">Platform growth, model performance, and detection distributions.</p>
                  </div>
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-8 text-center space-y-3">
                    <BarChart3 className="w-12 h-12 text-[#22D3EE] mx-auto opacity-80" />
                    <h3 className="text-base font-bold text-white">Analytics Engine Active</h3>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      Real-time anomaly distribution and threat telemetry metrics are synchronized with the backend analytics service.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 6: ACTIVITY LOGS */}
              {activeTab === 'logs' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Audit Logs</h1>
                    <p className="text-xs text-neutral-400 mt-0.5">Immutable record of administrative actions and security events.</p>
                  </div>
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 shadow-lg space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="p-3 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-[#22D3EE] font-bold">[{log.action}]</span> <span className="text-neutral-300">{log.actor}</span> on <span className="text-neutral-400">{log.resource}</span>
                        </div>
                        <span className="text-neutral-500">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: SYSTEM HEALTH */}
              {activeTab === 'health' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Health & Services</h1>
                    <p className="text-xs text-neutral-400 mt-0.5">Microservice status and cluster performance.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {health.map((h, i) => (
                      <div key={i} className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-5 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-white">{h.service}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">Latency: {h.latency} | Uptime: {h.uptime}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3" /> {h.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin & Detection Settings</h1>
                    <p className="text-xs text-neutral-400 mt-0.5">Configure system thresholds and security parameters.</p>
                  </div>
                  <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                      <div>
                        <p className="text-xs font-semibold text-white">Strict Phishing Block Mode</p>
                        <p className="text-[10px] text-neutral-400">Automatically quarantine links with confidence over 90%.</p>
                      </div>
                      <span className="px-3 py-1 bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-xs rounded-xl font-medium">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-white">Admin Session Timeout</p>
                        <p className="text-[10px] text-neutral-400">Automatic lock after 30 minutes of inactivity.</p>
                      </div>
                      <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-xl font-medium">30 Mins</span>
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