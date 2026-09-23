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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  return (
    <div 
      className={`min-h-screen flex flex-col selection:bg-[#8B5CF6] selection:text-white transition-colors duration-300 relative ${
        isDark ? 'bg-[#0A0A0F] text-[#FAFAFA]' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* 3-Second Global Cinematic Intro Overlay */}
      {showIntro && (
        <div className="fixed inset-0 z-[200] bg-[#0A0A0F] flex flex-col items-center justify-center animate-fadeOut">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0,transparent_70%)] pointer-events-none" />
          <div className="relative flex flex-col items-center space-y-4 animate-cinematicReveal">
            <div className="relative">
              <div className="absolute inset-0 bg-[#8B5CF6]/50 blur-3xl rounded-full animate-pulse" />
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center text-white text-3xl shadow-[0_0_40px_rgba(139,92,246,0.8)] relative z-10 border border-purple-400/40">
                🛡️
              </div>
            </div>
            <div className="flex items-center font-extrabold text-3xl md:text-5xl tracking-tighter">
              <span className="text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.4)]">WebShield</span>
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent ml-2">AI</span>
            </div>
            <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest mt-2 animate-pulse">Initializing Threat Intelligence Core...</p>
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

      {/* Required Animation Keyframes */}
      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fadeOut {
          animation: fadeOut 0.4s ease-in-out 2.6s forwards;
        }

        @keyframes cinematicReveal {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(20px);
            filter: blur(10px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }
        .animate-cinematicReveal {
          animation: cinematicReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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