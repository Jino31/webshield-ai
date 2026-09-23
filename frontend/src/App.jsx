import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Login from './pages/Login';
import History from './pages/History';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ReportScam from './pages/ReportScam';
import ScanTrends from './pages/ScamTrends';
import Admin from './pages/Admin';
import About from './pages/About';
import Feedback from './pages/Feedback';
import ShieldSenseAI from './components/ShieldAIBot';
import CinematicIntroAnimation from './components/IntroAnimation';

function AppContent() {
  const { isDark } = useTheme();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Track introductory animation state globally in App
  const [showIntro, setShowIntro] = useState(() => {
    const hasSeenIntro = sessionStorage.getItem('webshield_intro_played');
    if (!hasSeenIntro) {
      sessionStorage.setItem('webshield_intro_played', 'true');
      return true;
    }
    return false;
  });

  return (
    <div 
      className={`min-h-screen flex flex-col selection:bg-[#8B5CF6] selection:text-white transition-colors duration-300 relative ${
        isDark ? 'bg-[#0A0A0F] text-[#FAFAFA]' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* 3-Second Cinematic 3D Intro Animation */}
      {showIntro && <CinematicIntroAnimation onComplete={() => setShowIntro(false)} />}

      <Navbar />

      <main className="flex-1 flex flex-col items-center w-full relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scanner" element={<Scanner />} />
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

      {/* Global Floating ShieldSense AI Assistant - hidden during intro animation and on Admin routes */}
      {!showIntro && !isAdminRoute && <ShieldSenseAI />}
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