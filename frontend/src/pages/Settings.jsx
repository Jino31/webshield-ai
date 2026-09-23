import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  Cpu, 
  Bell, 
  Lock, 
  Settings as SettingsIcon, 
  User, 
  Server, 
  Check, 
  RotateCcw, 
  Sliders, 
  ArrowLeft,
  ChevronRight,
  Activity,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
  
  // Active settings navigation tab
  const [activeTab, setActiveTab] = useState('security');

  // Settings State
  const [realTimeProtection, setRealTimeProtection] = useState(true);
  const [phishingDetection, setPhishingDetection] = useState(true);
  const [sslVerification, setSslVerification] = useState(true);
  const [redirectDetection, setRedirectDetection] = useState(true);
  
  const [detectionThreshold, setDetectionThreshold] = useState(75);
  const [scanDepth, setScanDepth] = useState('Standard');
  const [urlFeatureAnalysis, setUrlFeatureAnalysis] = useState(true);
  const [domainReputation, setDomainReputation] = useState(true);

  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:5000/api/scan');
  const [autoLog, setAutoLog] = useState(true);

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Load persisted preferences on mount
  useEffect(() => {
    try {
      if (localStorage.getItem('ws_realTimeProtection') !== null) {
        setRealTimeProtection(localStorage.getItem('ws_realTimeProtection') === 'true');
      }
      if (localStorage.getItem('ws_phishingDetection') !== null) {
        setPhishingDetection(localStorage.getItem('ws_phishingDetection') === 'true');
      }
      if (localStorage.getItem('ws_sslVerification') !== null) {
        setSslVerification(localStorage.getItem('ws_sslVerification') === 'true');
      }
      if (localStorage.getItem('ws_redirectDetection') !== null) {
        setRedirectDetection(localStorage.getItem('ws_redirectDetection') === 'true');
      }
      if (localStorage.getItem('ws_detectionThreshold') !== null) {
        setDetectionThreshold(Number(localStorage.getItem('ws_detectionThreshold')));
      }
      if (localStorage.getItem('ws_scanDepth') !== null) {
        setScanDepth(localStorage.getItem('ws_scanDepth'));
      }
      if (localStorage.getItem('ws_urlFeatureAnalysis') !== null) {
        setUrlFeatureAnalysis(localStorage.getItem('ws_urlFeatureAnalysis') === 'true');
      }
      if (localStorage.getItem('ws_domainReputation') !== null) {
        setDomainReputation(localStorage.getItem('ws_domainReputation') === 'true');
      }
      if (localStorage.getItem('ws_apiEndpoint') !== null) {
        setApiEndpoint(localStorage.getItem('ws_apiEndpoint'));
      }
      if (localStorage.getItem('ws_autoLog') !== null) {
        setAutoLog(localStorage.getItem('ws_autoLog') === 'true');
      }
    } catch (err) {
      console.error('Error loading settings from localStorage:', err);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'system' && (!apiEndpoint.trim() || (!apiEndpoint.startsWith('http://') && !apiEndpoint.startsWith('https://')))) {
      setError('Please enter a valid HTTP or HTTPS API endpoint URL.');
      return;
    }

    try {
      localStorage.setItem('ws_realTimeProtection', String(realTimeProtection));
      localStorage.setItem('ws_phishingDetection', String(phishingDetection));
      localStorage.setItem('ws_sslVerification', String(sslVerification));
      localStorage.setItem('ws_redirectDetection', String(redirectDetection));
      localStorage.setItem('ws_detectionThreshold', String(detectionThreshold));
      localStorage.setItem('ws_scanDepth', String(scanDepth));
      localStorage.setItem('ws_urlFeatureAnalysis', String(urlFeatureAnalysis));
      localStorage.setItem('ws_domainReputation', String(domainReputation));
      localStorage.setItem('ws_apiEndpoint', apiEndpoint.trim());
      localStorage.setItem('ws_autoLog', String(autoLog));

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to persist settings to browser storage.');
    }
  };

  const handleReset = () => {
    setRealTimeProtection(true);
    setPhishingDetection(true);
    setSslVerification(true);
    setRedirectDetection(true);
    setDetectionThreshold(75);
    setScanDepth('Standard');
    setUrlFeatureAnalysis(true);
    setDomainReputation(true);
    setApiEndpoint('http://localhost:5000/api/scan');
    setAutoLog(true);
    setError('');
    localStorage.clear();
  };

  const navItems = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'scanner', label: 'Scanner', icon: Search },
    { id: 'appearance', label: 'Appearance & Theme', icon: Palette },
    { id: 'ai', label: 'AI Detection', icon: Cpu },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'system', label: 'System', icon: SettingsIcon },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center px-4 sm:px-8 lg:px-12 py-10 bg-[#05070A] text-[#FAFAFA]">
      {/* Background Subtle Cyber Glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Section */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-[#22D3EE] bg-[#0D1117] border border-neutral-800/80 px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#22D3EE]" /> Back
        </button>
        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono">
          <Activity className="w-4 h-4 text-[#22D3EE]" /> SecOps Console v2.6
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="relative z-10 w-full max-w-5xl mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">SETTINGS</h1>
        <p className="text-neutral-400 text-sm">Configure your security, detection and scanning preferences.</p>
      </div>

      {error && (
        <div className="w-full max-w-5xl mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Dashboard Grid Container */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Navigation Sidebar */}
        <div className="md:col-span-1 bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-3 h-fit backdrop-blur-xl shadow-xl">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 px-3 py-2">
            Settings Menu
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive 
                      ? 'bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#22D3EE]' : 'text-neutral-500'}`} />
                    {item.label}
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#22D3EE]' : 'text-neutral-700'}`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content Panel */}
        <div className="md:col-span-3 bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          <form onSubmit={handleSave} className="space-y-8">

            {/* SECURITY TAB VIEW */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
                  <Shield className="w-4 h-4" /> Security & Protection
                </h2>
                <p className="text-xs text-neutral-400 mb-6">
                  Manage active network interception, machine learning phishing models, and SSL verification.
                </p>

                <div className="space-y-3">
                  {[
                    { title: 'Real-time URL Protection', desc: 'Actively intercept and inspect links prior to navigation', state: realTimeProtection, setter: setRealTimeProtection },
                    { title: 'Phishing Detection', desc: 'Machine learning heuristic evaluation for known spoof patterns', state: phishingDetection, setter: setPhishingDetection },
                    { title: 'SSL Verification', desc: 'Inspect certificate authority validity and TLS handshake security', state: sslVerification, setter: setSslVerification },
                    { title: 'Redirect Detection', desc: 'Monitor multi-hop redirects and chain obfuscation tactics', state: redirectDetection, setter: setRedirectDetection },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-[#05070A] border border-neutral-800/60 rounded-xl">
                      <div>
                        <h3 className="text-xs font-medium text-white">{item.title}</h3>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => item.setter(!item.state)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition cursor-pointer border ${
                          item.state 
                            ? 'bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/30 shadow-sm shadow-cyan-950/50' 
                            : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                        }`}
                      >
                        {item.state ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCANNER TAB VIEW */}
            {activeTab === 'scanner' && (
              <div>
                <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
                  <Sliders className="w-4 h-4" /> Scanner Configuration
                </h2>
                <p className="text-xs text-neutral-400 mb-6">
                  Fine-tune URL scanning parameters, sensitivity thresholds, and lexical heuristic analysis.
                </p>

                <div className="space-y-4">
                  {/* Threshold Slider */}
                  <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-white">Detection Threshold</label>
                      <span className="text-xs font-mono text-[#22D3EE] font-semibold">{detectionThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={detectionThreshold}
                      onChange={(e) => setDetectionThreshold(Number(e.target.value))}
                      className="w-full accent-[#22D3EE] bg-neutral-900 cursor-pointer"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">Minimum model confidence required to trigger a high-risk flag.</p>
                  </div>

                  {/* Scan Depth Selector */}
                  <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-medium text-white">Scan Depth</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Determines lexical heuristics vs. deep inspection depth.</p>
                    </div>
                    <select
                      value={scanDepth}
                      onChange={(e) => setScanDepth(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 text-xs text-[#22D3EE] rounded-lg px-3 py-2 outline-none font-mono focus:border-[#22D3EE] cursor-pointer"
                    >
                      <option value="Fast">Fast</option>
                      <option value="Standard">Standard</option>
                      <option value="Deep">Deep</option>
                    </select>
                  </div>

                  {/* Additional Toggles */}
                  {[
                    { title: 'URL Feature Analysis', desc: 'Extract lexical attributes (length, entropy, symbols)', state: urlFeatureAnalysis, setter: setUrlFeatureAnalysis },
                    { title: 'Domain Reputation', desc: 'Cross-reference WHOIS age and threat intelligence feeds', state: domainReputation, setter: setDomainReputation },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-[#05070A] border border-neutral-800/60 rounded-xl">
                      <div>
                        <h3 className="text-xs font-medium text-white">{item.title}</h3>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => item.setter(!item.state)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition cursor-pointer border ${
                          item.state 
                            ? 'bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/30 shadow-sm shadow-cyan-950/50' 
                            : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                        }`}
                      >
                        {item.state ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* APPEARANCE & THEME TAB VIEW */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
                  <Palette className="w-4 h-4" /> Appearance & Theme Preferences
                </h2>
                
                <p className="text-xs text-neutral-400 mb-6">
                  Select your preferred UI color scheme. WebShield AI includes a fast theme toggle available both here and in the top navigation bar.
                </p>

                {/* Theme Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  
                  {/* Dark Mode Option */}
                  <div 
                    onClick={() => setTheme('dark')}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isDark 
                        ? 'bg-[#0C1220] border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500' 
                        : 'bg-[#05070A] border-neutral-800/80 hover:border-neutral-700 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#101828] border border-[#1D2939] flex items-center justify-center text-cyan-400">
                        <Sun className="w-5 h-5 text-amber-400" />
                      </div>
                      {isDark && (
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold font-mono">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Cyber SecOps Dark</h3>
                    <p className="text-xs text-neutral-400">Deep obsidian background with glowing electric cyan & quantum indigo telemetry.</p>
                  </div>

                  {/* Light Mode Option */}
                  <div 
                    onClick={() => setTheme('light')}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      !isDark 
                        ? 'bg-white border-cyan-500 shadow-lg shadow-cyan-950/20 ring-1 ring-cyan-500' 
                        : 'bg-[#05070A] border-neutral-800/80 hover:border-neutral-700 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                        <Moon className="w-5 h-5 text-slate-700" />
                      </div>
                      {!isDark && (
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-600 text-[10px] font-bold font-mono">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Daylight Clarity Light</h3>
                    <p className="text-xs text-neutral-400">Clean slate canvas (#F8FAFC) with elevated white cards and high-contrast typography.</p>
                  </div>

                </div>

                {/* Quick Toggle Component Preview */}
                <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Theme Switcher</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Click to toggle instantaneously across the whole platform.</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="theme-toggle-btn flex items-center gap-2.5 px-4 py-2 rounded-xl border border-neutral-800 bg-[#0C1220] hover:bg-[#101828] text-xs font-semibold text-white transition cursor-pointer"
                  >
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
                    <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
                  </button>
                </div>

              </div>
            )}

            {/* SYSTEM TAB VIEW */}
            {activeTab === 'system' && (
              <div>
                <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
                  <Server className="w-4 h-4" /> System & Backend Connectivity
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white mb-2">Backend Express & ML API Endpoint</label>
                    <div className="relative">
                      <Server className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        className="w-full bg-[#05070A] border border-neutral-800 focus:border-[#22D3EE] rounded-xl pl-10 pr-4 py-2.5 text-white text-xs font-mono outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-[#05070A] border border-neutral-800/60 rounded-xl">
                    <div>
                      <h3 className="text-xs font-medium text-white">Automatic Scan Auditing</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Log scan history automatically into database collections.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoLog(!autoLog)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider transition cursor-pointer border ${
                        autoLog 
                          ? 'bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/30 shadow-sm shadow-cyan-950/50' 
                          : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                      }`}
                    >
                      {autoLog ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* OTHER TABS PLACEHOLDER VIEW */}
            {['ai', 'notifications', 'privacy', 'account'].includes(activeTab) && (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center text-[#22D3EE] mx-auto mb-4">
                  <SettingsIcon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-white capitalize">{activeTab} Preferences</h3>
                <p className="text-xs text-neutral-400 mt-1">Configure advanced module parameters and security clearance credentials.</p>
              </div>
            )}

            {/* Footer Action Controls */}
            <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-between flex-wrap gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-[#05070A] border border-neutral-800 px-4 py-2.5 rounded-xl transition cursor-pointer font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#22D3EE]" /> Reset Defaults
              </button>

              <div className="flex items-center gap-3">
                {saved && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved successfully
                  </span>
                )}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#22D3EE] to-blue-600 hover:opacity-90 text-black font-semibold px-6 py-2.5 rounded-xl transition text-xs shadow-lg shadow-cyan-950/40 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}