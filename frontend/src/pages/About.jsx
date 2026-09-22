import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Shield, 
  Brain, 
  Cpu, 
  Search, 
  ScanSearch, 
  Lock, 
  Eye, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  Network, 
  Zap,
  ArrowRight
} from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#FAFAFA] flex flex-col justify-between relative overflow-x-hidden">
      {/* Background VFX Glow Orbs & Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#EC4899]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-30" />

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-10 relative z-10 flex-grow">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate('/')} 
            className="text-xs font-semibold text-[#8B5CF6] hover:text-[#C4B5FD] flex items-center gap-2 transition-all cursor-pointer bg-[#111118] border border-[#27272F] px-4 py-2 rounded-xl shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6]">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-wider uppercase text-[#A1A1AA]">WebShield AI Platform</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111118] border border-[#8B5CF6]/30 text-[#C4B5FD] text-xs font-semibold mb-6 uppercase tracking-wider shadow-lg shadow-purple-950/20">
            <Zap className="w-3.5 h-3.5 text-[#8B5CF6]" /> AI-Powered Website Security
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Protect Your Digital Journey with <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">WebShield AI</span>
          </h1>
          <p className="text-[#A1A1AA] text-base sm:text-lg mb-8 leading-relaxed">
            WebShield AI analyzes URLs and identifies suspicious website characteristics using advanced lexical feature extraction and machine-learning-based detection models.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-950/40 flex items-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              Start Scanning <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3.5 rounded-xl bg-[#111118] hover:bg-[#1A1528] border border-[#27272F] text-neutral-300 hover:text-white font-semibold text-sm transition-all cursor-pointer shadow-sm"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* What is WebShield AI Section */}
        <div className="bg-[#111118]/90 backdrop-blur-xl border border-[#27272F] p-8 rounded-3xl mb-16 shadow-2xl shadow-purple-950/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">What is WebShield AI?</h2>
              <p className="text-xs text-[#8B5CF6] font-medium uppercase tracking-wider">Next-Generation Threat Intelligence</p>
            </div>
          </div>
          <p className="text-[#A1A1AA] text-sm leading-relaxed">
            WebShield AI is a machine-learning-based website security platform designed to analyze URLs and identify potentially suspicious or phishing websites. The system thoroughly examines critical URL structural characteristics and utilizes a trained classification model to generate an immediate, comprehensive risk assessment.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] mb-2 block">Workflow Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How WebShield AI Works</h2>
            <p className="text-[#A1A1AA] text-sm mt-2">
              From URL input to risk assessment in milliseconds through our streamlined analysis pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#111118] border border-[#27272F] p-6 rounded-2xl relative transition-all duration-200 hover:border-[#8B5CF6]/50 group">
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-600 group-hover:text-[#8B5CF6] transition-colors">01</div>
              <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6] mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Enter URL</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Input any target link into the scanning interface for instantaneous evaluation.
              </p>
            </div>

            <div className="bg-[#111118] border border-[#27272F] p-6 rounded-2xl relative transition-all duration-200 hover:border-[#8B5CF6]/50 group">
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-600 group-hover:text-[#8B5CF6] transition-colors">02</div>
              <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#EC4899] mb-4">
                <ScanSearch className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Extract Features</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Lexical and structural rules analyze domain properties, length, and indicators.
              </p>
            </div>

            <div className="bg-[#111118] border border-[#27272F] p-6 rounded-2xl relative transition-all duration-200 hover:border-[#8B5CF6]/50 group">
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-600 group-hover:text-[#8B5CF6] transition-colors">03</div>
              <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6] mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Machine Learning</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Evaluates feature vectors against trained Random Forest threat patterns.
              </p>
            </div>

            <div className="bg-[#111118] border border-[#27272F] p-6 rounded-2xl relative transition-all duration-200 hover:border-[#8B5CF6]/50 group">
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-600 group-hover:text-[#8B5CF6] transition-colors">04</div>
              <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Risk Assessment</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Deliver clear risk levels, confidence scores, and security recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Machine Learning Engine & ShieldSense AI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          
          {/* Machine Learning Engine Card */}
          <div className="bg-[#111118]/90 backdrop-blur-xl border border-[#27272F] p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6]">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Machine Learning Engine</h3>
              </div>
              <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed mb-6">
                Our classification models leverage URL feature extraction and structural lexical analysis. By mapping multi-dimensional URL characteristics into a trained Random Forest classifier, WebShield AI effectively calculates threat probabilities and spots spoofed domain patterns.
              </p>
            </div>
            <div className="bg-[#0A0A0F] border border-[#27272F] p-4 rounded-2xl font-mono text-xs text-[#8B5CF6] flex items-center justify-center gap-2 text-center">
              <span>URL</span> <ArrowRight className="w-3.5 h-3.5 text-neutral-500" /> 
              <span>Features</span> <ArrowRight className="w-3.5 h-3.5 text-neutral-500" /> 
              <span>Random Forest</span> <ArrowRight className="w-3.5 h-3.5 text-neutral-500" /> 
              <span>Prediction</span>
            </div>
          </div>

          {/* ShieldSense AI Card */}
          <div className="bg-[#111118]/90 backdrop-blur-xl border border-[#27272F] p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#EC4899]">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Meet ShieldSense AI</h3>
              </div>
              <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed mb-6">
                Powered by Gemini AI, ShieldSense is your dedicated security companion integrated directly into the platform. It helps users break down scan results, interpret suspicious URL indicators, and answer general web safety questions in real time.
              </p>
            </div>
            <div className="bg-[#0A0A0F] border border-[#27272F] p-4 rounded-2xl text-xs text-[#A1A1AA] flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#EC4899] shrink-0" />
              <span>Provides contextual explanations while respecting strict data privacy boundaries.</span>
            </div>
          </div>

        </div>

        {/* Security & Privacy Section */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] mb-2 block">Privacy First Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Security & Privacy Commitments</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#111118] border border-[#27272F] p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6] mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Secure Processing</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Backend communication is routed safely through encrypted channels without exposing sensitive tokens.
              </p>
            </div>

            <div className="bg-[#111118] border border-[#27272F] p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#10B981] mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Transparent Results</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Clear feature breakdowns and confidence scores so you understand why a URL was flagged.
              </p>
            </div>

            <div className="bg-[#111118] border border-[#27272F] p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#EC4899] mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Minimal Telemetry</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Designed to minimize unnecessary collection of sensitive user information during scans.
              </p>
            </div>

            <div className="bg-[#111118] border border-[#27272F] p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6] mb-4">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Audit Logging</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Scan logs are maintained securely in database records to support auditing and history tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div className="bg-[#111118]/90 backdrop-blur-xl border border-[#27272F] p-8 rounded-3xl mb-20 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] mb-2 block">Robust Engineering</span>
            <h2 className="text-2xl font-bold text-white">Technology Stack</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-[#0A0A0F] border border-[#27272F] p-4 rounded-2xl text-center">
              <span className="text-[11px] text-[#8B5CF6] uppercase font-semibold block mb-1">Frontend</span>
              <span className="text-xs font-bold text-white">React & Tailwind</span>
            </div>
            <div className="bg-[#0A0A0F] border border-[#27272F] p-4 rounded-2xl text-center">
              <span className="text-[11px] text-[#8B5CF6] uppercase font-semibold block mb-1">Backend</span>
              <span className="text-xs font-bold text-white">Node.js / Express</span>
            </div>
            <div className="bg-[#0A0A0F] border border-[#27272F] p-4 rounded-2xl text-center">
              <span className="text-[11px] text-[#8B5CF6] uppercase font-semibold block mb-1">Machine Learning</span>
              <span className="text-xs font-bold text-white">Scikit-Learn</span>
            </div>
            <div className="bg-[#0A0A0F] border border-[#27272F] p-4 rounded-2xl text-center">
              <span className="text-[11px] text-[#8B5CF6] uppercase font-semibold block mb-1">AI Assistant</span>
              <span className="text-xs font-bold text-white">Gemini AI</span>
            </div>
            <div className="bg-[#0A0A0F] border border-[#27272F] p-4 rounded-2xl text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] text-[#8B5CF6] uppercase font-semibold block mb-1">Database</span>
              <span className="text-xs font-bold text-white">MongoDB & Mongoose</span>
            </div>
          </div>
        </div>

        {/* Important Security Disclaimer */}
        <div className="bg-[#111118]/60 border border-[#27272F] p-6 rounded-2xl mb-20 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Important Security Disclaimer</h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              WebShield AI provides an automated risk assessment based on available URL and model features. A prediction should not be treated as a guarantee that a website is safe or malicious. Users should avoid entering sensitive credentials on suspicious websites and verify important links through trusted sources.
            </p>
          </div>
        </div>

        {/* Call To Action */}
        <div className="bg-gradient-to-r from-[#8B5CF6]/20 via-[#111118] to-[#EC4899]/20 border border-[#27272F] p-8 sm:p-12 rounded-3xl text-center shadow-2xl relative overflow-hidden mb-10">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to check a website?</h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA]">
              Analyze a URL and see what WebShield AI finds in milliseconds.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-950/40 inline-flex items-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              Scan a URL <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Professional Footer */}
      <footer className="bg-[#111118] border-t border-[#27272F] py-8 px-4 sm:px-8 text-center text-xs text-[#A1A1AA] space-y-2">
        <p className="font-semibold text-white">WebShield AI Platform</p>
        <p>AI-powered website and phishing risk analysis</p>
        <div className="flex justify-center gap-6 pt-2 text-[#8B5CF6]">
          <button onClick={() => navigate('/')} className="hover:underline cursor-pointer">Home</button>
          <button onClick={() => navigate('/about')} className="hover:underline cursor-pointer">About</button>
          <button onClick={() => navigate('/feedback')} className="hover:underline cursor-pointer">Feedback</button>
        </div>
      </footer>
    </div>
  );
}