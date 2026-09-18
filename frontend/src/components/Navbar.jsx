import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Menu, X, History, Settings, LogOut, LogIn, UserCircle, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setProfileOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <nav className="w-full border-b border-[#231E33] bg-[#0A0A0F]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      {/* Left: Hamburger Menu & Brand */}
      <div className="flex items-center gap-4 relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-[#13111C] hover:bg-[#1A1528] text-white border border-[#231E33] transition focus:outline-none cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5 text-[#8B5CF6]" /> : <Menu className="w-5 h-5 text-white" />}
        </button>

        {/* Brand Name with Cropped Logo Shield */}
        <Link to="/" className="flex items-center gap-3 text-white font-bold text-xl tracking-tight group">
          <div className="w-9 h-9 rounded-xl bg-[#13111C] border border-[#231E33] flex items-center justify-center overflow-hidden group-hover:border-[#8B5CF6]/50 transition shadow-inner">
            <img 
              src="/logo.png" 
              alt="WebShield AI Logo" 
              className="w-[180%] h-[180%] max-w-none object-contain scale-125 transform translate-y-0.5" 
            />
          </div>
          <span>WebShield AI</span>
        </Link>

        {/* Navigation Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-14 left-0 w-56 bg-[#13111C] border border-[#231E33] rounded-2xl shadow-2xl p-2 z-50 animate-fade-in">
            <div className="px-3 py-2 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
              Navigation
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/history');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-300 hover:text-white hover:bg-[#1A1528] transition text-left cursor-pointer"
            >
              <History className="w-4 h-4 text-[#8B5CF6]" />
              <span>Scan History</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-300 hover:text-white hover:bg-[#1A1528] transition text-left cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#EC4899]" />
              <span>Settings</span>
            </button>
          </div>
        )}
      </div>

      {/* Right: Dynamic Profile / Sign In Section */}
      <div className="relative" ref={profileRef}>
        {currentUser ? (
          <div>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 bg-[#13111C] hover:bg-[#1A1528] border border-[#231E33] text-white px-3.5 py-2 rounded-xl transition cursor-pointer shadow-md"
            >
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-[#8B5CF6]" />
              )}
              <span className="text-xs font-medium max-w-[120px] truncate hidden sm:inline">
                {currentUser.displayName || currentUser.email}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute top-12 right-0 w-60 bg-[#13111C] border border-[#231E33] rounded-2xl shadow-2xl p-3 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-[#231E33] mb-2">
                  <p className="text-xs font-semibold text-white truncate">{currentUser.displayName || 'SecOps User'}</p>
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5">{currentUser.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/Profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-[#1A1528] transition text-left cursor-pointer mb-1"
                >
                  <UserCircle className="w-4 h-4 text-[#22D3EE]" />
                  <span>View Profile</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/login" 
            className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white font-semibold px-4 py-2 rounded-xl transition flex items-center gap-2 text-sm shadow-md shadow-purple-950/50"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}