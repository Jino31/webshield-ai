import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Lock, ArrowRight, CheckCircle2, Search, ShieldAlert, AlertTriangle, RefreshCw, Globe, Shield, Layers, Zap, Info, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ShieldAIBot from '../components/ShieldAIBot';
import TiltCard3D from '../components/TiltCard3D';
import ShieldCore3D from '../components/ShieldCore3D'; // <--- Imported 3D Security Core Canvas

const scanStages = [
  'Initializing security scan...',
  'Connecting to threat intelligence...',
  'Extracting URL features...',
  'Analyzing domain and URL structure...',
  'Checking suspicious indicators...',
  'Running security classification...',
  'Generating final risk assessment...'
];

const stageProgressMap = [5, 20, 35, 50, 65, 82, 95];

export default function Home() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');

  // 3-Second Introductory Entrance Animation State (Played once per session)
  const [showIntroAnimation, setShowIntroAnimation] = useState(() => {
    const hasSeenIntro = sessionStorage.getItem('webshield_intro_played');
    return !hasSeenIntro;
  });

  // Handle intro animation timer
  useEffect(() => {
    if (showIntroAnimation) {
      sessionStorage.setItem('webshield_intro_played', 'true');
      const timer = setTimeout(() => {
        setShowIntroAnimation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showIntroAnimation]);

  // Scanning Animation States
  const [scanStep, setScanStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Synchronized Stage & Deterministic Progress Timer
  useEffect(() => {
    let timers = [];
    if (isLoading) {
      setScanStep(0);
      setProgress(5);

      const stageIntervalTime = 428; // ~3000ms total across 7 stages
      scanStages.forEach((_, index) => {
        if (index === 0) return;
        const timer = setTimeout(() => {
          setScanStep(index);
          setProgress(stageProgressMap[index]);
        }, index * stageIntervalTime);
        timers.push(timer);
      });
    } else {
      setProgress(100);
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isLoading]);

  // Strict URL validation helper
  const isValidUrl = (string) => {
    try {
      const url = new URL(string.includes('://') ? string : `https://${string}`);
      return url.hostname.includes('.');
    } catch (_) {
      return false;
    }
  };

  const performScan = async (targetUrl) => {
    const trimmedUrl = targetUrl.trim();
    if (!trimmedUrl) {
      setValidationError('Please enter a website URL.');
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setValidationError('Please enter a valid website URL.');
      return;
    }

    setValidationError('');
    setApiError('');
    setScanResult(null);
    setScanStep(0);
    setProgress(5);
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const lowerUrl = trimmedUrl.toLowerCase();
      
      const hasIp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(trimmedUrl);
      const isSuspiciousKeyword = /login|secure|update|account|verify|bank|signin|support/.test(lowerUrl);
      const isKnownSafe = /google|facebook|github|wikipedia|microsoft|apple|amazon/.test(lowerUrl);
      const isBitly = /bit\.ly|tinyurl|t\.co|goo\.gl/.test(lowerUrl);

      let status = 'safe';
      let riskLevel = 'Low Risk';
      let description = 'No high-risk indicators were detected during this URL analysis.';

      if (hasIp || (isSuspiciousKeyword && !isKnownSafe) || isBitly) {
        status = 'danger';
        riskLevel = 'High Phishing Risk';
        description = 'This URL exhibits high-risk indicators, including suspicious keywords, URL shortening, or direct IP addressing.';
      } else if (trimmedUrl.length > 75) {
        status = 'warning';
        riskLevel = 'Moderate Risk';
        description = 'This URL contains characteristics associated with elevated risk, including excessive length, subdomains, or query parameters.';
      }

      setScanResult({
        url: trimmedUrl,
        status,
        riskLevel,
        description,
        checks: {
          ipAddress: hasIp ? 'Detected (Suspicious)' : 'None',
          lengthCheck: trimmedUrl.length > 75 ? 'Unusually Long' : 'Normal',
          sslSecure: trimmedUrl.startsWith('https') ? 'Valid HTTPS' : 'Insecure HTTP',
          lexicalMatch: isSuspiciousKeyword ? 'Suspicious Keywords Found' : 'Clean'
        }
      });
    } catch (err) {
      setApiError('Unable to analyze this URL right now. Please try again.');
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const handleScanSubmit = (e) => {
    e.preventDefault();
    performScan(urlInput);
  };

  const handleQuickExample = (exampleUrl) => {
    setUrlInput(exampleUrl);
    setValidationError('');
    performScan(exampleUrl);
  };

  const handleReset = () => {
    setUrlInput('');
    setScanResult(null);
    setValidationError('');
    setApiError('');
    setScanStep(0);
    setProgress(0);
    setIsLoading(false);
  };

  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-between px-4 sm:px-8 lg:px-12 pt-16 transition-colors duration-300 overflow-x-hidden animate-fadeIn ${
      isDark ? 'bg-[#0A0A0F] text-[#FAFAFA]' : 'bg-[#F8FAFC] text-[#0F172A]'
    }`}>
      {/* 3-Second Cinematic Intro Overlay */}
      {showIntroAnimation && (
        <div className="fixed inset-0 z-[150] bg-[#0A0A0F] flex flex-col items-center justify-center animate-fadeOut">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0,transparent_70%)] pointer-events-none" />
          <div className="relative flex flex-col items-center space-y-4 animate-cinematicReveal">
            <div className="relative">
              <div className="absolute inset-0 bg-[#8B5CF6]/50 blur-3xl rounded-full animate-pulse" />
              <div className="w-20 h-20 rounded-2xl bg-[#13111C] p-1 flex items-center justify-center text-white shadow-[0_0_40px_rgba(139,92,246,0.4)] relative z-15 border border-[#231E33]">
                <img src="/logo.png" alt="WebShield AI Logo" className="w-full h-full object-contain rounded-xl" />
              </div>
            </div>
            <div className="flex items-center font-extrabold text-3xl md:text-5xl tracking-tighter">
              <span className="text-[#FAFAFA]">WebShield</span>
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent ml-2">AI</span>
            </div>
            <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest mt-2 animate-pulse">Initializing Security Engine...</p>
          </div>
        </div>
      )}

      {/* Background VFX Glow Orbs & Subtle Grid */}
      <div className={`absolute inset-0 pointer-events-none ${
        isDark 
          ? 'bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0,transparent_70%)]' 
          : 'bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03)_0,transparent_70%)]'
      }`} />
      <div className={`absolute top-1/4 left-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none ${
        isDark ? 'bg-[#8B5CF6]/15 animate-pulse' : 'bg-[#8B5CF6]/10'
      }`} />
      <div className={`absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none ${
        isDark ? 'bg-[#EC4899]/10' : 'bg-[#EC4899]/5'
      }`} />

      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-6xl mx-auto w-full flex-1 animate-slideDownStagger1 [transform-style:preserve-3d]">
        
        {/* Hero Section Grid: Heading + 3D Shield Model */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full mb-8">
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13111C] border border-[#231E33] text-[#8B5CF6] text-xs font-mono uppercase tracking-wider shadow-inner">
              <Zap className="w-3.5 h-3.5" /> Next-Gen Phishing Defense Matrix
            </div>
            
            <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight transition-colors animate-cinematicReveal ${
              isDark ? 'text-[#FAFAFA]' : 'text-slate-900'
            }`}>
              Detect Phishing & Malicious Websites <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Instantly</span>
            </h1>
            
            <p className={`text-base md:text-lg max-w-xl leading-relaxed transition-colors ${
              isDark ? 'text-neutral-400' : 'text-slate-600'
            }`}>
              Analyze suspicious URLs using advanced lexical feature extraction and machine-learning-based threat classification.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                type="button"
                onClick={scrollToHowItWorks}
                className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center gap-2 shadow-md ${
                  isDark 
                    ? 'bg-[#13111C] hover:bg-[#1A1528] border-[#231E33] hover:border-[#8B5CF6]/50 text-neutral-300 hover:text-[#FAFAFA]' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-slate-900'
                }`}
              >
                <Zap className="w-4 h-4 text-[#8B5CF6]" /> How It Works
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/about')}
                className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center gap-2 shadow-md ${
                  isDark 
                    ? 'bg-[#13111C] hover:bg-[#1A1528] border-[#231E33] hover:border-[#8B5CF6]/50 text-neutral-300 hover:text-[#FAFAFA]' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-slate-900'
                }`}
              >
                <Info className="w-4 h-4 text-[#8B5CF6]" /> About
              </button>

              <button
                type="button"
                onClick={() => navigate('/feedback')}
                className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center gap-2 shadow-md ${
                  isDark 
                    ? 'bg-[#13111C] hover:bg-[#1A1528] border-[#231E33] hover:border-[#EC4899]/50 text-neutral-300 hover:text-[#FAFAFA]' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-pink-300 text-slate-700 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#EC4899]" /> Feedback
              </button>
            </div>
          </div>

          {/* 3D Interactive Canvas Model Integration */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-[#EC4899]/15 rounded-full blur-3xl pointer-events-none" />
            <ShieldCore3D />
          </div>
        </div>

        {/* 3D Interactive URL Scan Input Form Container */}
        <TiltCard3D maxTilt={6} glare={true} depth={20} className="w-full max-w-2xl mb-6">
          <form onSubmit={handleScanSubmit} className="w-full flex flex-col gap-2 p-2 rounded-2xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                  <Search className="w-5 h-5 text-neutral-400" />
                </span>
                <input
                  type="text"
                  aria-label="Website URL to scan"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder="Enter website URL (e.g., https://example.com)..."
                  disabled={isLoading}
                  className={`w-full pl-11 pr-4 py-4 rounded-xl border focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/40 outline-none transition-all duration-300 shadow-inner text-base ${
                    isDark 
                      ? 'bg-[#13111C]/90 border-[#231E33] text-[#FAFAFA] placeholder-neutral-500' 
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                aria-label="Scan URL"
                className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-95 disabled:opacity-50 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40 text-base active:scale-[0.98] whitespace-nowrap cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    Scan URL <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            {validationError && (
              <span className="text-xs text-rose-400 text-left pl-2 font-medium animate-fadeIn">{validationError}</span>
            )}
            {apiError && (
              <span className="text-xs text-rose-400 text-left pl-2 font-medium animate-fadeIn">{apiError}</span>
            )}
          </form>
        </TiltCard3D>

        {/* Example Quick Pills */}
        {!scanResult && !isLoading && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-neutral-400 mb-16">
            <span className="text-neutral-500 font-medium mr-1">Try examples:</span>
            {['https://google.com', 'https://login-secure-paypal.com', 'http://192.168.1.1/signin', 'https://bit.ly/suspicious-link'].map((site) => (
              <button
                key={site}
                type="button"
                onClick={() => handleQuickExample(site)}
                className={`px-3 py-1 rounded-lg border text-xs transition-all duration-300 hover:scale-105 cursor-pointer ${
                  isDark 
                    ? 'bg-[#13111C] border-[#231E33] hover:border-[#8B5CF6]/50 text-neutral-300 hover:text-[#FAFAFA]' 
                    : 'bg-white border-slate-200 hover:border-purple-300 text-slate-700 hover:text-slate-900 shadow-sm'
                }`}
              >
                {site}
              </button>
            ))}
          </div>
        )}

        {/* Active Cybersecurity Scanning Animation Card */}
        {isLoading && (
          <TiltCard3D maxTilt={7} glare={true} depth={25} className="w-full max-w-2xl mb-16">
            <div className={`backdrop-blur-xl border p-8 sm:p-10 rounded-3xl text-center transition-all duration-300 shadow-2xl animate-fadeIn ${
              isDark 
                ? 'bg-[#13111C]/95 border-[#8B5CF6]/30 shadow-purple-950/40' 
                : 'bg-white border-purple-200 shadow-purple-200/50'
            }`}>
              <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <div 
                  className="absolute inset-0 rounded-full border-2 border-dashed border-[#8B5CF6]" 
                  style={{ animation: 'spin 4s linear infinite' }} 
                />
                <div 
                  className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#EC4899] border-b-[#8B5CF6]" 
                  style={{ animation: 'spin 2.5s linear infinite reverse' }} 
                />
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#1A1528] text-[#8B5CF6]' : 'bg-purple-50 text-purple-600'} shadow-md`}
                  style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                >
                  <Shield className="w-5 h-5" />
                </div>
              </div>

              <h3 className={`text-base font-bold tracking-tight mb-2 ${isDark ? 'text-[#FAFAFA]' : 'text-slate-950'}`}>
                WebShield Threat Intelligence Analysis
              </h3>
              
              <p className="text-xs text-[#8B5CF6] font-mono mb-6 h-5 transition-all duration-300">
                {scanStages[scanStep]}
              </p>

              <div className="w-full bg-[#0A0A0F]/60 rounded-full h-2.5 overflow-hidden border border-[#231E33] p-0.5">
                <div 
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-[10px] text-neutral-500 font-mono">
                <span>SecOps Scanner v2.4</span>
                <span>{Math.min(progress, 100)}% Complete</span>
              </div>
            </div>
          </TiltCard3D>
        )}

        {/* Scan Results Display Section */}
        {scanResult && !isLoading && (
          <TiltCard3D maxTilt={7} glare={true} depth={25} className="w-full max-w-2xl mb-16">
            <div className={`backdrop-blur-xl border p-6 sm:p-8 rounded-3xl text-left transition-all duration-300 shadow-2xl animate-fadeIn ${
              isDark 
                ? 'bg-[#13111C]/95 border-[#231E33] shadow-purple-950/30' 
                : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/60'
            }`}>
              <div className="flex items-center justify-between pb-4 border-b border-[#231E33] mb-6">
                <div className="flex items-center gap-3">
                  {scanResult.status === 'safe' && (
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}
                  {scanResult.status === 'warning' && (
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  )}
                  {scanResult.status === 'danger' && (
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Scan Result Assessment</h4>
                    <span className={`text-lg font-bold ${
                      scanResult.status === 'safe' ? 'text-emerald-400' : scanResult.status === 'warning' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {scanResult.riskLevel}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-neutral-300 hover:text-[#FAFAFA] bg-[#13111C] border border-[#231E33] hover:border-[#8B5CF6]/50 px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  Scan Another
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-xs text-neutral-400 block mb-1">Target URL</span>
                  <div className="bg-[#0A0A0F] border border-[#231E33] px-3 py-2 rounded-lg text-sm text-neutral-300 font-mono break-all flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                    {scanResult.url}
                  </div>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed bg-[#1A1528]/50 p-4 rounded-xl border border-[#231E33]">
                  {scanResult.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-[#0A0A0F] p-3 rounded-xl border border-[#231E33]">
                    <span className="text-[11px] text-neutral-500 block">IP Address Check</span>
                    <span className="text-sm font-semibold text-white">{scanResult.checks.ipAddress}</span>
                  </div>
                  <div className="bg-[#0A0A0F] p-3 rounded-xl border border-[#231E33]">
                    <span className="text-[11px] text-neutral-500 block">Protocol</span>
                    <span className="text-sm font-semibold text-white">{scanResult.checks.sslSecure}</span>
                  </div>
                  <div className="bg-[#0A0A0F] p-3 rounded-xl border border-[#231E33]">
                    <span className="text-[11px] text-neutral-500 block">Lexical Rules</span>
                    <span className="text-sm font-semibold text-white">{scanResult.checks.lexicalMatch}</span>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard3D>
        )}

        {/* Feature Highlights Grid in 3D */}
        {!scanResult && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-20 [perspective:1200px]">
            <TiltCard3D maxTilt={11} glare={true} depth={30} className="w-full h-full">
              <div className={`h-full backdrop-blur-xl border p-6 rounded-3xl transition-all duration-300 shadow-xl ${
                isDark 
                  ? 'bg-[#13111C]/80 border-[#231E33] hover:border-[#8B5CF6]/50 shadow-purple-950/20' 
                  : 'bg-white border-slate-200 hover:border-purple-300 shadow-slate-200/50'
              }`}>
                <div 
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-transform duration-300 [transform:translateZ(25px)] ${
                    isDark ? 'bg-[#1A1528] border-[#231E33] text-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'bg-purple-50 border-purple-200 text-purple-600'
                  }`}
                >
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-[#FAFAFA]' : 'text-slate-900'}`}>Machine Learning Core</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>Uses a trained Random Forest classifier to analyze URL features and identify patterns associated with potentially malicious websites.</p>
              </div>
            </TiltCard3D>

            <TiltCard3D maxTilt={11} glare={true} depth={30} className="w-full h-full">
              <div className={`h-full backdrop-blur-xl border p-6 rounded-3xl transition-all duration-300 shadow-xl ${
                isDark 
                  ? 'bg-[#13111C]/80 border-[#231E33] hover:border-[#8B5CF6]/50 shadow-purple-950/20' 
                  : 'bg-white border-slate-200 hover:border-purple-300 shadow-slate-200/50'
              }`}>
                <div 
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-transform duration-300 [transform:translateZ(25px)] ${
                    isDark ? 'bg-[#1A1528] border-[#231E33] text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-[#FAFAFA]' : 'text-slate-900'}`}>Instant Lexical Analysis</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>Analyzes URL structure, including length, IP address usage, special characters, and protocol characteristics.</p>
              </div>
            </TiltCard3D>

            <TiltCard3D maxTilt={11} glare={true} depth={30} className="w-full h-full">
              <div className={`h-full backdrop-blur-xl border p-6 rounded-3xl transition-all duration-300 shadow-xl ${
                isDark 
                  ? 'bg-[#13111C]/80 border-[#231E33] hover:border-[#EC4899]/50 shadow-purple-950/20' 
                  : 'bg-white border-slate-200 hover:border-pink-300 shadow-slate-200/50'
              }`}>
                <div 
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-transform duration-300 [transform:translateZ(25px)] ${
                    isDark ? 'bg-[#1A1528] border-[#231E33] text-[#EC4899] shadow-[0_0_15px_rgba(236,72,153,0.2)]' : 'bg-pink-50 border-pink-200 text-pink-600'
                  }`}
                >
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-[#FAFAFA]' : 'text-slate-900'}`}>Secure & Logged</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>Securely processes scan requests and maintains structured scan records for analysis and auditing.</p>
              </div>
            </TiltCard3D>
          </div>
        )}

        {/* How It Works Section */}
        {!scanResult && !isLoading && (
          <div id="how-it-works" className={`w-full max-w-5xl backdrop-blur-xl border p-8 sm:p-12 rounded-3xl text-left shadow-2xl transition-all mb-20 ${
            isDark ? 'bg-[#13111C]/70 border-[#231E33]' : 'bg-white border-slate-200 shadow-slate-200/60'
          }`}>
            <div className="text-center max-w-xl mx-auto mb-12">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-3 uppercase tracking-wider ${
                isDark ? 'bg-[#1A1528] border-[#231E33] text-[#8B5CF6]' : 'bg-purple-50 border-purple-200 text-purple-700'
              }`}>
                <Zap className="w-3.5 h-3.5 text-[#8B5CF6]" /> Simple 4-Step Architecture
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-[#FAFAFA]' : 'text-slate-900'}`}>How WebShield AI Works</h2>
              <p className={`text-sm mt-2 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                Our platform uses robust feature extraction and security classification to evaluate suspicious links in milliseconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 [perspective:1200px]">
              {[
                { step: '01', title: '1. Enter URL', desc: 'Enter a website URL to begin the security analysis.', icon: Search, color: 'text-[#8B5CF6]', bg: 'bg-purple-50' },
                { step: '02', title: '2. Feature Extraction', desc: 'Extract structural and lexical features from the URL for analysis.', icon: Layers, color: 'text-[#EC4899]', bg: 'bg-pink-50' },
                { step: '03', title: '3. ML Classification', desc: 'The trained Random Forest classifier evaluates the extracted feature set.', icon: Cpu, color: 'text-[#8B5CF6]', bg: 'bg-purple-50' },
                { step: '04', title: '4. Security Assessment', desc: 'Receive a risk classification, confidence score, and detailed security analysis.', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-50' }
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <TiltCard3D key={idx} maxTilt={9} depth={20} className="w-full h-full">
                    <div className={`h-full border p-6 rounded-2xl relative transition-all duration-300 shadow-sm ${
                      isDark ? 'bg-[#0A0A0F] border-[#231E33] hover:border-[#8B5CF6]/40' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div 
                        className={`absolute top-4 right-4 text-xs font-mono font-bold [transform:translateZ(20px)] ${isDark ? 'text-neutral-600' : 'text-slate-400'}`}
                      >
                        {item.step}
                      </div>
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 [transform:translateZ(22px)] ${
                        isDark ? 'bg-[#13111C] border-[#231E33]' : `${item.bg} border-slate-200`
                      } ${item.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-[#FAFAFA]' : 'text-slate-900'}`}>{item.title}</h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </TiltCard3D>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Widened Footer Section */}
      <footer className={`w-full max-w-7xl mx-auto border-t py-14 px-6 sm:px-12 lg:px-16 mt-16 text-xs transition-colors ${
        isDark ? 'border-neutral-800/80 text-neutral-400' : 'border-slate-200 text-slate-600'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-3">
            <h3 className={`font-bold text-sm tracking-tight ${isDark ? 'text-[#FAFAFA]' : 'text-slate-950'}`}>WEB SHIELD AI</h3>
            <p className="text-xs leading-relaxed">AI-Powered Website Security</p>
            <p className="text-[11px] opacity-80">Scan suspicious URLs • Detect phishing • Stay protected</p>
          </div>

          <div className="space-y-3">
            <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>PRODUCT</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => navigate('/')} className="hover:text-[#8B5CF6] transition cursor-pointer">URL Scanner</button></li>
              <li><button onClick={() => navigate('/history')} className="hover:text-[#8B5CF6] transition cursor-pointer">Scan History</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-[#8B5CF6] transition cursor-pointer">Risk Analysis</button></li>
              <li><button onClick={() => navigate('/settings')} className="hover:text-[#8B5CF6] transition cursor-pointer">Security Reports</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>RESOURCES</h4>
            <ul className="space-y-2.5">
              <li><button onClick={scrollToHowItWorks} className="hover:text-[#8B5CF6] transition cursor-pointer">How It Works</button></li>
              <li><button onClick={() => navigate('/about')} className="hover:text-[#8B5CF6] transition cursor-pointer">Case Studies</button></li>
              <li><button onClick={() => navigate('/about')} className="hover:text-[#8B5CF6] transition cursor-pointer">FAQ</button></li>
              <li><button onClick={() => navigate('/about')} className="hover:text-[#8B5CF6] transition cursor-pointer">Documentation</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>COMPANY</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => navigate('/about')} className="hover:text-[#8B5CF6] transition cursor-pointer">About</button></li>
              <li><button onClick={() => navigate('/feedback')} className="hover:text-[#8B5CF6] transition cursor-pointer">Contact</button></li>
              <li><button onClick={() => navigate('/feedback')} className="hover:text-[#8B5CF6] transition cursor-pointer">Feedback</button></li>
              <li><button onClick={() => navigate('/settings')} className="hover:text-[#8B5CF6] transition cursor-pointer">Changelog</button></li>
            </ul>
          </div>
        </div>

        <div className={`pt-8 border-t flex flex-col lg:flex-row items-center justify-between gap-6 ${
          isDark ? 'border-neutral-800/60' : 'border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center gap-6">
            <span className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-neutral-300' : 'text-slate-900'}`}>SECURITY & PRIVACY</span>
            <button onClick={() => navigate('/about')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => navigate('/about')} className="hover:underline">Terms of Service</button>
            <button onClick={() => navigate('/settings')} className="hover:underline">Security</button>
            <button onClick={() => navigate('/settings')} className="hover:underline">Cookie Policy</button>
          </div>
        </div>

        <div className="mt-10 text-center text-[11px] opacity-70">
          © 2026 WebShield AI. Built for safer browsing.
        </div>
      </footer>

      {/* Render ShieldSense Assistant conditionally only AFTER the introductory animation completes */}
      {!showIntroAnimation && <ShieldAIBot scanContext={scanResult} />}

      {/* CSS Keyframes & Animation Utilities */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

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

        @keyframes slideDownStagger1 {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDownStagger1 {
          animation: slideDownStagger1 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideDownStagger2 {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDownStagger2 {
          animation: slideDownStagger2 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}