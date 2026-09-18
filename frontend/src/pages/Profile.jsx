import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { ArrowLeft, User, ShieldCheck, Mail, Calendar, Key, LogOut, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Redirect to login if unauthenticated
        navigate('/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] w-full flex items-center justify-center bg-[#05070A] text-[#FAFAFA]">
        <div className="flex items-center gap-3 text-sm text-neutral-400 font-mono">
          <Activity className="w-5 h-5 text-[#22D3EE] animate-spin" /> Verifying security clearance...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center px-4 sm:px-8 lg:px-12 py-10 bg-[#05070A] text-[#FAFAFA]">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header with Back Button */}
      <div className="relative z-10 w-full max-w-3xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-[#22D3EE] bg-[#0D1117] border border-neutral-800/80 px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#22D3EE]" /> Back
        </button>
        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-[#22D3EE]" /> SecOps Identity Console
        </div>
      </div>

      {/* Profile Card Container */}
      <div className="relative z-10 w-full max-w-3xl bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        
        {/* Profile Header Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-neutral-800/80">
          <div className="relative">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile Avatar" 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#22D3EE]/40 shadow-lg shadow-cyan-950/40" 
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] shadow-lg shadow-cyan-950/40">
                <User className="w-10 h-10" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0D1117] flex items-center justify-center" title="Active Session">
              <span className="w-2 h-2 bg-black rounded-full"></span>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white">{user.displayName || 'SecOps Operative'}</h1>
            <p className="text-xs font-mono text-neutral-400 mt-1">{user.email}</p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-[11px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> Firebase Authenticated
            </div>
          </div>
        </div>

        {/* Account Metadata Grid */}
        <div className="py-6 space-y-4">
          <h3 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider font-mono">
            Security Clearance & Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
              <div className="flex items-center gap-2 text-neutral-500 text-[11px] uppercase tracking-wider mb-1 font-mono">
                <Mail className="w-3.5 h-3.5 text-[#22D3EE]" /> Email Status
              </div>
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
              <div className="flex items-center gap-2 text-neutral-500 text-[11px] uppercase tracking-wider mb-1 font-mono">
                <Key className="w-3.5 h-3.5 text-[#22D3EE]" /> User UID
              </div>
              <span className="text-xs font-mono text-neutral-300 truncate block">
                {user.uid}
              </span>
            </div>

            <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl sm:col-span-2">
              <div className="flex items-center gap-2 text-neutral-500 text-[11px] uppercase tracking-wider mb-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#22D3EE]" /> Last Sign In
              </div>
              <span className="text-xs font-mono text-neutral-300">
                {user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toUTCString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="text-xs text-neutral-400 hover:text-white bg-[#05070A] border border-neutral-800 px-4 py-2.5 rounded-xl transition cursor-pointer font-mono"
          >
            System Settings
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-5 py-2.5 rounded-xl transition text-xs font-semibold cursor-pointer shadow-lg"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}