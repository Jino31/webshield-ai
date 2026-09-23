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
import EntryAnimation from './components/EntryAnimation'; // <-- Added missing import

function AppContent() {
  const { isDark } = useTheme();
  
  // Track introductory animation state globally in App so the bot respects it
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('webshield_intro_played');
  });

  useEffect(() => {
    if (showIntro) {
      sessionStorage.setItem('webshield_intro_played', 'true'); // Save session flag immediately
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
      {/* Upgraded 3-Second Startup Animation Screen */}
      {showIntro && <EntryAnimation />}

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