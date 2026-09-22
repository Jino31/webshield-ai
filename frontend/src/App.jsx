import React from 'react';
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
// If you create a dedicated ShieldAI page, import it here:
// import ShieldAI from './pages/ShieldAI';
import About from './pages/About';
import Feedback from './pages/Feedback';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div 
      className={`min-h-screen flex flex-col selection:bg-[#8B5CF6] selection:text-white transition-colors duration-300 ${
        isDark ? 'bg-[#0A0A0F] text-[#FAFAFA]' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      <Navbar />
      <main className="flex-1 flex flex-col items-center">
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
          {/* Dedicated route if applicable: */}
          {/* <Route path="/shield-ai" element={<ShieldAI />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </main>
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