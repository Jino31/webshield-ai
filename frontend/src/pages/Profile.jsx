import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, updateProfile, updateEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Mail, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Activity,
  Edit3,
  Calendar,
  Clock,
  User,
  Image as ImageIcon,
  Save,
  X
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhotoUrl, setEditPhotoUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState({ loading: false, error: '', success: '' });

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

  const handleEditClick = () => {
    setEditName(user.displayName || '');
    setEditEmail(user.email || '');
    setEditPhotoUrl(user.photoURL || '');
    setSaveStatus({ loading: false, error: '', success: '' });
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveStatus({ loading: true, error: '', success: '' });

    try {
      const promises = [];
      let profileNeedsUpdate = false;

      // Check if Name or Avatar changed
      if (editName !== user.displayName || editPhotoUrl !== user.photoURL) {
        promises.push(updateProfile(auth.currentUser, { 
          displayName: editName, 
          photoURL: editPhotoUrl 
        }));
        profileNeedsUpdate = true;
      }

      // Check if Email changed
      if (editEmail !== user.email) {
        promises.push(updateEmail(auth.currentUser, editEmail));
      }

      await Promise.all(promises);

      if (profileNeedsUpdate) {
        // Force refresh local user object to show updated avatar/name immediately
        await auth.currentUser.reload();
        setUser({ ...auth.currentUser });
      }

      setSaveStatus({ loading: false, error: '', success: 'Profile updated successfully!' });
      
      // Close edit mode after 1.5 seconds on success
      setTimeout(() => {
        setIsEditing(false);
        setSaveStatus({ loading: false, error: '', success: '' });
      }, 1500);

    } catch (err) {
      console.error(err);
      let errorMsg = 'Failed to update profile. Please try again.';
      if (err.code === 'auth/requires-recent-login') {
        errorMsg = 'For security, please log out and log back in to change your email.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'The email address is improperly formatted.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already in use by another account.';
      }
      setSaveStatus({ loading: false, error: errorMsg, success: '' });
    }
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
    if (name) return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    if (email) return email.slice(0, 2).toUpperCase();
    return 'WS';
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#05070A] text-[#FAFAFA]">
        <div className="flex items-center gap-3 text-sm text-neutral-400 font-medium">
          <Activity className="w-5 h-5 text-[#8B5CF6] animate-spin" /> Loading your profile...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.displayName || 'WebShield User';
  const email = user.email || 'No email provided';

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-4 sm:px-8 lg:px-16 py-12 bg-[#05070A] text-[#FAFAFA] overflow-x-hidden">
      
      {/* Absolute Top-Left Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => navigate('/')}
          aria-label="Go back to home page"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white bg-[#0D1117]/80 backdrop-blur-md border border-neutral-800 px-4 py-2.5 rounded-xl transition shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8B5CF6]" /> Back to Home
        </button>
      </div>

      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#EC4899]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-6 mt-8">
        
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

            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white px-5 py-2.5 rounded-xl transition text-xs font-semibold cursor-pointer shadow-lg shadow-purple-950/30"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>

          {/* EDIT FORM (Visible only when isEditing is true) */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-5 bg-[#05070A] p-6 rounded-2xl border border-neutral-800 animate-fadeIn">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#8B5CF6]" /> Update Profile Details
              </h3>

              {saveStatus.error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {saveStatus.error}
                </div>
              )}
              {saveStatus.success && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {saveStatus.success}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Profile Avatar URL (Optional)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type="url" 
                      value={editPhotoUrl}
                      onChange={(e) => setEditPhotoUrl(e.target.value)}
                      placeholder="https://example.com/your-image.png"
                      className="w-full bg-[#13111C] border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type="text" 
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-[#13111C] border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type="email" 
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#13111C] border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={saveStatus.loading}
                  className="px-4 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-xs font-semibold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveStatus.loading}
                  className="px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {saveStatus.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* VIEW MODE: User Account Details */
            <div className="space-y-4 animate-fadeIn">
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
          )}

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