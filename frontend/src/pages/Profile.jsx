import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  Save,
  X,
  Copy,
  Check,
  ScanSearch,
  ShieldAlert,
  ShieldX,
  Upload,
  HardDrive,
  Link as LinkIcon,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Google Drive picker configuration
// ---------------------------------------------------------------------------
// To enable "Choose from Google Drive" you need a Google Cloud project with:
//   1. The "Google Picker API" and "Google Drive API" enabled.
//   2. An OAuth 2.0 Client ID (Web application) — add your app's origin(s)
//      under "Authorized JavaScript origins" (e.g. http://localhost:5173,
//      your production domain).
//   3. An API key, restricted to the Picker API.
// Fill in the two values below. Until you do, the Google Drive button will
// show an error instead of opening the picker.
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';
const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

// If you track scan history in Firestore/your backend, wire this up to a real
// fetch (e.g. getUserStats(user.uid)) and replace the placeholder below.
async function fetchUserSecurityStats(/* uid */) {
  return {
    totalScans: 0,
    threatsFlagged: 0,
    safeSites: 0,
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhotoUrl, setEditPhotoUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState({ loading: false, error: '', success: '' });
  const [pendingEmail, setPendingEmail] = useState('');

  // Avatar picker states
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const pickerApiLoadedRef = useRef(false);
  const tokenClientRef = useRef(null);

  // Product stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

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

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setStatsLoading(true);
    fetchUserSecurityStats(user.uid)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setStats({ totalScans: 0, threatsFlagged: 0, safeSites: 0 });
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

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
    setAvatarError('');
    setPendingEmail('');
    setIsEditing(true);
  };

  const mapAuthError = (err) => {
    switch (err.code) {
      case 'auth/requires-recent-login':
        return 'For security, please log out and log back in, then try again.';
      case 'auth/invalid-email':
        return 'The email address is improperly formatted.';
      case 'auth/email-already-in-use':
        return 'This email is already in use by another account.';
      case 'auth/operation-not-allowed':
        return 'Email changes are currently disabled for this project.';
      case 'auth/invalid-profile-attribute':
        return 'The avatar URL or name entered is invalid.';
      default:
        return 'Failed to update profile. Please try again.';
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveStatus({ loading: true, error: '', success: '' });

    const nameOrPhotoChanged =
      editName !== (user.displayName || '') || editPhotoUrl !== (user.photoURL || '');
    const emailChanged = editEmail !== (user.email || '');

    try {
      // 1. Name / avatar — safe to update directly, no re-auth needed.
      if (nameOrPhotoChanged) {
        await updateProfile(auth.currentUser, {
          displayName: editName,
          photoURL: editPhotoUrl,
        });
        await auth.currentUser.reload();
        setUser({ ...auth.currentUser });
      }

      // 2. Email — modern Firebase requires verifying the NEW address before
      //    it takes effect. This does not change user.email immediately;
      //    it sends a confirmation link to editEmail.
      if (emailChanged) {
        await verifyBeforeUpdateEmail(auth.currentUser, editEmail);
        setPendingEmail(editEmail);
      }

      const successMsg = emailChanged
        ? nameOrPhotoChanged
          ? 'Profile updated. Check your new inbox to confirm the email change.'
          : `Verification link sent to ${editEmail}. Your email updates once confirmed.`
        : 'Profile updated successfully!';

      setSaveStatus({ loading: false, error: '', success: successMsg });

      // Keep the form open longer when an email confirmation is pending,
      // since the user needs to read that message.
      setTimeout(
        () => {
          setIsEditing(false);
          setSaveStatus({ loading: false, error: '', success: '' });
        },
        emailChanged ? 3500 : 1500
      );
    } catch (err) {
      console.error(err);
      setSaveStatus({ loading: false, error: mapAuthError(err), success: '' });
    }
  };

  const handleCopyUid = async () => {
    try {
      await navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // ---- Avatar upload helpers -----------------------------------------
  const uploadAvatarBlob = async (blob, filename = 'avatar') => {
    const storage = getStorage();
    const safeName = filename.replace(/[^\w.\-]/g, '_');
    const path = `avatars/${user.uid}/${Date.now()}_${safeName}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob, { contentType: blob.type || 'image/jpeg' });
    return getDownloadURL(storageRef);
  };

  const handleLocalFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    setAvatarError('');
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError('Image must be under 5MB.');
      return;
    }

    setAvatarUploading(true);
    try {
      const url = await uploadAvatarBlob(file, file.name);
      setEditPhotoUrl(url);
    } catch (err) {
      console.error(err);
      setAvatarError('Upload failed. Please check your Firebase Storage rules and try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // ---- Google Drive picker ---------------------------------------------
  const ensureGoogleApisLoaded = async () => {
    if (GOOGLE_CLIENT_ID.startsWith('YOUR_') || GOOGLE_API_KEY.startsWith('YOUR_')) {
      throw new Error('missing-config');
    }
    await Promise.all([
      loadScriptOnce('https://apis.google.com/js/api.js'),
      loadScriptOnce('https://accounts.google.com/gsi/client'),
    ]);
    if (!pickerApiLoadedRef.current) {
      await new Promise((resolve) => window.gapi.load('picker', resolve));
      pickerApiLoadedRef.current = true;
    }
    if (!tokenClientRef.current) {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: GOOGLE_DRIVE_SCOPE,
        callback: () => {}, // overridden per-request below
      });
    }
  };

  const handlePickerResponse = async (data, accessToken) => {
    if (data.action !== window.google.picker.Action.PICKED) return;
    const file = data.docs[0];
    if (!file) return;

    setAvatarUploading(true);
    setAvatarError('');
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!res.ok) throw new Error('Drive download failed');
      const blob = await res.blob();
      const url = await uploadAvatarBlob(blob, file.name || 'drive-avatar');
      setEditPhotoUrl(url);
    } catch (err) {
      console.error(err);
      setAvatarError('Failed to import the selected image from Drive.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handlePickFromDrive = async () => {
    setAvatarError('');
    try {
      await ensureGoogleApisLoaded();
      tokenClientRef.current.callback = (tokenResponse) => {
        if (tokenResponse.error) {
          setAvatarError('Google Drive authorization was cancelled or failed.');
          return;
        }
        const accessToken = tokenResponse.access_token;
        const picker = new window.google.picker.PickerBuilder()
          .addView(window.google.picker.ViewId.DOCS_IMAGES)
          .setOAuthToken(accessToken)
          .setDeveloperKey(GOOGLE_API_KEY)
          .setCallback((data) => handlePickerResponse(data, accessToken))
          .build();
        picker.setVisible(true);
      };
      tokenClientRef.current.requestAccessToken({ prompt: '' });
    } catch (err) {
      console.error(err);
      if (err.message === 'missing-config') {
        setAvatarError('Google Drive picker is not configured yet (missing client ID / API key).');
      } else {
        setAvatarError('Could not load the Google Drive picker.');
      }
    }
  };

  // Helper to format timestamps locally
  const formatLocalDate = (timestamp) => {
    if (!timestamp) return 'Not available';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return timestamp;
      return date.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
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

  const statCards = [
    { label: 'Sites Scanned', value: stats?.totalScans ?? 0, icon: ScanSearch, color: '#8B5CF6' },
    { label: 'Threats Flagged', value: stats?.threatsFlagged ?? 0, icon: ShieldX, color: '#F43F5E' },
    { label: 'Confirmed Safe', value: stats?.safeSites ?? 0, icon: ShieldCheck, color: '#10B981' },
  ];

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
                {(isEditing ? editPhotoUrl : user.photoURL) ? (
                  <img
                    src={isEditing ? editPhotoUrl : user.photoURL}
                    alt={`${displayName}'s avatar`}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-[#8B5CF6]/40 shadow-lg shadow-purple-950/50"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] font-bold text-2xl shadow-lg shadow-purple-950/50">
                    {getInitials(displayName, email)}
                  </div>
                )}
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0D1117] flex items-center justify-center"
                  title="Active Account"
                >
                  <span className="w-2 h-2 bg-black rounded-full"></span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {displayName}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">{email}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Account Status: Active (
                    {user.emailVerified ? 'Verified' : 'Unverified'})
                  </span>
                  <button
                    onClick={handleCopyUid}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800/60 border border-neutral-700 text-neutral-400 hover:text-neutral-200 text-xs font-semibold transition cursor-pointer"
                    title={user.uid}
                  >
                    {copiedUid ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedUid ? 'Copied' : 'Copy User ID'}
                  </button>
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

          {/* Security Stats — product-specific, fits a fake-website detector */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-wider">
              Detection Activity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {statCards.map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="p-4 bg-[#05070A] border border-neutral-800 rounded-2xl flex items-center gap-3.5"
                >
                  <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: `${color}1A`, color }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[11px] uppercase tracking-wider block font-medium">
                      {label}
                    </span>
                    <span className="text-lg font-bold text-white block leading-tight">
                      {statsLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
                      ) : (
                        value.toLocaleString()
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDIT FORM (Visible only when isEditing is true) */}
          {isEditing ? (
            <form
              onSubmit={handleSaveProfile}
              className="space-y-5 bg-[#05070A] p-6 rounded-2xl border border-neutral-800 animate-fadeIn"
            >
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
              {pendingEmail && !saveStatus.error && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" /> Your email stays{' '}
                  <strong className="font-semibold">{user.email}</strong> until you confirm the
                  link sent to {pendingEmail}.
                </div>
              )}

              <div className="space-y-4">
                {/* Avatar picker */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                    Profile Avatar
                  </label>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-neutral-800 bg-[#13111C] flex items-center justify-center shrink-0">
                      {avatarUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#8B5CF6]" />
                      ) : editPhotoUrl ? (
                        <img
                          src={editPhotoUrl}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <User className="w-6 h-6 text-neutral-600" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" /> Upload from Device
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLocalFileChange}
                          disabled={avatarUploading}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handlePickFromDrive}
                        disabled={avatarUploading}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer transition disabled:opacity-50"
                      >
                        <HardDrive className="w-3.5 h-3.5" /> Google Drive
                      </button>
                    </div>
                  </div>

                  {avatarError && (
                    <div className="mb-2 text-[11px] text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {avatarError}
                    </div>
                  )}

                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="url"
                      value={editPhotoUrl}
                      onChange={(e) => setEditPhotoUrl(e.target.value)}
                      placeholder="Or paste an image URL"
                      className="w-full bg-[#13111C] border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#8B5CF6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                    Full Name
                  </label>
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
                  <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                    Email Address
                  </label>
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
                  {editEmail !== (user.email || '') && (
                    <p className="text-[11px] text-neutral-500 mt-1.5">
                      We'll send a verification link to the new address — your login email
                      won't change until you confirm it.
                    </p>
                  )}
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
                  disabled={saveStatus.loading || avatarUploading}
                  className="px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {saveStatus.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
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
                    <span className="text-neutral-500 text-[11px] uppercase tracking-wider block font-medium">
                      Member Since
                    </span>
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
                    <span className="text-neutral-500 text-[11px] uppercase tracking-wider block font-medium">
                      Last Logged In
                    </span>
                    <span className="text-xs font-semibold text-white mt-0.5 block">
                      {formatLocalDate(user.metadata?.lastSignInTime)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#05070A] border border-neutral-800 rounded-2xl">
                  <span className="text-neutral-500 text-[11px] uppercase tracking-wider block font-medium mb-1">
                    Full Name
                  </span>
                  <span className="text-xs font-semibold text-white">{displayName}</span>
                </div>

                <div className="p-4 bg-[#05070A] border border-neutral-800 rounded-2xl">
                  <span className="text-neutral-500 text-[11px] uppercase tracking-wider block font-medium mb-1">
                    Email Address
                  </span>
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    {email}
                    {!user.emailVerified && (
                      <span
                        className="inline-flex items-center gap-1 text-amber-400 text-[10px] font-semibold"
                        title="Email not verified"
                      >
                        <AlertTriangle className="w-3 h-3" /> Unverified
                      </span>
                    )}
                  </span>
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