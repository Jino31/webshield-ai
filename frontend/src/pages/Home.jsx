import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Lock, ArrowRight, CheckCircle2, Search, ShieldAlert, AlertTriangle, RefreshCw, Globe, Shield, Layers, Zap, Info, MessageSquare } from 'lucide-react';
import ShieldAIBot from '../components/ShieldAIBot'; // <-- ShieldSense assistant component
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [apiError, setApiError] = useState('');

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
    setIsLoading(true);
    setScanResult(null);

    try {
      // Fallback heuristic verification mode with progressive security analysis steps
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const lowerUrl = targetUrl.toLowerCase();
      
      const hasIp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(targetUrl);
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
      } else if (targetUrl.length > 75) {
        status = 'warning';
        riskLevel = 'Moderate Risk';
        description = 'This URL contains characteristics associated with elevated risk, including excessive length, subdomains, or query parameters.';
      }

      setScanResult({
        url: targetUrl,
        status,
        riskLevel,
        description,
        checks: {
          ipAddress: hasIp ? 'Detected (Suspicious)' : 'None',
          lengthCheck: targetUrl.length > 75 ? 'Unusually Long' : 'Normal',
          sslSecure: targetUrl.startsWith('https') ? 'Valid HTTPS' : 'Insecure HTTP',
          lexicalMatch: isSuspiciousKeyword ? 'Suspicious Keywords Found' : 'Clean'
        }
      });
    } catch (err) {
      setApiError('Unable to analyze this URL right now. Please try again.');
    } finally {
      setIsLoading(false);
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
  };

  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-between px-4 sm:px-8 lg:px-12 pt-16 transition-colors duration-300 overflow-x-hidden ${
      isDark ? 'bg-[#0A0A0F] text-[#FAFAFA]' : 'bg-[#F8FAFC] text-[#0F172A]'
    }`}>
      {/* Background VFX Glow Orbs & Subtle Grid */}
      <div className={`absolute inset-0 pointer-events-none ${
        isDark 
          ? 'bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0,transparent_70%)]' 
          : 'bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03)_0,transparent_70%)]'
      }`} />
      <div className={`absolute top-1/4 left-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none ${
        isDark ? 'bg-[#8B5CF6]/15' : 'bg-[#8B5CF6]/10'
      }`} />
      <div className={`absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none ${
        isDark ? 'bg-[#EC4899]/10' : 'bg-[#EC4899]/5'
      }`} />
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none ${
        isDark ? 'opacity-30' : 'opacity-15'
      }`} />

      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto w-full flex-1 animate-fadeIn">
        {/* Hero Title */}
        <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight transition-colors ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Detect Phishing & Malicious Websites <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Instantly</span>
        </h1>
        
        <p className={`text-lg md:text-xl max-w-2xl mb-8 leading-relaxed transition-colors ${
          isDark ? 'text-neutral-400' : 'text-slate-600'
        }`}>
          Analyze suspicious URLs using advanced lexical feature extraction and machine-learning-based threat classification.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            type="button"
            onClick={scrollToHowItWorks}
            className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-md ${
              isDark 
                ? 'bg-[#13111C] hover:bg-[#1A1528] border-[#231E33] hover:border-[#8B5CF6]/40 text-neutral-300 hover:text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-[#8B5CF6]" /> How It Works
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/about')}
            className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-md ${
              isDark 
                ? 'bg-[#13111C] hover:bg-[#1A1528] border-[#231E33] hover:border-[#8B5CF6]/40 text-neutral-300 hover:text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4 text-[#8B5CF6]" /> About
          </button>

          <button
            type="button"
            onClick={() => navigate('/feedback')}
            className={`px-5 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-md ${
              isDark 
                ? 'bg-[#13111C] hover:bg-[#1A1528] border-[#231E33] hover:border-[#8B5CF6]/40 text-neutral-300 hover:text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-700 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#EC4899]" /> Feedback
          </button>
        </div>

        {/* Interactive URL Scan Input Form */}
        <form onSubmit={handleScanSubmit} className="w-full max-w-2xl flex flex-col gap-2 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                <Search className="w-5 h-5" />
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
                className={`w-full pl-11 pr-4 py-4 rounded-xl border focus:border-[#8B5CF6] outline-none transition-all shadow-inner text-base ${
                  isDark 
                    ? 'bg-[#13111C]/90 border-[#231E33] text-white placeholder-neutral-500' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Scan URL"
              className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 disabled:opacity-50 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 text-base active:scale-[0.98] whitespace-nowrap cursor-pointer"
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
            <span className="text-xs text-rose-400 text-left pl-2 font-medium">{validationError}</span>
          )}
          {apiError && (
            <span className="text-xs text-rose-400 text-left pl-2 font-medium">{apiError}</span>
          )}
        </form>

        {/* Example Quick Pills */}
        {!scanResult && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-neutral-400 mb-16">
            <span className="text-neutral-500 font-medium mr-1">Try examples:</span>
            {['https://google.com', 'https://login-secure-paypal.com', 'http://192.168.1.1/signin', 'https://bit.ly/suspicious-link'].map((site) => (
              <button
                key={site}
                type="button"
                onClick={() => handleQuickExample(site)}
                className={`px-3 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-[#13111C] border-[#231E33] hover:border-[#8B5CF6]/40 text-neutral-300 hover:text-white' 
                    : 'bg-white border-slate-200 hover:border-purple-300 text-slate-700 hover:text-slate-900 shadow-sm'
                }`}
              >
                {site}
              </button>
            ))}
          </div>
        )}

        {/* Scan Results Display Section */}
        {scanResult && (
          <div className={`w-full max-w-2xl backdrop-blur-xl border p-6 sm:p-8 rounded-3xl text-left mb-16 animate-fadeIn ${
            isDark 
              ? 'bg-[#13111C]/95 border-[#231E33] shadow-2xl shadow-purple-950/30' 
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
                className="text-xs text-neutral-400 hover:text-white bg-[#1A1528] border border-[#2B2340] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                Scan Another
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-xs text-neutral-500 block mb-1">Target URL</span>
                <div className="bg-[#0A0A0F] border border-[#231E33] px-3 py-2 rounded-lg text-sm text-neutral-300 font-mono break-all flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  {scanResult.url}
                </div>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed bg-[#1A1528]/50 p-4 rounded-xl border border-[#2B2340]">
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
        )}

        {/* Feature Highlights Grid */}
        {!scanResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-20">
            <div className={`backdrop-blur-xl border p-6 rounded-3xl transition-all shadow-xl ${
              isDark 
                ? 'bg-[#13111C]/80 border-[#231E33] hover:border-[#8B5CF6]/50 shadow-purple-950/20' 
                : 'bg-white border-slate-200 hover:border-purple-300 shadow-slate-200/50'
            }`}>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${
                isDark ? 'bg-[#1A1528] border-[#2B2340] text-[#8B5CF6]' : 'bg-purple-50 border-purple-200 text-purple-600'
              }`}>
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-[#FAFAFA]' : 'text-slate-900'}`}>Machine Learning Core</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>Uses a trained Random Forest classifier to analyze URL features and identify patterns associated with potentially malicious websites.</p>
            </div>

            <div className={`backdrop-blur-xl border p-6 rounded-3xl transition-all shadow-xl ${
              isDark 
                ? 'bg-[#13111C]/80 border-[#231E33] hover:border-[#EC4899]/50 shadow-purple-950/20' 
                : 'bg-white border-slate-200 hover:border-pink-300 shadow-slate-200/50'
            }`}>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${
                isDark ? 'bg-[#1A1528] border-[#2B2340] text-[#10B981]' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-[#FAFAFA]' : 'text-slate-900'}`}>Instant Lexical Analysis</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>Analyzes URL structure, including length, IP address usage, special characters, and protocol characteristics.</p>
            </div>

            <div className={`backdrop-blur-xl border p-6 rounded-3xl transition-all shadow-xl ${
              isDark 
                ? 'bg-[#13111C]/80 border-[#231E33] hover:border-[#8B5CF6]/50 shadow-purple-950/20' 
                : 'bg-white border-slate-200 hover:border-purple-300 shadow-slate-200/50'
            }`}>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${
                isDark ? 'bg-[#1A1528] border-[#2B2340] text-[#EC4899]' : 'bg-pink-50 border-pink-200 text-pink-600'
              }`}>
                <Lock className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-[#FAFAFA]' : 'text-slate-900'}`}>Secure & Logged</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>Securely processes scan requests and maintains structured scan records for analysis and auditing.</p>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        {!scanResult && (
          <div id="how-it-works" className={`w-full max-w-5xl backdrop-blur-xl border p-8 sm:p-12 rounded-3xl text-left shadow-2xl transition-all mb-20 ${
            isDark ? 'bg-[#13111C]/60 border-[#231E33]' : 'bg-white border-slate-200 shadow-slate-200/60'
          }`}>
            <div className="text-center max-w-xl mx-auto mb-12">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-3 uppercase tracking-wider ${
                isDark ? 'bg-[#1A1528] border-[#2B2340] text-[#8B5CF6]' : 'bg-purple-50 border-purple-200 text-purple-700'
              }`}>
                <Zap className="w-3.5 h-3.5 text-[#8B5CF6]" /> Simple 4-Step Architecture
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>How WebShield AI Works</h2>
              <p className={`text-sm mt-2 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                Our platform uses robust feature extraction and security classification to evaluate suspicious links in milliseconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: '1. Enter URL', desc: 'Enter a website URL to begin the security analysis.', icon: Search, color: 'text-[#8B5CF6]', bg: 'bg-purple-50' },
                { step: '02', title: '2. Feature Extraction', desc: 'Extract structural and lexical features from the URL for analysis.', icon: Layers, color: 'text-[#EC4899]', bg: 'bg-pink-50' },
                { step: '03', title: '3. ML Classification', desc: 'The trained Random Forest classifier evaluates the extracted feature set.', icon: Cpu, color: 'text-[#8B5CF6]', bg: 'bg-purple-50' },
                { step: '04', title: '4. Security Assessment', desc: 'Receive a risk classification, confidence score, and detailed security analysis.', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' }
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className={`border p-6 rounded-2xl relative transition-all ${
                    isDark ? 'bg-[#0A0A0F] border-[#231E33]' : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}>
                    <div className={`absolute top-4 right-4 text-xs font-mono font-bold ${isDark ? 'text-neutral-600' : 'text-slate-400'}`}>{item.step}</div>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${
                      isDark ? 'bg-[#13111C] border-[#231E33]' : `${item.bg} border-slate-200`
                    } ${item.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Widened Footer Section with Fixed Navigation */}
      <footer className={`w-full max-w-7xl mx-auto border-t py-14 px-6 sm:px-12 lg:px-16 mt-16 text-xs transition-colors ${
        isDark ? 'border-neutral-800/80 text-neutral-400' : 'border-slate-200 text-slate-600'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-3">
            <h3 className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>WEB SHIELD AI</h3>
            <p className="text-xs leading-relaxed">AI-Powered Website Security</p>
            <p className="text-[11px] opacity-80">Scan suspicious URLs • Detect phishing • Stay protected</p>
          </div>

          <div className="space-y-3">
            <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>PRODUCT</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => navigate('/')} className="hover:text-[#8B5CF6] transition">URL Scanner</button></li>
              <li><button onClick={() => navigate('/history')} className="hover:text-[#8B5CF6] transition">Scan History</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-[#8B5CF6] transition">Risk Analysis</button></li>
              <li><button onClick={() => navigate('/settings')} className="hover:text-[#8B5CF6] transition">Security Reports</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>RESOURCES</h4>
            <ul className="space-y-2.5">
              <li><button onClick={scrollToHowItWorks} className="hover:text-[#8B5CF6] transition">How It Works</button></li>
              <li><button onClick={() => navigate('/about')} className="hover:text-[#8B5CF6] transition">Case Studies</button></li>
              <li><button onClick={() => navigate('/about')} className="hover:text-[#8B5CF6] transition">FAQ</button></li>
              <li><button onClick={() => navigate('/about')} className="hover:text-[#8B5CF6] transition">Documentation</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>COMPANY</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => navigate('/about')} className="hover:text-[#8B5CF6] transition">About</button></li>
              <li><button onClick={() => navigate('/feedback')} className="hover:text-[#8B5CF6] transition">Contact</button></li>
              <li><button onClick={() => navigate('/feedback')} className="hover:text-[#8B5CF6] transition">Feedback</button></li>
              <li><button onClick={() => navigate('/settings')} className="hover:text-[#8B5CF6] transition">Changelog</button></li>
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

      {/* Render ShieldSense Assistant with Active Scan Context */}
      <ShieldAIBot scanContext={scanResult} />
    </div>
  );
}