import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Menu, X, History, Settings } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Brand Name */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <ShieldCheck className="w-6 h-6 text-[#8B5CF6]" />
          <span>WebShield AI</span>
        </Link>

        {/* Dropdown Menu */}
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

      {/* Right: Sign In Button */}
      <div>
        <Link 
          to="/login" 
          className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white font-semibold px-4 py-2 rounded-xl transition flex items-center gap-2 text-sm shadow-md shadow-purple-950/50"
        >
          <User className="w-4 h-4" />
          Sign In
        </Link>
      </div>
    </nav>
  );
}