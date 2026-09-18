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
    <nav className="w-full border-b border-[#231E33] bg-[#0A0A0F]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      {/* Left: Hamburger Menu, Brand & Main Nav Links */}
      <div className="flex items-center gap-6 relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-[#13111C] hover:bg-[#1A1528] text-white border border-[#231E33] transition focus:outline-none cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5 text-[#8B5CF6]" /> : <Menu className="w-5 h-5 text-white" />}
        </button>

        {/* Brand Name with Fully Filled Logo Shield */}
        <Link to="/" className="flex items-center gap-3 text-white font-bold text-xl tracking-tight group">
          <div className="w-10 h-10 rounded-xl bg-[#13111C] border border-[#231E33] flex items-center justify-center overflow-hidden group-hover:border-[#8B5CF6]/50 transition shadow-inner">
            <img 
              src="/logo.png" 
              alt="WebShield AI Logo" 
              className="w-full h-full object-cover scale-[2.2]" 
            />
          </div>
          <span>WebShield AI</span>
        </Link>

        {/* Desktop Navigation Links (Placed right next to the logo) */}
        <div className="hidden lg:flex items-center gap-1 pl-4 border-l border-[#231E33]">
          <button
            onClick={() => navigate('/scam-report')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-[#13111C] transition cursor-pointer"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Report a Scam</span>
          </button>
          
          <button
            onClick={() => navigate('/scan-trends')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-[#13111C] transition cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Scan Trends</span>
          </button>

          <button
            onClick={scrollToHowItWorks}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-[#13111C] transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>How It Works</span>
          </button>
        </div>

        {/* Navigation Dropdown Menu (Mobile / Collapsed) */}
        {isOpen && (
          <div className="absolute top-14 left-0 w-60 bg-[#13111C] border border-[#231E33] rounded-2xl shadow-2xl p-2 z-50 animate-fade-in space-y-1">
            <div className="px-3 py-2 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
              Navigation
            </div>
            
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/history');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-[#1A1528] transition text-left cursor-pointer"
            >
              <History className="w-4 h-4 text-[#8B5CF6]" />
              <span>Scan History</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/scam-report');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-[#1A1528] transition text-left cursor-pointer"
            >
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Report a Scam</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/scan-trends');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-[#1A1528] transition text-left cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-[#22D3EE]" />
              <span>Scan Trends</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                scrollToHowItWorks();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-[#1A1528] transition text-left cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#8B5CF6]" />
              <span>How It Works</span>
            </button>

            <div className="border-t border-[#231E33] my-1 pt-1"></div>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-[#1A1528] transition text-left cursor-pointer"
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
              className="flex items-center gap-2.5 bg-gradient-to-r from-[#13111C] to-[#1A1528] hover:from-[#1A1528] hover:to-[#221B36] border border-[#22D3EE]/40 hover:border-[#22D3EE] text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-lg shadow-cyan-950/30 ring-1 ring-[#22D3EE]/20 hover:ring-[#22D3EE]/50"
            >
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-5 h-5 rounded-full object-cover ring-1 ring-[#22D3EE]/50" />
              ) : (
                <User className="w-4 h-4 text-[#22D3EE]" />
              )}
              <span className="text-xs font-semibold tracking-wide max-w-[120px] truncate hidden sm:inline text-cyan-100">
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