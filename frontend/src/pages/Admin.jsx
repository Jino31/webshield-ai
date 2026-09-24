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
  Activity,
  Terminal,
  ShieldAlert,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  Database,
  Trash2,
  UserPlus,
  Download,
  ExternalLink,
  Image as ImageIcon,
  X,
  Cpu,
  Layers,
  Check,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Key-gated unlock & session persistence bug fixed here
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(() => adminService.isSessionActive());
  const [unlocking, setUnlocking] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);

  // Active Tab & Controls
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSyncedTime, setLastSyncedTime] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Telemetry Datasets
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [scamReports, setScamReports] = useState([]);
  const [scansList, setScansList] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [commentsList, setCommentsList] = useState([]);
  const [announcementsList, setAnnouncementsList] = useState([]);

  // Filter States
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [scamStatusFilter, setScamStatusFilter] = useState('all');
  const [scamSeverityFilter, setScamSeverityFilter] = useState('all');
  const [scanStatusFilter, setScanStatusFilter] = useState('all');

  // Modals & Dynamic Overlays
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('User');
  const [newUserStatus, setNewUserStatus] = useState('Active');
  const [savingUser, setSavingUser] = useState(false);

  const [evidencePreview, setEvidencePreview] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Quick Action Forms
  const [quickScanUrl, setQuickScanUrl] = useState('');
  const [quickScanning, setQuickScanning] = useState(false);
  const [quickScanResult, setQuickScanResult] = useState(null);

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

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  }, []);

  // Firebase auth validation
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

  // Unlock handler with cryptographic tunnel sequence
  const handleUnlock = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!password.trim()) {
      setPasswordError('Administrative security key is required.');
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
      }, 2000);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Invalid cryptographic key. Access denied.');
      setPassword('');
      setUnlocking(false);
    }
  };

  const handleLockConsole = () => {
    adminService.lockSession();
    setAdminUnlocked(false);
    showToast('Admin session terminated & vault locked.');
  };

  // Central Fullstack Data Synchronizer
  const fetchAllData = useCallback(async (isSilent = false) => {
    if (!adminUnlocked) return;
    if (!isSilent) setIsRefreshing(true);
    setErrorData(null);

    try {
      const [statsRes, healthRes] = await Promise.all([
        adminService.getAdminStats().catch(() => null),
        adminService.getSystemHealth().catch(() => null)
      ]);

      if (statsRes) setStats(statsRes);
      if (healthRes) setHealthData(healthRes);

      const [usersRes, scamRes, scansRes, commentsRes, annRes, adRes] = await Promise.all([
        adminService.getUsers().catch(() => []),
        adminService.getScamReports().catch(() => []),
        adminService.getScans({ limit: 100 }).catch(() => []),
        adminService.getComments().catch(() => []),
        adminService.getAnnouncements().catch(() => []),
        adminService.getAdConfig().catch(() => null)
      ]);

      setUsersList(usersRes);
      setScamReports(scamRes);
      setScansList(scansRes);
      setCommentsList(commentsRes);
      setAnnouncementsList(annRes);

      if (adRes) {
        setAdLabel(adRes.label || '');
        setAdUrl(adRes.url || '');
        setAdEnabled(adRes.enabled ?? true);
      }

      setLastSyncedTime(new Date().toLocaleTimeString());
      setLoadingData(false);
    } catch (err) {
      console.error('Error fetching admin telemetry:', err);
      setErrorData('Telemetry stream disconnected from cluster nodes.');
      setLoadingData(false);
    } finally {
      if (!isSilent) setIsRefreshing(false);
    }
  }, [adminUnlocked]);

  // Initial load and live 15s polling
  useEffect(() => {
    if (adminUnlocked) {
      fetchAllData();
      const interval = setInterval(() => {
        fetchAllData(true);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [adminUnlocked, fetchAllData]);

  // Filtered Collections
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchesSearch = !searchQuery ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = userRoleFilter === 'all' || u.role?.toLowerCase() === userRoleFilter.toLowerCase();
      const matchesStatus = userStatusFilter === 'all' || u.status?.toLowerCase() === userStatusFilter.toLowerCase();
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersList, searchQuery, userRoleFilter, userStatusFilter]);

  const filteredScamReports = useMemo(() => {
    return scamReports.filter(r => {
      const matchesSearch = !searchQuery ||
        r.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.targetedBrand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.url?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        scamStatusFilter === 'all' ||
        (scamStatusFilter === 'verified' && r.verified) ||
        (scamStatusFilter === 'pending' && !r.verified);
      const matchesSeverity = scamSeverityFilter === 'all' || r.severity?.toLowerCase() === scamSeverityFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [scamReports, searchQuery, scamStatusFilter, scamSeverityFilter]);

  const filteredScans = useMemo(() => {
    return scansList.filter(s => {
      const matchesSearch = !searchQuery || s.url?.toLowerCase().includes(searchQuery.toLowerCase()) || s.status?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = scanStatusFilter === 'all' || s.status?.toLowerCase().includes(scanStatusFilter.toLowerCase());
      return matchesSearch && matchesStatus;
    });
  }, [scansList, searchQuery, scanStatusFilter]);

  const filteredComments = useMemo(() => {
    return commentsList.filter(c => {
      return !searchQuery ||
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [commentsList, searchQuery]);

  // MUTATION HANDLERS
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserEmail.trim()) {
      showToast('User email is required.');
      return;
    }
    setSavingUser(true);
    try {
      await adminService.createUser({
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        status: newUserStatus
      });
      showToast(`User ${newUserEmail} created.`);
      setShowAddUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      fetchAllData(true);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create user account.');
    } finally {
      setSavingUser(false);
    }
  };

  const handleUpdateUserRole = async (id, role) => {
    try {
      await adminService.updateUserRole(id, role);
      showToast(`Role updated to ${role}.`);
      setUsersList(prev => prev.map(u => (u._id === id || u.id === id) ? { ...u, role } : u));
    } catch {
      showToast('Failed to update role.');
    }
  };

  const handleUpdateUserStatus = async (id, status) => {
    try {
      await adminService.updateUserStatus(id, status);
      showToast(`Status updated to ${status}.`);
      setUsersList(prev => prev.map(u => (u._id === id || u.id === id) ? { ...u, status } : u));
    } catch {
      showToast('Failed to update account status.');
    }
  };

  const handleToggleScamVerify = async (report) => {
    const id = report._id || report.id;
    const newStatus = !report.verified;
    try {
      await adminService.verifyScamReport(id, newStatus);
      showToast(newStatus ? 'Report verified & active in ML risk scoring.' : 'Report marked as unverified.');
      setScamReports(prev => prev.map(r => ((r._id === id || r.id === id) ? { ...r, verified: newStatus } : r)));
      fetchAllData(true);
    } catch {
      showToast('Failed to update report status.');
    }
  };

  const handleUpdateScamSeverity = async (id, severity) => {
    try {
      await adminService.updateScamReportSeverity(id, severity);
      showToast(`Report severity updated to ${severity}.`);
      setScamReports(prev => prev.map(r => ((r._id === id || r.id === id) ? { ...r, severity } : r)));
    } catch {
      showToast('Failed to update severity.');
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id, name } = deleteConfirm;
    try {
      if (type === 'user') {
        await adminService.deleteUser(id);
        setUsersList(prev => prev.filter(u => (u._id || u.id) !== id));
        showToast(`User account ${name} deleted.`);
      } else if (type === 'scamReport') {
        await adminService.deleteScamReport(id);
        setScamReports(prev => prev.filter(r => (r._id || r.id) !== id));
        showToast('Scam report permanently deleted.');
      } else if (type === 'scan') {
        await adminService.deleteScan(id);
        setScansList(prev => prev.filter(s => (s._id || s.id) !== id));
        showToast('Scan log entry removed.');
      } else if (type === 'announcement') {
        await adminService.deleteAnnouncement(id);
        setAnnouncementsList(prev => prev.filter(a => (a._id || a.id) !== id));
        showToast('Announcement broadcast deleted.');
      } else if (type === 'comment') {
        await adminService.deleteComment(id);
        setCommentsList(prev => prev.filter(c => (c._id || c.id) !== id));
        showToast('Feedback ticket deleted.');
      }
      fetchAllData(true);
    } catch (err) {
      showToast(`Failed to delete ${type}: ${err.message}`);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleQuickScan = async (e) => {
    e.preventDefault();
    if (!quickScanUrl.trim()) return;
    setQuickScanning(true);
    setQuickScanResult(null);
    try {
      const res = await adminService.triggerQuickScan(quickScanUrl.trim());
      setQuickScanResult(res.data);
      showToast(`Quick Scan complete: ${res.data?.status || 'Completed'}`);
      fetchAllData(true);
    } catch (err) {
      showToast(err.response?.data?.error || 'Quick Scan failed. Ensure ML service is active.');
    } finally {
      setQuickScanning(false);
    }
  };

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) {
      showToast('Title and message are required.');
      return;
    }
    setPublishingAnn(true);
    try {
      await adminService.createAnnouncement({ title: annTitle, message: annMessage });
      showToast('Global platform announcement published.');
      setAnnTitle('');
      setAnnMessage('');
      fetchAllData(true);
    } catch {
      showToast('Failed to publish announcement.');
    } finally {
      setPublishingAnn(false);
    }
  };

  const handleSaveAdConfig = async (e) => {
    e.preventDefault();
    setSavingAd(true);
    try {
      await adminService.updateAdConfig({ label: adLabel, url: adUrl, enabled: adEnabled });
      showToast('Promotional banner config published.');
    } catch {
      showToast('Failed to update ad config.');
    } finally {
      setSavingAd(false);
    }
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#0A0A0F] flex flex-col items-center justify-center text-[#FAFAFA] text-xs z-50 font-mono">
        <RefreshCw className="w-5 h-5 animate-spin text-[#8B5CF6] mb-3" />
        <span className="tracking-widest uppercase text-[#8B5CF6]">Verifying Security Credentials...</span>
      </div>
    );
  }

  // Welcome Animation
  if (showWelcomeAnimation) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#0A0A0F] text-[#FAFAFA] flex flex-col items-center justify-center z-50 overflow-hidden font-mono">
        <div className="absolute w-[600px] h-[600px] bg-[#8B5CF6]/15 rounded-full blur-[160px] animate-pulse pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center p-10 rounded-3xl bg-[#13111C] border border-[#8B5CF6]/40 shadow-2xl backdrop-blur-2xl animate-scaleUp">
          <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] mb-5 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <ShieldCheck className="w-9 h-9 animate-pulse" />
          </div>
          <h1 className="text-xl font-extrabold tracking-wider uppercase text-[#FAFAFA] mb-1">
            WebShield SecOps Console
          </h1>
          <p className="text-[11px] text-[#EC4899] tracking-[0.25em] uppercase font-bold">
            Authenticated // Secure Cluster Link Established
          </p>
          <div className="w-52 h-1.5 bg-[#231E33] rounded-full overflow-hidden mt-6">
            <div className="w-full h-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-indigo-500 animate-[shimmer_1.2s_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  // Key-Gated Unlock Screen (Fixed Bug: Always displays when session is locked)
  if (!adminUnlocked) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#0A0A0F] text-[#FAFAFA] flex items-center justify-center p-4 relative z-50 font-sans">
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#13111C] border border-[#231E33] text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#8B5CF6]/50 transition cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#8B5CF6]" /> Portal Home
          </button>
        </div>

        <div className="w-full max-w-md relative z-10 animate-scaleUp">
          <div className="bg-[#13111C] border border-[#231E33] rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-[#1A1528] text-[#EC4899] border border-[#231E33]">
                SOC-2 SECURE
              </span>
            </div>

            <div className="mb-6">
              <h1 className="text-xl font-bold tracking-tight text-[#FAFAFA]">Administrator Access</h1>
              <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed">
                Provide administrative security keys to authenticate your session with the WebShield cluster.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] mb-1.5 font-semibold">
                  Administrator Key
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter security key"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#0A0A0F] border border-[#231E33] text-xs text-[#FAFAFA] placeholder:text-[#A1A1AA]/50 outline-none focus:border-[#8B5CF6] transition font-mono shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#FAFAFA] transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {passwordError}
                </div>
              )}

              <button
                type="submit"
                disabled={unlocking}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-[#FAFAFA] font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-950/40 disabled:opacity-50"
              >
                {unlocking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Authenticate SOC Session
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0A0A0F] text-[#FAFAFA] font-sans selection:bg-[#8B5CF6] selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#13111C] border border-[#8B5CF6]/50 text-[#FAFAFA] px-4 py-3 rounded-2xl shadow-2xl text-xs flex items-center gap-3 animate-fadeIn font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {toast}
        </div>
      )}

      {/* Top Command Bar */}
      <header className="w-full h-16 border-b border-[#231E33] px-4 sm:px-6 flex items-center justify-between z-35 sticky top-0 bg-[#0A0A0F]/95 backdrop-blur-xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#231E33] bg-[#13111C] hover:bg-[#1A1528] text-xs font-medium text-[#FAFAFA] hover:border-[#8B5CF6] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#8B5CF6]" /> Portal
          </button>
          <div className="h-4 w-[1px] bg-[#231E33] hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] animate-pulse shadow-[0_0_10px_#8B5CF6]" />
            <span className="font-mono text-xs font-bold tracking-wider uppercase hidden sm:inline-block text-[#FAFAFA]">
              WebShield SOC // Central Command
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          {lastSyncedTime && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-mono text-[#A1A1AA] bg-[#13111C] px-3 py-1 rounded-xl border border-[#231E33]">
              <Clock className="w-3 h-3 text-[#8B5CF6]" /> Synced: {lastSyncedTime}
            </span>
          )}

          <button
            onClick={() => fetchAllData(false)}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-[#231E33] bg-[#13111C] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#8B5CF6] transition cursor-pointer"
            title="Force Synchronize Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#8B5CF6]' : ''}`} />
          </button>

          <button
            onClick={handleLockConsole}
            className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition cursor-pointer font-mono"
            title="Lock Console"
          >
            <Lock className="w-3.5 h-3.5" /> Lock
          </button>

          <button
            onClick={() => signOut(auth).then(() => navigate('/'))}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer font-mono"
            title="Terminate Session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main SOC Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 border-r border-[#231E33] p-4 flex flex-col gap-1.5 shrink-0 bg-[#0A0A0F]">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA] font-bold flex items-center justify-between">
            <span>SOC Consoles</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">LIVE</span>
          </div>

          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
            {
              id: 'scam-reports',
              label: 'Scam Moderation',
              icon: ShieldAlert,
              badge: stats?.pendingScamReports > 0 ? stats.pendingScamReports : null,
              badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            },
            {
              id: 'scans',
              label: 'Threat Intel & Scans',
              icon: Terminal,
              badge: stats?.totalScans ?? null,
              badgeColor: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30'
            },
            {
              id: 'users',
              label: 'User Directory',
              icon: Users,
              badge: stats?.totalUsers ?? null,
              badgeColor: 'bg-pink-500/10 text-[#EC4899] border border-pink-500/30'
            },
            { id: 'announcements', label: 'Broadcasts', icon: Megaphone },
            {
              id: 'feedback',
              label: 'Feedback Inbox',
              icon: MessageSquareText,
              badge: stats?.pendingFeedback > 0 ? stats.pendingFeedback : null,
              badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            },
            { id: 'diagnostics', label: 'Cluster Diagnostics', icon: SlidersHorizontal }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1528] border border-[#8B5CF6]/40 text-[#FAFAFA] font-semibold shadow-md translate-x-1'
                    : 'text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#13111C] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'}`} />
                  <span className="truncate">{tab.label}</span>
                </div>
                {tab.badge !== null && tab.badge !== undefined && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-auto pt-4 border-t border-[#231E33] space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA] px-3">
              Export SOC Data
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => adminService.exportToCSV('webshield_users', usersList)}
                className="px-2.5 py-1.5 rounded-lg bg-[#13111C] border border-[#231E33] text-[10px] font-mono text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#8B5CF6] flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <Download className="w-3 h-3 text-[#8B5CF6]" /> Users CSV
              </button>
              <button
                onClick={() => adminService.exportToCSV('webshield_scans', scansList)}
                className="px-2.5 py-1.5 rounded-lg bg-[#13111C] border border-[#231E33] text-[10px] font-mono text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#EC4899] flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <Download className="w-3 h-3 text-[#EC4899]" /> Scans CSV
              </button>
            </div>
          </div>
        </aside>

        {/* Content Console Container */}
        <main className="flex-1 p-5 md:p-8 space-y-6 overflow-y-auto max-w-7xl animate-fadeIn">
          {loadingData && !stats ? (
            <div className="flex flex-col items-center justify-center h-80 text-xs font-mono text-[#A1A1AA]">
              <RefreshCw className="w-6 h-6 animate-spin text-[#8B5CF6] mb-3" />
              <span>Establishing high-throughput metrics stream...</span>
            </div>
          ) : errorData ? (
            <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs text-center font-mono flex items-center justify-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>{errorData}</span>
              <button onClick={() => fetchAllData(false)} className="px-3 py-1 bg-rose-500/20 rounded-lg text-rose-200 hover:bg-rose-500/30 transition">
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              {/* ============================================================== */}
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {/* ============================================================== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-extrabold tracking-tight text-[#FAFAFA]">System Telemetry & SOC Overview</h1>
                      <p className="text-xs text-[#A1A1AA] mt-1">
                        Real-time threat feeds, user activity, and ML classification telemetry.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-medium flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 animate-pulse" /> 15s Heartbeat Active
                      </span>
                    </div>
                  </div>

                  {/* 4 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-[#231E33] bg-[#13111C] rounded-2xl p-5 shadow-xl">
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">Registered Accounts</span>
                        <Users className="w-4 h-4 text-[#8B5CF6]" />
                      </div>
                      <p className="text-3xl font-extrabold tracking-tight mt-3 text-[#FAFAFA]">{stats?.totalUsers ?? 0}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                        <span className="text-emerald-400">{stats?.activeUsers ?? 0} Active</span>
                        <span>{stats?.totalUsers - (stats?.activeUsers ?? 0)} Inactive</span>
                      </div>
                    </div>

                    <div className="border border-[#231E33] bg-[#13111C] rounded-2xl p-5 shadow-xl">
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">Total URL Scans</span>
                        <Database className="w-4 h-4 text-[#8B5CF6]" />
                      </div>
                      <p className="text-3xl font-extrabold tracking-tight text-[#8B5CF6] mt-3">{stats?.totalScans ?? 0}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                        <span className="text-emerald-400">{stats?.safeUrls ?? 0} Safe</span>
                        <span className="text-rose-400">{stats?.phishingDetected ?? 0} Threats</span>
                      </div>
                    </div>

                    <div className="border border-[#231E33] bg-[#13111C] rounded-2xl p-5 shadow-xl">
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">Scam Reports</span>
                        <ShieldAlert className="w-4 h-4 text-[#EC4899]" />
                      </div>
                      <p className="text-3xl font-extrabold tracking-tight text-[#EC4899] mt-3">{stats?.totalScamReports ?? 0}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-emerald-400">{stats?.verifiedScamReports ?? 0} Verified</span>
                        <span className="text-amber-400">{stats?.pendingScamReports ?? 0} Pending</span>
                      </div>
                    </div>

                    <div className="border border-[#231E33] bg-[#13111C] rounded-2xl p-5 shadow-xl">
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">Threat Detection Rate</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-3xl font-extrabold tracking-tight text-emerald-400 mt-3">{stats?.detectionRate ?? '0%'}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                        <span>Cluster: Healthy</span>
                        <span className="text-[#8B5CF6]">ML v2 Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action SOC Command Bar */}
                  <div className="border border-[#231E33] bg-[#13111C] rounded-2xl p-5 shadow-xl">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-3 font-bold flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> Quick Operations
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => { setActiveTab('scans'); setSearchQuery(''); }}
                        className="p-3.5 rounded-xl bg-[#0A0A0F] border border-[#231E33] hover:border-[#8B5CF6]/50 text-left transition cursor-pointer group"
                      >
                        <p className="text-xs font-bold text-[#FAFAFA] group-hover:text-[#8B5CF6] flex items-center justify-between">
                          Execute Rapid Scan <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
                        </p>
                        <p className="text-[11px] text-[#A1A1AA] mt-1 font-sans">Run a domain directly through Python ML model</p>
                      </button>

                      <button
                        onClick={() => { setActiveTab('scam-reports'); setScamStatusFilter('pending'); }}
                        className="p-3.5 rounded-xl bg-[#0A0A0F] border border-[#231E33] hover:border-[#EC4899]/50 text-left transition cursor-pointer group"
                      >
                        <p className="text-xs font-bold text-[#FAFAFA] group-hover:text-[#EC4899] flex items-center justify-between">
                          Review Pending Scams <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
                        </p>
                        <p className="text-[11px] text-[#A1A1AA] mt-1 font-sans">
                          {stats?.pendingScamReports || 0} user submissions waiting for moderation
                        </p>
                      </button>

                      <button
                        onClick={() => { setActiveTab('announcements'); }}
                        className="p-3.5 rounded-xl bg-[#0A0A0F] border border-[#231E33] hover:border-[#8B5CF6]/50 text-left transition cursor-pointer group"
                      >
                        <p className="text-xs font-bold text-[#FAFAFA] group-hover:text-[#8B5CF6] flex items-center justify-between">
                          Dispatch Broadcast <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA]" />
                        </p>
                        <p className="text-[11px] text-[#A1A1AA] mt-1 font-sans">Publish an alert to all WebShield users</p>
                      </button>
                    </div>
                  </div>

                  {/* Dual Column */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border border-[#231E33] bg-[#13111C] rounded-2xl p-5 space-y-3 shadow-xl">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[#FAFAFA] font-bold flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-[#EC4899]" /> Live Threat Activity
                        </h3>
                        <button
                          onClick={() => setActiveTab('scam-reports')}
                          className="text-[11px] font-mono text-[#8B5CF6] hover:underline cursor-pointer"
                        >
                          View All →
                        </button>
                      </div>

                      <div className="divide-y divide-[#231E33]">
                        {scamReports.slice(0, 5).map(report => (
                          <div key={report._id || report.id} className="py-2.5 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-[#FAFAFA] font-mono">{report.domain}</p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#A1A1AA] font-sans">
                                <span>{report.category}</span>
                                <span>•</span>
                                <span>{report.targetedBrand || 'Unspecified'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                                report.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                report.severity === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {report.severity || 'high'}
                              </span>
                              {report.verified ? (
                                <span className="text-emerald-400 text-xs" title="Verified">✓</span>
                              ) : (
                                <span className="text-amber-400 text-[10px] font-mono">Pending</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {scamReports.length === 0 && (
                          <p className="py-4 text-xs text-[#A1A1AA] text-center font-mono">No threat reports logged yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="border border-[#231E33] bg-[#13111C] rounded-2xl p-5 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[#FAFAFA] font-bold flex items-center gap-2">
                          <Server className="w-4 h-4 text-[#8B5CF6]" /> Cluster Node Status
                        </h3>
                        <button
                          onClick={() => setActiveTab('diagnostics')}
                          className="text-[11px] font-mono text-[#8B5CF6] hover:underline cursor-pointer"
                        >
                          Full Diagnostics →
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {healthData?.health ? healthData.health.map((h, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0A0A0F] border border-[#231E33]">
                            <div>
                              <p className="text-xs font-semibold text-[#FAFAFA]">{h.service}</p>
                              <p className="text-[10px] font-mono text-[#A1A1AA]">Latency: {h.latency} • Uptime: {h.uptime}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {h.status}
                            </span>
                          </div>
                        )) : (
                          <p className="text-xs text-[#A1A1AA] font-mono">Querying cluster nodes...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: SCAM REPORTS MODERATION HUB */}
              {/* ============================================================== */}
              {activeTab === 'scam-reports' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-extrabold tracking-tight text-[#FAFAFA]">Scam Reports Moderation Hub</h1>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">
                        Verify, classify, or remove user-submitted threat reports synced with MongoDB.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => adminService.exportToJSON('webshield_scam_reports', scamReports)}
                        className="px-3 py-2 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] text-xs font-mono hover:bg-[#8B5CF6]/30 flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Export JSON
                      </button>
                    </div>
                  </div>

                  {/* Filters Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2 relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by domain, brand, category, URL..."
                        className="w-full h-10 pl-10 pr-4 bg-[#13111C] border border-[#231E33] rounded-xl text-xs text-[#FAFAFA] placeholder:text-[#A1A1AA]/50 outline-none focus:border-[#8B5CF6] transition font-mono"
                      />
                    </div>

                    <div>
                      <select
                        value={scamStatusFilter}
                        onChange={(e) => setScamStatusFilter(e.target.value)}
                        className="w-full h-10 px-3 bg-[#13111C] border border-[#231E33] rounded-xl text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6] transition cursor-pointer"
                      >
                        <option value="all">Status: All Reports</option>
                        <option value="pending">Status: Pending Review</option>
                        <option value="verified">Status: Verified Only</option>
                      </select>
                    </div>

                    <div>
                      <select
                        value={scamSeverityFilter}
                        onChange={(e) => setScamSeverityFilter(e.target.value)}
                        className="w-full h-10 px-3 bg-[#13111C] border border-[#231E33] rounded-xl text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6] transition cursor-pointer"
                      >
                        <option value="all">Severity: All Levels</option>
                        <option value="critical">Severity: Critical</option>
                        <option value="high">Severity: High</option>
                        <option value="medium">Severity: Medium</option>
                        <option value="low">Severity: Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Scam Reports Table */}
                  <div className="border border-[#231E33] bg-[#13111C] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0A0A0F] border-b border-[#231E33] text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                          <tr>
                            <th className="px-5 py-3.5">Threat Domain & URL</th>
                            <th className="px-5 py-3.5">Target / Category</th>
                            <th className="px-5 py-3.5">Severity</th>
                            <th className="px-5 py-3.5">Vector</th>
                            <th className="px-5 py-3.5">Verification</th>
                            <th className="px-5 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#231E33]">
                          {filteredScamReports.length > 0 ? filteredScamReports.map(report => (
                            <tr key={report._id || report.id} className="hover:bg-[#1A1528]/50 transition">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#FAFAFA] font-mono">{report.domain}</span>
                                  {report.evidenceImage && (
                                    <button
                                      onClick={() => setEvidencePreview(report.evidenceImage)}
                                      className="p-1 rounded bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30 cursor-pointer"
                                      title="View Screenshot Evidence"
                                    >
                                      <ImageIcon className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#A1A1AA] truncate max-w-xs mt-0.5">{report.url}</p>
                                {report.description && (
                                  <p className="text-[10px] text-[#A1A1AA]/70 mt-1 italic truncate max-w-sm">"{report.description}"</p>
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
                                  {report.category}
                                </span>
                                {report.targetedBrand && (
                                  <p className="text-[11px] text-[#FAFAFA] font-mono mt-1">Brand: {report.targetedBrand}</p>
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <select
                                  value={report.severity || 'high'}
                                  onChange={(e) => handleUpdateScamSeverity(report._id || report.id, e.target.value)}
                                  className="h-8 px-2 rounded-lg bg-[#0A0A0F] border border-[#231E33] text-[10px] font-mono text-[#FAFAFA] outline-none focus:border-[#8B5CF6] cursor-pointer"
                                >
                                  <option value="critical">Critical</option>
                                  <option value="high">High</option>
                                  <option value="medium">Medium</option>
                                  <option value="low">Low</option>
                                </select>
                              </td>

                              <td className="px-5 py-4 font-mono text-[11px] text-[#A1A1AA]">
                                {report.deliveryVector || 'web'}
                              </td>

                              <td className="px-5 py-4">
                                <button
                                  onClick={() => handleToggleScamVerify(report)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition ${
                                    report.verified
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                                  }`}
                                >
                                  {report.verified ? <><Check className="w-3 h-3" /> Verified</> : <><Clock className="w-3 h-3" /> Pending</>}
                                </button>
                              </td>

                              <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {report.proofUrl && (
                                    <a
                                      href={report.proofUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-2 rounded-lg bg-[#0A0A0F] border border-[#231E33] text-[#A1A1AA] hover:text-[#FAFAFA] transition"
                                      title="Open External Proof"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                  <button
                                    onClick={() => setDeleteConfirm({ type: 'scamReport', id: report._id || report.id, name: report.domain })}
                                    className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                                    title="Delete Report"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="6" className="px-5 py-12 text-center text-[#A1A1AA] font-mono text-xs">
                                No scam reports matching active filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: THREAT INTEL & SCAN AUDIT LOGS */}
              {/* ============================================================== */}
              {activeTab === 'scans' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-extrabold tracking-tight text-[#FAFAFA]">Threat Intelligence & Scan Audit</h1>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">
                        Inspect historical ML classifications and run immediate server-side URL probes.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adminService.exportToCSV('webshield_scans', scansList)}
                        className="px-3 py-2 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] text-xs font-mono hover:bg-[#8B5CF6]/30 flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Download className="w-3.5 h-3.5" /> Export Scans CSV
                      </button>
                    </div>
                  </div>

                  {/* Rapid URL Scan Console */}
                  <form onSubmit={handleQuickScan} className="border border-[#231E33] bg-[#13111C] rounded-2xl p-5 shadow-xl">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-2 font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#8B5CF6]" /> Admin Rapid Probe
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="text"
                        value={quickScanUrl}
                        onChange={(e) => setQuickScanUrl(e.target.value)}
                        placeholder="Enter URL to analyze (e.g., https://paypal-security-alert.xyz)..."
                        className="flex-1 h-11 px-4 bg-[#0A0A0F] border border-[#231E33] rounded-xl text-xs text-[#FAFAFA] placeholder:text-[#A1A1AA]/50 outline-none focus:border-[#8B5CF6] transition font-mono"
                      />
                      <button
                        type="submit"
                        disabled={quickScanning}
                        className="px-5 h-11 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-[#FAFAFA] font-semibold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 shadow-lg shadow-purple-950/40"
                      >
                        {quickScanning ? <><RefreshCw className="w-4 h-4 animate-spin" /> Scanning...</> : 'Analyze with ML'}
                      </button>
                    </div>

                    {quickScanResult && (
                      <div className="mt-4 p-4 rounded-xl bg-[#0A0A0F] border border-[#8B5CF6]/40 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                        <div>
                          <span className="text-[#A1A1AA]">Target: </span>
                          <span className="font-bold text-[#FAFAFA]">{quickScanResult.url}</span>
                          <div className="flex items-center gap-3 mt-1 text-[11px]">
                            <span>Verdict: <strong className={quickScanResult.status === 'Safe' ? 'text-emerald-400' : 'text-rose-400'}>{quickScanResult.status}</strong></span>
                            <span>Risk Score: <strong className="text-[#8B5CF6]">{quickScanResult.risk?.score ?? 'N/A'}/100</strong></span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuickScanResult(null)}
                          className="text-[#A1A1AA] hover:text-[#FAFAFA] text-xs cursor-pointer"
                        >
                          Dismiss ✕
                        </button>
                      </div>
                    )}
                  </form>

                  {/* Scans Filter & Table */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search scan logs by URL or classification..."
                        className="w-full h-10 pl-10 pr-4 bg-[#13111C] border border-[#231E33] rounded-xl text-xs text-[#FAFAFA] placeholder:text-[#A1A1AA]/50 outline-none focus:border-[#8B5CF6] transition font-mono"
                      />
                    </div>
                    <select
                      value={scanStatusFilter}
                      onChange={(e) => setScanStatusFilter(e.target.value)}
                      className="h-10 px-3 bg-[#13111C] border border-[#231E33] rounded-xl text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6] transition cursor-pointer"
                    >
                      <option value="all">Status: All Scans</option>
                      <option value="safe">Safe Only</option>
                      <option value="phishing">Phishing Detected</option>
                      <option value="suspicious">Suspicious</option>
                    </select>
                  </div>

                  <div className="border border-[#231E33] bg-[#13111C] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0A0A0F] border-b border-[#231E33] text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                          <tr>
                            <th className="px-5 py-3.5">Scanned Target URL</th>
                            <th className="px-5 py-3.5">Classification Verdict</th>
                            <th className="px-5 py-3.5">Risk Score</th>
                            <th className="px-5 py-3.5">Analyzed Timestamp</th>
                            <th className="px-5 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#231E33] font-mono">
                          {filteredScans.length > 0 ? filteredScans.map(scan => (
                            <tr key={scan._id || scan.id} className="hover:bg-[#1A1528]/50 transition">
                              <td className="px-5 py-3.5 max-w-sm truncate text-[#FAFAFA]">
                                {scan.url}
                              </td>
                              <td className="px-5 py-3.5">
                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                                  scan.status?.toLowerCase().includes('phishing') || scan.status?.toLowerCase().includes('danger')
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                    : scan.status?.toLowerCase().includes('safe')
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                }`}>
                                  {scan.status || 'Scanned'}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 bg-[#0A0A0F] rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        (scan.riskScore ?? 0) > 60 ? 'bg-rose-500' :
                                        (scan.riskScore ?? 0) > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${Math.min(100, scan.riskScore ?? 50)}%` }}
                                    />
                                  </div>
                                  <span className="text-[11px] text-[#A1A1AA]">{scan.riskScore ?? '—'}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-[#A1A1AA] text-[11px]">
                                {scan.createdAt ? new Date(scan.createdAt).toLocaleString() : 'N/A'}
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <button
                                  onClick={() => setDeleteConfirm({ type: 'scan', id: scan._id || scan.id, name: scan.url })}
                                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                                  title="Delete Log Entry"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="5" className="px-5 py-12 text-center text-[#A1A1AA] font-mono text-xs">
                                No scan audit logs found matching query.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: USER DIRECTORY & ACCESS CONTROL */}
              {/* ============================================================== */}
              {activeTab === 'users' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-extrabold tracking-tight text-[#FAFAFA]">Active User Directory</h1>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">
                        Manage user roles, privileges, and account states stored in MongoDB.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAddUserModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-[#FAFAFA] font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-950/40"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Add User
                      </button>
                      <button
                        onClick={() => adminService.exportToCSV('webshield_users', usersList)}
                        className="px-3 py-2 rounded-xl bg-[#13111C] border border-[#231E33] text-[#A1A1AA] text-xs font-mono hover:text-[#FAFAFA] flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <Download className="w-3.5 h-3.5" /> CSV
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full h-10 pl-10 pr-4 bg-[#13111C] border border-[#231E33] rounded-xl text-xs text-[#FAFAFA] placeholder:text-[#A1A1AA]/50 outline-none focus:border-[#8B5CF6] transition"
                      />
                    </div>

                    <div>
                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="w-full h-10 px-3 bg-[#13111C] border border-[#231E33] rounded-xl text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6] transition cursor-pointer"
                      >
                        <option value="all">Role: All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="analyst">Analyst</option>
                        <option value="moderator">Moderator</option>
                        <option value="user">User</option>
                      </select>
                    </div>

                    <div>
                      <select
                        value={userStatusFilter}
                        onChange={(e) => setUserStatusFilter(e.target.value)}
                        className="w-full h-10 px-3 bg-[#13111C] border border-[#231E33] rounded-xl text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6] transition cursor-pointer"
                      >
                        <option value="all">Status: All Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="suspended">Suspended Only</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="border border-[#231E33] bg-[#13111C] rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0A0A0F] border-b border-[#231E33] text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                          <tr>
                            <th className="px-5 py-3.5">User Identity</th>
                            <th className="px-5 py-3.5">Access Role</th>
                            <th className="px-5 py-3.5">Account Status</th>
                            <th className="px-5 py-3.5">Registration Date</th>
                            <th className="px-5 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#231E33] font-medium">
                          {filteredUsers.length > 0 ? filteredUsers.map(u => (
                            <tr key={u._id || u.id} className="hover:bg-[#1A1528]/50 transition">
                              <td className="px-5 py-4">
                                <p className="font-bold text-[#FAFAFA]">{u.name}</p>
                                <p className="text-[11px] text-[#A1A1AA] font-mono mt-0.5">{u.email}</p>
                              </td>

                              <td className="px-5 py-4">
                                <select
                                  value={u.role || 'User'}
                                  onChange={(e) => handleUpdateUserRole(u._id || u.id, e.target.value)}
                                  className="h-8 px-2.5 rounded-lg bg-[#0A0A0F] border border-[#231E33] text-[11px] font-mono text-[#8B5CF6] outline-none focus:border-[#8B5CF6] cursor-pointer"
                                >
                                  <option value="User">User</option>
                                  <option value="Analyst">Analyst</option>
                                  <option value="Moderator">Moderator</option>
                                  <option value="Admin">Admin</option>
                                </select>
                              </td>

                              <td className="px-5 py-4">
                                <select
                                  value={u.status || 'Active'}
                                  onChange={(e) => handleUpdateUserStatus(u._id || u.id, e.target.value)}
                                  className={`h-8 px-2.5 rounded-lg bg-[#0A0A0F] border border-[#231E33] text-[11px] font-mono outline-none focus:border-[#8B5CF6] cursor-pointer ${
                                    u.status === 'Active' ? 'text-emerald-400' :
                                    u.status === 'Suspended' ? 'text-amber-400' : 'text-rose-400'
                                  }`}
                                >
                                  <option value="Active">Active</option>
                                  <option value="Suspended">Suspended</option>
                                  <option value="Banned">Banned</option>
                                </select>
                              </td>

                              <td className="px-5 py-4 font-mono text-[#A1A1AA] text-[11px]">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                              </td>

                              <td className="px-5 py-4 text-right">
                                <button
                                  onClick={() => setDeleteConfirm({ type: 'user', id: u._id || u.id, name: u.email })}
                                  className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="5" className="px-5 py-12 text-center text-[#A1A1AA] font-mono text-xs">
                                No user accounts match query.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 5: BROADCASTS & ANNOUNCEMENTS */}
              {/* ============================================================== */}
              {activeTab === 'announcements' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-[#FAFAFA]">Global Broadcasts & Announcements</h1>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">
                      Transmit security alerts, update bulletins, or maintenance advisories to all users.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <form onSubmit={handlePublishAnnouncement} className="border border-[#231E33] bg-[#13111C] rounded-2xl p-6 space-y-4 shadow-xl">
                      <h2 className="text-xs font-mono uppercase tracking-wider text-[#FAFAFA] font-bold flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-[#8B5CF6]" /> Compose New Alert
                      </h2>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                          Broadcast Headline
                        </label>
                        <input
                          type="text"
                          value={annTitle}
                          onChange={e => setAnnTitle(e.target.value)}
                          placeholder="e.g., Critical Phishing Wave Targeting Banking Portals"
                          className="w-full h-11 px-4 rounded-xl bg-[#0A0A0F] border border-[#231E33] text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                          Broadcast Body
                        </label>
                        <textarea
                          rows="4"
                          value={annMessage}
                          onChange={e => setAnnMessage(e.target.value)}
                          placeholder="Provide details and user instructions..."
                          className="w-full p-4 rounded-xl bg-[#0A0A0F] border border-[#231E33] text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6] transition resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={publishingAnn}
                        className="px-5 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-[#FAFAFA] font-semibold text-xs rounded-xl shadow-lg shadow-purple-950/40 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                      >
                        {publishingAnn ? <><RefreshCw className="w-4 h-4 animate-spin" /> Publishing...</> : <><Send className="w-4 h-4" /> Publish Broadcast</>}
                      </button>
                    </form>

                    <div className="border border-[#231E33] bg-[#13111C] rounded-2xl p-6 space-y-3 shadow-xl">
                      <h2 className="text-xs font-mono uppercase tracking-wider text-[#FAFAFA] font-bold">
                        Broadcast History ({announcementsList.length})
                      </h2>
                      <div className="divide-y divide-[#231E33] max-h-96 overflow-y-auto">
                        {announcementsList.length > 0 ? announcementsList.map(ann => (
                          <div key={ann._id || ann.id} className="py-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold text-[#FAFAFA]">{ann.title}</p>
                              <p className="text-[11px] text-[#A1A1AA] mt-1 leading-relaxed">{ann.message}</p>
                              <p className="text-[10px] font-mono text-[#A1A1AA]/60 mt-1">
                                {ann.createdAt ? new Date(ann.createdAt).toLocaleString() : 'Recent'}
                              </p>
                            </div>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'announcement', id: ann._id || ann.id, name: ann.title })}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer shrink-0"
                              title="Delete Announcement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )) : (
                          <p className="py-6 text-xs text-[#A1A1AA] font-mono text-center">No broadcasts published yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 6: FEEDBACK & SUPPORT TICKETS */}
              {/* ============================================================== */}
              {activeTab === 'feedback' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-extrabold tracking-tight text-[#FAFAFA]">User Feedback & Support Inbox</h1>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">
                        Triage incoming telemetry reports, bug submissions, and user inquiries.
                      </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search feedback tickets..."
                        className="w-full h-10 pl-10 pr-4 bg-[#13111C] border border-[#231E33] rounded-xl text-xs text-[#FAFAFA] placeholder:text-[#A1A1AA]/50 outline-none focus:border-[#8B5CF6] transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredComments.length > 0 ? filteredComments.map(c => (
                      <div key={c._id || c.id} className="border border-[#231E33] bg-[#13111C] rounded-2xl p-5 space-y-3 shadow-xl">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-[#FAFAFA]">{c.name}</span>
                            <span className="text-[11px] text-[#A1A1AA] font-mono block mt-0.5">{c.email}</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
                            {c.category}
                          </span>
                        </div>

                        {c.websiteUrl && (
                          <div className="p-2 rounded-lg bg-[#0A0A0F] border border-[#231E33] text-[11px] font-mono text-[#8B5CF6] truncate">
                            Target Site: {c.websiteUrl}
                          </div>
                        )}

                        <p className="text-xs p-3.5 rounded-xl bg-[#0A0A0F] border border-[#231E33] text-[#A1A1AA] font-sans leading-relaxed">
                          "{c.message}"
                        </p>

                        <div className="flex justify-between items-center text-[11px] font-mono text-[#A1A1AA] pt-2 border-t border-[#231E33]">
                          <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={async () => {
                                await adminService.markCommentReviewed(c._id || c.id);
                                showToast(c.reviewed ? 'Marked as pending.' : 'Marked as reviewed.');
                                fetchAllData(true);
                              }}
                              className={`cursor-pointer transition font-bold ${c.reviewed ? 'text-emerald-400' : 'text-[#8B5CF6] hover:underline'}`}
                            >
                              {c.reviewed ? 'Reviewed ✓' : 'Mark Reviewed ✓'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'comment', id: c._id || c.id, name: c.name })}
                              className="text-[#A1A1AA] hover:text-rose-400 cursor-pointer"
                              title="Delete Ticket"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-2 py-16 text-center text-[#A1A1AA] font-mono text-xs">
                        No support tickets match query.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 7: CLUSTER DIAGNOSTICS & SYSTEM CONFIGURATION */}
              {/* ============================================================== */}
              {activeTab === 'diagnostics' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-[#FAFAFA]">Cluster Diagnostics & Settings</h1>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">
                      Microservices health, Node.js memory telemetry, and promotional configuration.
                    </p>
                  </div>

                  {/* Node.js Server Metrics */}
                  <div className="border border-[#231E33] bg-[#13111C] rounded-2xl p-6 shadow-xl">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-[#FAFAFA] font-bold mb-4 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#8B5CF6]" /> Node.js Server Performance
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                      <div className="p-3.5 rounded-xl bg-[#0A0A0F] border border-[#231E33]">
                        <span className="text-[10px] text-[#A1A1AA] uppercase">Uptime</span>
                        <p className="text-lg font-bold text-[#FAFAFA] mt-1">{healthData?.server?.uptime || '—'}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#0A0A0F] border border-[#231E33]">
                        <span className="text-[10px] text-[#A1A1AA] uppercase">Memory RSS</span>
                        <p className="text-lg font-bold text-[#8B5CF6] mt-1">{healthData?.server?.memory?.rss || '—'}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#0A0A0F] border border-[#231E33]">
                        <span className="text-[10px] text-[#A1A1AA] uppercase">Heap Used</span>
                        <p className="text-lg font-bold text-[#EC4899] mt-1">{healthData?.server?.memory?.heapUsed || '—'}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#0A0A0F] border border-[#231E33]">
                        <span className="text-[10px] text-[#A1A1AA] uppercase">Node Runtime</span>
                        <p className="text-lg font-bold text-emerald-400 mt-1">{healthData?.server?.nodeVersion || 'v20+'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Microservices Latency Grid */}
                  <div className="border border-[#231E33] bg-[#13111C] rounded-2xl p-6 shadow-xl">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-[#FAFAFA] font-bold mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#EC4899]" /> Microservices Latency & Health
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {healthData?.health ? healthData.health.map((h, i) => (
                        <div key={i} className="p-4 rounded-xl bg-[#0A0A0F] border border-[#231E33] flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-[#FAFAFA]">{h.service}</p>
                            <p className="text-[11px] font-mono text-[#A1A1AA] mt-1">Latency: {h.latency} • Uptime: {h.uptime}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {h.status}
                          </span>
                        </div>
                      )) : <p className="text-xs font-mono text-[#A1A1AA]">Querying cluster diagnostics...</p>}
                    </div>
                  </div>

                  {/* Ad Configuration Form */}
                  <form onSubmit={handleSaveAdConfig} className="border border-[#231E33] bg-[#13111C] rounded-2xl p-6 space-y-4 max-w-xl shadow-xl">
                    <h2 className="text-xs font-mono uppercase tracking-wider text-[#FAFAFA] font-bold flex items-center gap-2">
                      <BadgePercent className="w-4 h-4 text-amber-400" /> Ad & Promotional Banner Config
                    </h2>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                        Banner Call-to-Action Label
                      </label>
                      <input
                        type="text"
                        value={adLabel}
                        onChange={e => setAdLabel(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-[#0A0A0F] border border-[#231E33] text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                        Destination Redirect URL
                      </label>
                      <input
                        type="url"
                        value={adUrl}
                        onChange={e => setAdUrl(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-[#0A0A0F] border border-[#231E33] text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6] transition"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="adEnabledCheckbox"
                        checked={adEnabled}
                        onChange={e => setAdEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-[#8B5CF6] cursor-pointer"
                      />
                      <label htmlFor="adEnabledCheckbox" className="text-xs text-[#A1A1AA] font-medium cursor-pointer">
                        Enable banner across client views
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={savingAd}
                      className="px-5 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-[#FAFAFA] font-semibold text-xs rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50"
                    >
                      {savingAd ? 'Saving Configuration...' : 'Save & Broadcast Configuration'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: ADD USER */}
      {/* ============================================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#13111C] border border-[#231E33] rounded-3xl p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-[#FAFAFA] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#8B5CF6]" /> Create User Account
              </h2>
              <button onClick={() => setShowAddUserModal(false)} className="text-[#A1A1AA] hover:text-[#FAFAFA] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full h-10 px-3 rounded-xl bg-[#0A0A0F] border border-[#231E33] text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  required
                  placeholder="user@example.com"
                  className="w-full h-10 px-3 rounded-xl bg-[#0A0A0F] border border-[#231E33] text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl bg-[#0A0A0F] border border-[#231E33] text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="User">User</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#A1A1AA] mb-1">Status</label>
                  <select
                    value={newUserStatus}
                    onChange={e => setNewUserStatus(e.target.value)}
                    className="w-full h-10 px-2 rounded-xl bg-[#0A0A0F] border border-[#231E33] text-xs text-[#FAFAFA] outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0A0A0F] text-[#A1A1AA] text-xs hover:text-[#FAFAFA] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-[#FAFAFA] font-semibold text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {savingUser ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EVIDENCE IMAGE PREVIEW */}
      {/* ============================================================== */}
      {evidencePreview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#13111C] border border-[#231E33] rounded-3xl p-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-[#A1A1AA] font-bold">Screenshot Evidence</span>
              <button onClick={() => setEvidencePreview(null)} className="text-[#A1A1AA] hover:text-[#FAFAFA] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-black/50 border border-[#231E33] flex items-center justify-center max-h-[70vh]">
              <img src={evidencePreview} alt="Evidence" className="object-contain max-h-[65vh] w-full" />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: DELETE CONFIRMATION */}
      {/* ============================================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#13111C] border border-rose-500/30 rounded-3xl p-6 shadow-2xl animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#FAFAFA]">Permanently Delete Record?</h3>
            <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
              Are you sure you want to delete <strong className="text-[#FAFAFA] font-mono">{deleteConfirm.name}</strong>? This action cannot be reversed.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-[#0A0A0F] text-[#A1A1AA] text-xs hover:text-[#FAFAFA] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-rose-950/40"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}