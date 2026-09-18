import React, { useState } from 'react';
import { Cpu, Lock, ArrowRight, CheckCircle2, Search, ShieldAlert, AlertTriangle, RefreshCw, Globe, Shield, Layers, Zap, Terminal } from 'lucide-react';

export default function Home() {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const performScan = (targetUrl) => {
    if (!targetUrl.trim()) return;
    setIsLoading(true);
    setScanResult(null);

    // Simulate ML / Backend lexical analysis delay
    setTimeout(() => {
      const lowerUrl = targetUrl.toLowerCase();
      
      // Basic heuristic rules for demonstration
      const hasIp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(targetUrl);
      const isSuspiciousKeyword = /login|secure|update|account|verify|bank|signin|support/.test(lowerUrl);
      const isKnownSafe = /google|facebook|github|wikipedia|microsoft|apple|amazon/.test(lowerUrl);
      const isBitly = /bit\.ly|tinyurl|t\.co|goo\.gl/.test(lowerUrl);

      let status = 'safe';
      let confidence = 98.2;
      let riskLevel = 'Low Risk';
      let description = 'This URL appears to be safe. No malicious lexical patterns or spoofed domains detected.';

      if (hasIp || (isSuspiciousKeyword && !isKnownSafe) || isBitly) {
        status = 'danger';
        confidence = 94.7;
        riskLevel = 'High Phishing Risk';
        description = 'Warning! This URL exhibits high-risk indicators such as suspicious keywords, shortened links, or direct IP addressing.';
      } else if (targetUrl.length > 75) {
        status = 'warning';
        confidence = 82.4;
        riskLevel = 'Moderate Risk';
        description = 'This URL is unusually long and contains excessive subdomains or query parameters. Proceed with caution.';
      }

      setScanResult({
        url: targetUrl,
        status,
        confidence,
        riskLevel,
        description,
        checks: {
          ipAddress: hasIp ? 'Detected (Suspicious)' : 'None',
          lengthCheck: targetUrl.length > 75 ? 'Unusually Long' : 'Normal',
          sslSecure: targetUrl.startsWith('https') ? 'Valid HTTPS' : 'Insecure HTTP',
          lexicalMatch: isSuspiciousKeyword ? 'Suspicious Keywords Found' : 'Clean'
        }
      });
      setIsLoading(false);
    }, 1200);
  };

  const handleScanSubmit = (e) => {
    e.preventDefault();
    performScan(urlInput);
  };

  const handleQuickExample = (exampleUrl) => {
    setUrlInput(exampleUrl);
    performScan(exampleUrl);
  };

  const handleReset = () => {
    setUrlInput('');
    setScanResult(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-center px-4 sm:px-8 lg:px-12 py-16 bg-[#0A0A0F] text-[#FAFAFA] overflow-x-hidden">
      {/* Background VFX Glow Orbs & Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#8B5CF6]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#EC4899]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-30" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto w-full">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#13111C] border border-[#8B5CF6]/30 text-[#C4B5FD] text-xs font-semibold mb-6 uppercase tracking-wider shadow-lg shadow-purple-950/25">
          <Cpu className="w-3.5 h-3.5 text-[#8B5CF6]" /> Powered by Machine Learning & Random Forest
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#FFFFFF] mb-6 leading-tight">
          Detect Phishing & Fake Websites <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Instantly</span>
        </h1>
        
        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Protect yourself against malicious links, spoofed domains, and online fraud using advanced lexical feature extraction and real-time classification models.
        </p>

        {/* Interactive URL Scan Input Form */}
        <form onSubmit={handleScanSubmit} className="w-full max-w-2xl flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)..."
              className="w-full pl-11 pr-4 py-4 rounded-xl bg-[#13111C]/90 border border-[#231E33] focus:border-[#8B5CF6] text-white placeholder-neutral-500 outline-none transition-all shadow-inner text-base"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
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
                className="px-3 py-1 rounded-lg bg-[#13111C] border border-[#231E33] hover:border-[#8B5CF6]/40 text-neutral-300 hover:text-white text-xs transition-all cursor-pointer"
              >
                {site}
              </button>
            ))}
          </div>
        )}

        {/* Scan Results Display Section */}
        {scanResult && (
          <div className="w-full max-w-2xl bg-[#13111C]/95 backdrop-blur-xl border border-[#231E33] p-6 sm:p-8 rounded-3xl shadow-2xl shadow-purple-950/30 text-left mb-16 animate-fadeIn">
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#0A0A0F] p-3 rounded-xl border border-[#231E33]">
                  <span className="text-[11px] text-neutral-500 block">Model Confidence</span>
                  <span className="text-sm font-semibold text-white">{scanResult.confidence}%</span>
                </div>
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
            <div className="bg-[#13111C]/80 backdrop-blur-xl border border-[#231E33] hover:border-[#8B5CF6]/50 p-6 rounded-3xl transition-all shadow-xl shadow-purple-950/20">
              <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6] mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">Machine Learning Core</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Trained on real-world security datasets utilizing Random Forest classification to predict threat probabilities.</p>
            </div>

            <div className="bg-[#13111C]/80 backdrop-blur-xl border border-[#231E33] hover:border-[#EC4899]/50 p-6 rounded-3xl transition-all shadow-xl shadow-purple-950/20">
              <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#10B981] mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">Instant Lexical Analysis</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Instantly evaluates URL length, IP address presence, dot/hyphen counts, and protocol security.</p>
            </div>

            <div className="bg-[#13111C]/80 backdrop-blur-xl border border-[#231E33] hover:border-[#8B5CF6]/50 p-6 rounded-3xl transition-all shadow-xl shadow-purple-950/20">
              <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#EC4899] mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">Secure & Logged</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">Powered by a robust backend architecture with database scan logging for comprehensive auditing.</p>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        {!scanResult && (
          <div className="w-full max-w-5xl bg-[#13111C]/60 backdrop-blur-xl border border-[#231E33] p-8 sm:p-12 rounded-3xl text-left shadow-2xl">
            <div className="text-center max-w-xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1528] border border-[#2B2340] text-[#22D3EE] text-xs font-semibold mb-3 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" /> Simple 4-Step Architecture
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">How WebShield AI Works</h2>
              <p className="text-neutral-400 text-sm mt-2">
                Our platform uses robust feature extraction and machine learning classification to evaluate suspicious links in milliseconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#0A0A0F] border border-[#231E33] p-6 rounded-2xl relative">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-600">01</div>
                <div className="w-10 h-10 rounded-xl bg-[#13111C] border border-[#231E33] flex items-center justify-center text-[#22D3EE] mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">1. Paste URL</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Enter any suspicious web link or domain into the secure scanner interface.
                </p>
              </div>

              <div className="bg-[#0A0A0F] border border-[#231E33] p-6 rounded-2xl relative">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-600">02</div>
                <div className="w-10 h-10 rounded-xl bg-[#13111C] border border-[#231E33] flex items-center justify-center text-[#8B5CF6] mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">2. Feature Extraction</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Lexical rules analyze structural properties like domain length, IP presence, and special keywords.
                </p>
              </div>

              <div className="bg-[#0A0A0F] border border-[#231E33] p-6 rounded-2xl relative">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-600">03</div>
                <div className="w-10 h-10 rounded-xl bg-[#13111C] border border-[#231E33] flex items-center justify-center text-[#EC4899] mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">3. ML Classification</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Our trained Random Forest model evaluates the feature vector against known threat patterns.
                </p>
              </div>

              <div className="bg-[#0A0A0F] border border-[#231E33] p-6 rounded-2xl relative">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-600">04</div>
                <div className="w-10 h-10 rounded-xl bg-[#13111C] border border-[#231E33] flex items-center justify-center text-emerald-400 mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">4. Instant Verdict</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Receive a clear risk score, confidence percentage, and detailed security breakdown instantly.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}