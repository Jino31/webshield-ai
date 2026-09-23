import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  Menu, 
  X, 
  History, 
  Settings, 
  LogOut, 
  LogIn, 
  UserCircle, 
  User, 
  AlertOctagon, 
  TrendingUp, 
  HelpCircle 
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { isDark } = useTheme();
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

  const scrollToHowItWorks = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById('how-it-works');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const section = document.getElementById('how-it-works');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`w-full border-b backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-colors duration-300 ${
      isDark ? 'border-[#231E33] bg-[#0A0A0F]/80 text-white' : 'border-slate-200 bg-white/90 text-slate-900 shadow-sm'
    }`}>
      {/* Left: Hamburger Menu, Brand & Main Nav Links */}
      <div className="flex items-center gap-6 relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-xl transition focus:outline-none cursor-pointer border ${
            isDark ? 'bg-[#13111C] hover:bg-[#1A1528] text-white border-[#231E33]' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
          }`}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5 text-[#8B5CF6]" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Name with Borderless Logo Shield */}
        <Link to="/" className={`flex items-center gap-3 font-bold text-xl tracking-tight group ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden transition shadow-inner ${
            isDark ? 'bg-[#13111C]' : 'bg-slate-100'
          }`}>
            <img 
              src="/logo.png" 
              alt="WebShield AI Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span>WebShield AI</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={`hidden lg:flex items-center gap-1 pl-4 border-l ${isDark ? 'border-[#231E33]' : 'border-slate-200'}`}>
          <button
            onClick={() => navigate('/scam-report')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              isDark ? 'text-neutral-300 hover:text-white hover:bg-[#13111C]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Report a Scam</span>
          </button>
          
          <button
            onClick={() => navigate('/scan-trends')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              isDark ? 'text-neutral-300 hover:text-white hover:bg-[#13111C]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Scan Trends</span>
          </button>

          <button
            onClick={scrollToHowItWorks}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              isDark ? 'text-neutral-300 hover:text-white hover:bg-[#13111C]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>How It Works</span>
          </button>
        </div>

        {/* Navigation Dropdown Menu (Mobile / Collapsed) */}
        {isOpen && (
          <div className={`absolute top-14 left-0 w-60 border rounded-2xl shadow-2xl p-2 z-50 animate-fade-in space-y-1 ${
            isDark ? 'bg-[#13111C] border-[#231E33]' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
              Navigation
            </div>
            
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/history');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition text-left cursor-pointer ${
                isDark ? 'text-neutral-300 hover:text-white hover:bg-[#1A1528]' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4 text-[#8B5CF6]" />
              <span>Scan History</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/scam-report');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition text-left cursor-pointer ${
                isDark ? 'text-neutral-300 hover:text-white hover:bg-[#1A1528]' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Report a Scam</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/scan-trends');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition text-left cursor-pointer ${
                isDark ? 'text-neutral-300 hover:text-white hover:bg-[#1A1528]' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
              <span>Scan Trends</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                scrollToHowItWorks();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition text-left cursor-pointer ${
                isDark ? 'text-neutral-300 hover:text-white hover:bg-[#1A1528]' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-[#8B5CF6]" />
              <span>How It Works</span>
            </button>

            <div className={`border-t my-1 pt-1 ${isDark ? 'border-[#231E33]' : 'border-slate-200'}`}></div>

            <div className={`px-3 py-2 flex items-center justify-between rounded-xl ${
              isDark ? 'bg-[#1A1528]/50 text-neutral-300' : 'bg-slate-100 text-slate-800'
            }`}>
              <span className="text-xs font-medium">Theme Mode</span>
              <ThemeToggle showLabel={true} />
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition text-left cursor-pointer ${
                isDark ? 'text-neutral-300 hover:text-white hover:bg-[#1A1528]' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4 text-[#EC4899]" />
              <span>Settings</span>
            </button>
          </div>
        )}
      </div>

      {/* Right: Theme Toggle & Dynamic Profile / Sign In Section */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="relative" ref={profileRef}>
          {currentUser ? (
            <div>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 bg-gradient-to-r from-[#13111C] to-[#1A1528] hover:from-[#1A1528] hover:to-[#221B36] border border-[#8B5CF6]/40 hover:border-[#8B5CF6] text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-lg shadow-purple-950/30 ring-1 ring-[#8B5CF6]/20 hover:ring-[#8B5CF6]/50"
              >
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-5 h-5 rounded-full object-cover ring-1 ring-[#8B5CF6]/50" />
                ) : (
                  <User className="w-4 h-4 text-[#8B5CF6]" />
                )}
                <span className="text-xs font-semibold tracking-wide max-w-[120px] truncate hidden sm:inline text-purple-100">
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
                    <UserCircle className="w-4 h-4 text-[#8B5CF6]" />
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
      </div>
    </nav>
  );
}