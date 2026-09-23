import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import History from './pages/History';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ReportScam from './pages/ReportScam';
import ScanTrends from './pages/ScanTrends';
import Admin from './pages/Admin';
import About from './pages/About';
import Feedback from './pages/Feedback';
import ShieldSenseAI from './components/ShieldAIBot';

function AppContent() {
  const { isDark } = useTheme();
  
  // Track introductory animation state globally in App
  const [showIntro, setShowIntro] = useState(() => {
    const hasSeenIntro = sessionStorage.getItem('webshield_intro_played');
    if (!hasSeenIntro) {
      sessionStorage.setItem('webshield_intro_played', 'true');
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 2800); // Perfectly timed for luxury pacing
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  return (
    <div 
      className={`min-h-screen flex flex-col selection:bg-[#8B5CF6] selection:text-white transition-colors duration-300 relative ${
        isDark ? 'bg-[#0A0A0F] text-[#FAFAFA]' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* 3-Second Luxury Cinematic Intro Overlay */}
      {showIntro && (
        <div className="fixed inset-0 z-[200] bg-[#07070B] flex flex-col items-center justify-center animate-luxuryFadeOut overflow-hidden">
          {/* Ambient Luxury Gradient Orbs */}
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-[#8B5CF6]/20 via-[#EC4899]/15 to-transparent rounded-full blur-[160px] animate-pulse pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0,transparent_75%)] pointer-events-none" />

          {/* Luxury Glassmorphic Card Container */}
          <div className="relative z-10 flex flex-col items-center p-12 rounded-[32px] bg-[#12111A]/60 border border-white/10 backdrop-blur-2xl shadow-[0_0_100px_rgba(139,92,246,0.25)] animate-luxuryReveal">
            
            {/* Glowing Logo Asset Container */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] blur-2xl rounded-full opacity-70 animate-pulse" />
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1A1829] to-[#0A0A0F] flex items-center justify-center p-3 shadow-2xl relative z-10 border border-purple-400/30">
                <img 
                  src="/logo.png" 
                  alt="WebShield AI Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]" 
                />
              </div>
            </div>

            {/* Typography with Luxury Letter Spacing */}
            <div className="flex items-center font-extrabold text-3xl md:text-5xl tracking-tight">
              <span className="text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.3)]">WebShield</span>
              <span className="bg-gradient-to-r from-[#8B5CF6] via-purple-400 to-[#EC4899] bg-clip-text text-transparent ml-2.5 drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]">AI</span>
            </div>

            {/* Subtitle / Loader Text */}
            <div className="mt-4 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-ping" />
              <p className="text-neutral-400 text-[11px] font-mono uppercase tracking-[0.25em] text-center">
                Establishing Secure Vault Environment...
              </p>
            </div>

            {/* High-End Scanning Beam Line */}
            <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent mt-6 animate-pulse" />
          </div>
        </div>
      )}

      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/scam-report" element={<ReportScam />} />
          <Route path="/scan-trends" element={<ScanTrends />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </main>

      {/* Global Floating ShieldSense AI Assistant - hidden while intro animation runs */}
      {!showIntro && <ShieldSenseAI />}

      {/* High-End Luxury Keyframes & Transitions */}
      <style>{`
        @keyframes luxuryFadeOut {
          0% { opacity: 1; pointer-events: auto; }
          75% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
        .animate-luxuryFadeOut {
          animation: luxuryFadeOut 0.7s cubic-bezier(0.16, 1, 0.3, 1) 2.1s forwards;
        }

        @keyframes luxuryReveal {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(30px);
            filter: blur(16px);
          }
          60% {
            opacity: 1;
            transform: scale(1.02) translateY(0);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }
        .animate-luxuryReveal {
          animation: luxuryReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;