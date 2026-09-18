import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  Key, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Copy, 
  Check, 
  Globe, 
  Lock, 
  Activity,
  Sliders
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login', { replace: true });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Sign out error:', err);
      setIsSigningOut(false);
    }
  };

  const handleCopyUid = () => {
    if (!user?.uid) return;
    navigator.clipboard.writeText(user.uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format timestamps locally
  const formatLocalDate = (timestamp) => {
    if (!timestamp) return 'Not available';
    try {
      const date = new Date(Number(timestamp));
      if (isNaN(date.getTime())) return timestamp;
      return date.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timestamp;
    }
  };

  // Helper to get initials for avatar fallback
  const getInitials = (name, email) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'WS';
  };

  // Detect Auth Provider
  const getAuthProvider = () => {
    if (!user?.providerData || user.providerData.length === 0) return 'Email / Password';
    const providerId = user.providerData[0].providerId;
    if (providerId === 'google.com') return 'Google Authentication';
    if (providerId === 'password') return 'Email / Password';
    return providerId;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] w-full flex items-center justify-center bg-[#05070A] text-[#FAFAFA]">
        <div className="flex items-center gap-3 text-sm text-neutral-400 font-medium">
          <Activity className="w-5 h-5 text-[#22D3EE] animate-spin" /> Loading your WebShield AI profile...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.displayName || 'WebShield User';
  const email = user.email || 'No email provided';
  const providerName = getAuthProvider();
  const shortUid = `${user.uid.slice(0, 4)}...${user.uid.slice(-4)}`;

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center px-4 sm:px-8 lg:px-12 py-10 bg-[#05070A] text-[#FAFAFA]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header with Back Navigation */}
      <div className="relative z-10 w-full max-w-3xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back to previous page"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-[#22D3EE] bg-[#0D1117] border border-neutral-800/80 px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#22D3EE]" /> Back
        </button>
        <div className="flex items-center gap-2 text-neutral-400 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-[#22D3EE]" /> Profile & Security
        </div>
      </div>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-3xl bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8">
        
        {/* Profile Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-neutral-800/80">
          <div className="relative">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={`${displayName}'s avatar`} 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#22D3EE]/30 shadow-lg shadow-cyan-950/40" 
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] font-bold text-xl shadow-lg shadow-cyan-950/40">
                {getInitials(user.displayName, user.email)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0D1117] flex items-center justify-center" title="Active Session">
              <span className="w-2 h-2 bg-black rounded-full"></span>
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">{displayName}</h1>
            <p className="text-xs text-neutral-400 mt-1">{email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Account
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${
                user.emailVerified 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
                {user.emailVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {user.emailVerified ? 'Email Verified' : 'Verification Required'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Information Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider">
            Account Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
              <span className="text-neutral-500 text-[11px] uppercase tracking-wider block mb-1">Full Name</span>
              <span className="text-xs font-medium text-white truncate block">{displayName}</span>
            </div>

            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
              <span className="text-neutral-500 text-[11px] uppercase tracking-wider block mb-1">Email Address</span>
              <span className="text-xs font-medium text-white truncate block">{email}</span>
            </div>

            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
              <span className="text-neutral-500 text-[11px] uppercase tracking-wider block mb-1">Authentication Provider</span>
              <span className="text-xs font-medium text-white truncate block">{providerName}</span>
            </div>

            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
              <span className="text-neutral-500 text-[11px] uppercase tracking-wider block mb-1">Email Verification</span>
              <div className="flex items-center gap-2 text-xs font-medium text-white">
                {user.emailVerified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Unverified
                  </>
                )}
              </div>
            </div>

            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
              <span className="text-neutral-500 text-[11px] uppercase tracking-wider block mb-1">Account Created</span>
              <span className="text-xs font-medium text-neutral-300">
                {formatLocalDate(user.metadata?.creationTime)}
              </span>
            </div>

            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
              <span className="text-neutral-500 text-[11px] uppercase tracking-wider block mb-1">Last Sign In</span>
              <span className="text-xs font-medium text-neutral-300">
                {formatLocalDate(user.metadata?.lastSignInTime)}
              </span>
            </div>

          </div>
        </div>

        {/* Security Overview Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider">
            Security Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">Authentication</p>
                  <p className="text-[11px] text-neutral-400">Active session</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Active</span>
            </div>

            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${user.emailVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">Email Security</p>
                  <p className="text-[11px] text-neutral-400">Address status</p>
                </div>
              </div>
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                user.emailVerified ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
              }`}>
                {user.emailVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>

            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#22D3EE]/10 text-[#22D3EE]">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">Session Status</p>
                  <p className="text-[11px] text-neutral-400">Token active</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-[#22D3EE] bg-[#22D3EE]/10 px-2.5 py-1 rounded-full">Active</span>
            </div>

            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">Account Protection</p>
                  <p className="text-[11px] text-neutral-400">Firebase secured</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full">Enabled</span>
            </div>

          </div>
        </div>

        {/* Account Identifier Section */}
        <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
              <Key className="w-3.5 h-3.5 text-[#22D3EE]" /> Account Identifier (UID)
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Unique internal reference for your WebShield AI account.
            </p>
            <span className="inline-block font-mono text-xs text-neutral-300 mt-1 bg-[#13111C] px-2.5 py-1 rounded border border-neutral-800">
              {shortUid}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyUid}
            aria-label="Copy unique account identifier"
            className="inline-flex items-center gap-2 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 text-neutral-200 px-4 py-2 rounded-xl transition text-xs font-medium cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#22D3EE]" /> Copy UID
              </>
            )}
          </button>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="w-full sm:w-auto text-xs text-neutral-300 hover:text-white bg-[#05070A] hover:bg-[#13111C] border border-neutral-800 px-5 py-2.5 rounded-xl transition cursor-pointer font-medium inline-flex items-center justify-center gap-2"
          >
            <Sliders className="w-3.5 h-3.5 text-[#22D3EE]" /> System Settings
          </button>
          
          <button
            type="button"
            disabled={isSigningOut}
            onClick={handleSignOut}
            aria-label="Sign out of your account"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-5 py-2.5 rounded-xl transition text-xs font-semibold cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" /> Sign Out
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}