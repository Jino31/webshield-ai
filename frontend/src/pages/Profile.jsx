import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Mail, 
  Key, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Copy, 
  Check, 
  Activity,
  Edit3,
  Calendar,
  Clock
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [copied, setCopied] = useState(false);

  // Real-time synchronization of Firebase Auth state
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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] w-full flex items-center justify-center bg-[#05070A] text-[#FAFAFA]">
        <div className="flex items-center gap-3 text-sm text-neutral-400 font-medium">
          <Activity className="w-5 h-5 text-[#8B5CF6] animate-spin" /> Loading your profile...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.displayName || 'WebShield User';
  const email = user.email || 'No email provided';
  const shortUid = `${user.uid.slice(0, 4)}...${user.uid.slice(-4)}`;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-4 sm:px-8 lg:px-16 py-8 bg-[#05070A] text-[#FAFAFA]">
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-6">
        
        {/* Top-Left Back Button & Header */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => navigate('/')}
            aria-label="Go back to home page"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white bg-[#0D1117] border border-neutral-800 px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B5CF6]" /> Back to Home
          </button>
          
          <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" /> User Profile Management
          </div>
        </div>

        {/* Profile Container */}
        <div className="w-full bg-[#0D1117]/90 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Profile Header & Edit Profile Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={`${displayName}'s avatar`} 
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-[#8B5CF6]/40 shadow-lg shadow-purple-950/50" 
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] font-bold text-2xl shadow-lg shadow-purple-950/50">
                    {getInitials(displayName, email)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0D1117] flex items-center justify-center" title="Active Account">
                  <span className="w-2 h-2 bg-black rounded-full"></span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{displayName}</h1>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">{email}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Account Status: Active ({user.emailVerified ? 'Verified' : 'Unverified'})
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Edit Button */}
            <button
              onClick={() => navigate('/settings')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white px-5 py-2.5 rounded-xl transition text-xs font-semibold cursor-pointer shadow-lg shadow-purple-950/30"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          {/* User Account Details (Logins & Membership Timeline) */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-wider">
              User Account Details & Login History
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 bg-[#05070A] border border-neutral-800 rounded-2xl flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-500 text-[11px] uppercase tracking-wider block font-medium">Member Since</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">
                    {formatLocalDate(user.metadata?.creationTime)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#05070A] border border-neutral-800 rounded-2xl flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#EC4899]/10 text-[#EC4899] mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-500 text-[11px] uppercase tracking-wider block font-medium">Last Logged In</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">
                    {formatLocalDate(user.metadata?.lastSignInTime)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#05070A] border border-neutral-800 rounded-2xl">
                <span className="text-neutral-500 text-[11px] uppercase tracking-wider block font-medium mb-1">Full Name</span>
                <span className="text-xs font-semibold text-white">{displayName}</span>
              </div>

              <div className="p-4 bg-[#05070A] border border-neutral-800 rounded-2xl">
                <span className="text-neutral-500 text-[11px] uppercase tracking-wider block font-medium mb-1">Email Address</span>
                <span className="text-xs font-semibold text-white">{email}</span>
              </div>

            </div>
          </div>

          {/* Account Identifier Section */}
          <div className="p-4 bg-[#05070A] border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <Key className="w-3.5 h-3.5 text-[#8B5CF6]" /> Account Identifier (UID)
              </div>
              <span className="inline-block font-mono text-xs text-neutral-400 mt-1 bg-[#13111C] px-3 py-1 rounded-lg border border-neutral-800">
                {shortUid}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyUid}
              className="inline-flex items-center gap-2 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 text-neutral-200 px-4 py-2 rounded-xl transition text-xs font-medium cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied UID
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8B5CF6]" /> Copy UID
                </>
              )}
            </button>
          </div>

          {/* Sign Out Action */}
          <div className="pt-6 border-t border-neutral-800 flex justify-end">
            <button
              type="button"
              disabled={isSigningOut}
              onClick={handleSignOut}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-6 py-3 rounded-xl transition text-xs font-semibold cursor-pointer shadow-lg disabled:opacity-50"
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
    </div>
  );
}