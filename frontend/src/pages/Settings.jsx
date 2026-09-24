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
  Moon,
  Mail,
  Smartphone,
  Globe,
  Key,
  ShieldAlert,
  Terminal,
  Database
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
  
  // Active settings navigation tab
  const [activeTab, setActiveTab] = useState('security');

  // 1. Security State
  const [realTimeProtection, setRealTimeProtection] = useState(true);
  const [phishingDetection, setPhishingDetection] = useState(true);
  const [sslVerification, setSslVerification] = useState(true);
  const [redirectDetection, setRedirectDetection] = useState(true);
  
  // 2. Scanner State
  const [detectionThreshold, setDetectionThreshold] = useState(75);
  const [scanDepth, setScanDepth] = useState('Standard');
  const [urlFeatureAnalysis, setUrlFeatureAnalysis] = useState(true);
  const [domainReputation, setDomainReputation] = useState(true);

  // 3. AI Detection State
  const [transformerModel, setTransformerModel] = useState('BERT-Phish-v4');
  const [ensembleScoring, setEnsembleScoring] = useState(true);
  const [heuristicSensitivity, setHeuristicSensitivity] = useState('Balanced');

  // 4. Notifications State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // 5. Privacy State
  const [telemetrySharing, setTelemetrySharing] = useState(true);
  const [storeScanHistory, setStoreScanHistory] = useState(true);

  // 6. System State
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:5000/api/scan');
  const [autoLog, setAutoLog] = useState(true);

  // 7. Account State
  const [userName, setUserName] = useState('S. Jeffrin Jino');
  const [userEmail, setUserEmail] = useState('jeffrin@webshield.ai');

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Load persisted preferences on mount
  useEffect(() => {
    try {
      if (localStorage.getItem('ws_realTimeProtection') !== null) setRealTimeProtection(localStorage.getItem('ws_realTimeProtection') === 'true');
      if (localStorage.getItem('ws_phishingDetection') !== null) setPhishingDetection(localStorage.getItem('ws_phishingDetection') === 'true');
      if (localStorage.getItem('ws_sslVerification') !== null) setSslVerification(localStorage.getItem('ws_sslVerification') === 'true');
      if (localStorage.getItem('ws_redirectDetection') !== null) setRedirectDetection(localStorage.getItem('ws_redirectDetection') === 'true');
      if (localStorage.getItem('ws_detectionThreshold') !== null) setDetectionThreshold(Number(localStorage.getItem('ws_detectionThreshold')));
      if (localStorage.getItem('ws_scanDepth') !== null) setScanDepth(localStorage.getItem('ws_scanDepth'));
      if (localStorage.getItem('ws_urlFeatureAnalysis') !== null) setUrlFeatureAnalysis(localStorage.getItem('ws_urlFeatureAnalysis') === 'true');
      if (localStorage.getItem('ws_domainReputation') !== null) setDomainReputation(localStorage.getItem('ws_domainReputation') === 'true');
      if (localStorage.getItem('ws_transformerModel') !== null) setTransformerModel(localStorage.getItem('ws_transformerModel'));
      if (localStorage.getItem('ws_ensembleScoring') !== null) setEnsembleScoring(localStorage.getItem('ws_ensembleScoring') === 'true');
      if (localStorage.getItem('ws_heuristicSensitivity') !== null) setHeuristicSensitivity(localStorage.getItem('ws_heuristicSensitivity'));
      if (localStorage.getItem('ws_emailAlerts') !== null) setEmailAlerts(localStorage.getItem('ws_emailAlerts') === 'true');
      if (localStorage.getItem('ws_pushNotifications') !== null) setPushNotifications(localStorage.getItem('ws_pushNotifications') === 'true');
      if (localStorage.getItem('ws_weeklyDigest') !== null) setWeeklyDigest(localStorage.getItem('ws_weeklyDigest') === 'true');
      if (localStorage.getItem('ws_telemetrySharing') !== null) setTelemetrySharing(localStorage.getItem('ws_telemetrySharing') === 'true');
      if (localStorage.getItem('ws_storeScanHistory') !== null) setStoreScanHistory(localStorage.getItem('ws_storeScanHistory') === 'true');
      if (localStorage.getItem('ws_apiEndpoint') !== null) setApiEndpoint(localStorage.getItem('ws_apiEndpoint'));
      if (localStorage.getItem('ws_autoLog') !== null) setAutoLog(localStorage.getItem('ws_autoLog') === 'true');
      if (localStorage.getItem('ws_userName') !== null) setUserName(localStorage.getItem('ws_userName'));
      if (localStorage.getItem('ws_userEmail') !== null) setUserEmail(localStorage.getItem('ws_userEmail'));
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
      localStorage.setItem('ws_transformerModel', transformerModel);
      localStorage.setItem('ws_ensembleScoring', String(ensembleScoring));
      localStorage.setItem('ws_heuristicSensitivity', heuristicSensitivity);
      localStorage.setItem('ws_emailAlerts', String(emailAlerts));
      localStorage.setItem('ws_pushNotifications', String(pushNotifications));
      localStorage.setItem('ws_weeklyDigest', String(weeklyDigest));
      localStorage.setItem('ws_telemetrySharing', String(telemetrySharing));
      localStorage.setItem('ws_storeScanHistory', String(storeScanHistory));
      localStorage.setItem('ws_apiEndpoint', apiEndpoint.trim());
      localStorage.setItem('ws_autoLog', String(autoLog));
      localStorage.setItem('ws_userName', userName);
      localStorage.setItem('ws_userEmail', userEmail);

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
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
    setTransformerModel('BERT-Phish-v4');
    setEnsembleScoring(true);
    setHeuristicSensitivity('Balanced');
    setEmailAlerts(true);
    setPushNotifications(true);
    setWeeklyDigest(false);
    setTelemetrySharing(true);
    setStoreScanHistory(true);
    setApiEndpoint('http://localhost:5000/api/scan');
    setAutoLog(true);
    setUserName('S. Jeffrin Jino');
    setUserEmail('jeffrin@webshield.ai');
    setError('');
    localStorage.clear();
  };

  const navItems = [
    { id: 'security', label: 'Security', icon: Shield, badge: 'Active' },
    { id: 'scanner', label: 'Scanner', icon: Search },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'ai', label: 'AI Detection', icon: Cpu, badge: 'ML' },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'system', label: 'System', icon: Server },
    { id: 'account', label: 'Account', icon: User },
  ];

  // Reusable Switch Component for professional UX
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#22D3EE]' : 'bg-neutral-800'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center px-4 sm:px-8 lg:px-12 py-10 bg-[#05070A] text-[#FAFAFA]">
      {/* Background Cyber Glows */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#22D3EE]/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Navigation Bar */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-[#22D3EE] bg-[#0D1117] border border-neutral-800/80 px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#22D3EE]" /> Back
        </button>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
            SecOps Node Online
          </span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="relative z-10 w-full max-w-5xl mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-[#22D3EE]" />
          SETTINGS & TELEMETRY
        </h1>
        <p className="text-neutral-400 text-sm">Fine-tune system security, neural inference parameters, and interface preferences.</p>
      </div>

      {error && (
        <div className="w-full max-w-5xl mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Dashboard Grid Container */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Navigation Sidebar */}
        <div className="md:col-span-1 bg-[#0D1117]/90 border border-neutral-800/80 rounded-2xl p-3 h-fit backdrop-blur-xl shadow-2xl">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 px-3 py-2">
            Navigation Hub
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
                      ? 'bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/25 shadow-sm' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#22D3EE]' : 'text-neutral-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#22D3EE]' : 'text-neutral-700'}`} />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Content Panel */}
        <div className="md:col-span-3 bg-[#0D1117]/90 border border-neutral-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSave} className="space-y-8">

            {/* 1. SECURITY TAB VIEW */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1 flex items-center gap-2 font-mono">
                    <Shield className="w-4 h-4" /> Security & Protection Protocols
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Manage real-time network interception, heuristic phishing filters, and TLS handshake checks.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Real-time URL Protection', desc: 'Actively intercept and inspect links prior to browser navigation', state: realTimeProtection, setter: setRealTimeProtection },
                    { title: 'Phishing Detection', desc: 'Machine learning heuristic evaluation for known zero-day spoof patterns', state: phishingDetection, setter: setPhishingDetection },
                    { title: 'SSL Verification', desc: 'Inspect certificate authority validity and encrypted tunnel integrity', state: sslVerification, setter: setSslVerification },
                    { title: 'Redirect Chain Detection', desc: 'Monitor multi-hop redirects and malicious URL obfuscation tactics', state: redirectDetection, setter: setRedirectDetection },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl hover:border-neutral-700/80 transition">
                      <div className="pr-4">
                        <h3 className="text-xs font-medium text-white">{item.title}</h3>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
                      </div>
                      <ToggleSwitch checked={item.state} onChange={item.setter} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. SCANNER TAB VIEW */}
            {activeTab === 'scanner' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1 flex items-center gap-2 font-mono">
                    <Sliders className="w-4 h-4" /> Scanner Configuration & Heuristics
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Calibrate sensitivity thresholds and lexical analysis engines for vulnerability scans.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Threshold Slider Card */}
                  <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-xs font-medium text-white flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-[#22D3EE]" /> Detection Threshold Confidence
                      </label>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] font-semibold">
                        {detectionThreshold}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={detectionThreshold}
                      onChange={(e) => setDetectionThreshold(Number(e.target.value))}
                      className="w-full accent-[#22D3EE] bg-neutral-900 cursor-pointer h-2 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-2">
                      <span>50% (Permissive)</span>
                      <span>75% (Standard)</span>
                      <span>100% (Strict)</span>
                    </div>
                  </div>

                  {/* Scan Depth Selector */}
                  <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-medium text-white">Inspection Scan Depth</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Determines speed versus deep lexical DOM parsing depth.</p>
                    </div>
                    <select
                      value={scanDepth}
                      onChange={(e) => setScanDepth(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 text-xs text-[#22D3EE] rounded-xl px-3.5 py-2.5 outline-none font-mono focus:border-[#22D3EE] cursor-pointer"
                    >
                      <option value="Fast">Fast (Lexical Only)</option>
                      <option value="Standard">Standard (Balanced)</option>
                      <option value="Deep">Deep (Full Sandbox)</option>
                    </select>
                  </div>

                  {/* Additional Toggles */}
                  {[
                    { title: 'URL Feature Analysis', desc: 'Extract lexical string attributes (length, entropy, special characters)', state: urlFeatureAnalysis, setter: setUrlFeatureAnalysis },
                    { title: 'Domain Reputation Lookup', desc: 'Cross-reference WHOIS age, registrar blacklists, and threat feeds', state: domainReputation, setter: setDomainReputation },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
                      <div className="pr-4">
                        <h3 className="text-xs font-medium text-white">{item.title}</h3>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
                      </div>
                      <ToggleSwitch checked={item.state} onChange={item.setter} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. APPEARANCE & THEME TAB VIEW */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1 flex items-center gap-2 font-mono">
                    <Palette className="w-4 h-4" /> Appearance & Theme Selection
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Customize your visual workspace interface with instant toggle capabilities.
                  </p>
                </div>

                {/* Theme Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setTheme('dark')}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isDark 
                        ? 'bg-[#0C1220] border-cyan-500 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500' 
                        : 'bg-[#05070A] border-neutral-800/80 hover:border-neutral-700 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#101828] border border-[#1D2939] flex items-center justify-center">
                        <Sun className="w-5 h-5 text-amber-400" />
                      </div>
                      {isDark && (
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold font-mono">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Cyber SecOps Dark</h3>
                    <p className="text-xs text-neutral-400">Deep obsidian obsidian background with glowing electric cyan telemetry highlights.</p>
                  </div>

                  <div 
                    onClick={() => setTheme('light')}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      !isDark 
                        ? 'bg-white border-cyan-500 shadow-xl shadow-cyan-950/20 ring-1 ring-cyan-500' 
                        : 'bg-[#05070A] border-neutral-800/80 hover:border-neutral-700 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <Moon className="w-5 h-5 text-slate-700" />
                      </div>
                      {!isDark && (
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-600 text-[10px] font-bold font-mono">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Daylight Clarity Light</h3>
                    <p className="text-xs text-slate-600">Clean slate canvas with high-contrast typography and clear layout cards.</p>
                  </div>
                </div>

                {/* Quick Toggle Action Box */}
                <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Global Workspace Toggle</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Instantly flip themes across the entire web application.</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-800 bg-[#0C1220] hover:bg-[#101828] text-xs font-semibold text-white transition cursor-pointer"
                  >
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
                    <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. AI DETECTION TAB VIEW */}
            {activeTab === 'ai' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1 flex items-center gap-2 font-mono">
                    <Cpu className="w-4 h-4" /> AI Model & Transformer Weights
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Configure machine learning model architectures and deep classification weights.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-medium text-white">Transformer Architecture</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Primary neural network backend model for text vectorization.</p>
                    </div>
                    <select
                      value={transformerModel}
                      onChange={(e) => setTransformerModel(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 text-xs text-[#22D3EE] rounded-xl px-3.5 py-2.5 outline-none font-mono focus:border-[#22D3EE] cursor-pointer"
                    >
                      <option value="BERT-Phish-v4">BERT-Phish-v4 (Recommended)</option>
                      <option value="RoBERTa-Sec-Base">RoBERTa-Sec-Base</option>
                      <option value="DistilBERT-FastScan">DistilBERT-FastScan</option>
                    </select>
                  </div>

                  <div className="p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-medium text-white">Heuristic Sensitivity Profile</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Control aggression levels against zero-day URL phishing campaigns.</p>
                    </div>
                    <select
                      value={heuristicSensitivity}
                      onChange={(e) => setHeuristicSensitivity(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 text-xs text-[#22D3EE] rounded-xl px-3.5 py-2.5 outline-none font-mono focus:border-[#22D3EE] cursor-pointer"
                    >
                      <option value="Conservative">Conservative</option>
                      <option value="Balanced">Balanced</option>
                      <option value="Aggressive">Aggressive</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
                    <div className="pr-4">
                      <h3 className="text-xs font-medium text-white">Ensemble Model Aggregation</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Merge Random Forest lexical calculations with deep Transformer confidence scores.</p>
                    </div>
                    <ToggleSwitch checked={ensembleScoring} onChange={setEnsembleScoring} />
                  </div>
                </div>
              </div>
            )}

            {/* 5. NOTIFICATIONS TAB VIEW */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1 flex items-center gap-2 font-mono">
                    <Bell className="w-4 h-4" /> Notification Channels & Alerting
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Specify delivery channels for security warnings and weekly threat intelligence summaries.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Email Incident Alerts', desc: 'Dispatch immediate email reports upon critical zero-day threat interception', state: emailAlerts, setter: setEmailAlerts, icon: Mail },
                    { title: 'Browser Push Notifications', desc: 'Trigger instant desktop notifications during active URL navigation scans', state: pushNotifications, setter: setPushNotifications, icon: Smartphone },
                    { title: 'Weekly Threat Digest', desc: 'Consolidated report of blocked domains and security statistics every Monday', state: weeklyDigest, setter: setWeeklyDigest, icon: Globe },
                  ].map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
                        <div className="flex items-center gap-3.5 pr-4">
                          <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#22D3EE] shrink-0">
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-xs font-medium text-white">{item.title}</h3>
                            <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                        <ToggleSwitch checked={item.state} onChange={item.setter} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. PRIVACY TAB VIEW */}
            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1 flex items-center gap-2 font-mono">
                    <Lock className="w-4 h-4" /> Data Privacy & Telemetry
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Manage database scan history retention and anonymous community threat sharing.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
                    <div className="pr-4">
                      <h3 className="text-xs font-medium text-white">Store Scan History in Database</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Maintain a secure local record of past URL analyses for dashboard auditing.</p>
                    </div>
                    <ToggleSwitch checked={storeScanHistory} onChange={setStoreScanHistory} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
                    <div className="pr-4">
                      <h3 className="text-xs font-medium text-white">Anonymous Threat Telemetry Sharing</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Contribute anonymized malicious URL patterns to help improve global detection models.</p>
                    </div>
                    <ToggleSwitch checked={telemetrySharing} onChange={setTelemetrySharing} />
                  </div>
                </div>
              </div>
            )}

            {/* 7. SYSTEM TAB VIEW */}
            {activeTab === 'system' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1 flex items-center gap-2 font-mono">
                    <Server className="w-4 h-4" /> System & Backend Connectivity
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Configure Node.js/Express backend API routing and automatic database auditing.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white mb-2 flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-[#22D3EE]" /> Backend Express & ML API Endpoint
                    </label>
                    <div className="relative">
                      <Server className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        className="w-full bg-[#05070A] border border-neutral-800 focus:border-[#22D3EE] rounded-xl pl-10 pr-4 py-3 text-white text-xs font-mono outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#05070A] border border-neutral-800/60 rounded-xl">
                    <div className="pr-4">
                      <h3 className="text-xs font-medium text-white">Automatic Scan Auditing</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Log scan results automatically into MongoDB database collections.</p>
                    </div>
                    <ToggleSwitch checked={autoLog} onChange={setAutoLog} />
                  </div>
                </div>
              </div>
            )}

            {/* 8. ACCOUNT TAB VIEW */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xs font-semibold text-[#22D3EE] uppercase tracking-wider mb-1 flex items-center gap-2 font-mono">
                    <User className="w-4 h-4" /> Operator Account & Credentials
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Manage your SecOps profile credentials and session tokens.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white mb-2">Operator Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-[#05070A] border border-neutral-800 focus:border-[#22D3EE] rounded-xl px-4 py-3 text-white text-xs outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white mb-2">SecOps Email Address</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-[#05070A] border border-neutral-800 focus:border-[#22D3EE] rounded-xl px-4 py-3 text-white text-xs outline-none transition font-mono"
                    />
                  </div>

                  {/* Danger Zone Section */}
                  <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-between flex-wrap gap-4 p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                    <div>
                      <h3 className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" /> Revoke Session Credentials
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Invalidate all active API bearer tokens and terminate current session.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-mono transition cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" /> Revoke Tokens
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Action Controls */}
            <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-between flex-wrap gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-[#05070A] border border-neutral-800 px-4 py-3 rounded-xl transition cursor-pointer font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#22D3EE]" /> Reset Defaults
              </button>

              <div className="flex items-center gap-3">
                {saved && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
                    <Check className="w-3.5 h-3.5" /> Saved successfully
                  </span>
                )}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#22D3EE] to-blue-600 hover:opacity-90 text-black font-semibold px-6 py-3 rounded-xl transition text-xs shadow-lg shadow-cyan-950/40 cursor-pointer"
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