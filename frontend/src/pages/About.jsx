import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Cpu, Zap, Lock, Database, CheckCircle2, Layers } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#FAFAFA] flex flex-col justify-between p-4 sm:p-8 relative overflow-x-hidden">
      {/* Background VFX Glow Orbs & Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#EC4899]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full pt-6 pb-16 relative z-10">
        {/* Navigation back */}
        <button 
          onClick={() => navigate('/')} 
          className="text-xs font-semibold text-[#8B5CF6] hover:text-[#C4B5FD] mb-6 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Hero Card */}
        <div className="bg-[#111118]/90 backdrop-blur-xl border border-[#27272F] rounded-3xl p-6 sm:p-10 shadow-2xl shadow-purple-950/20 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6] shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A1528] border border-[#2B2340] text-[#8B5CF6] text-[10px] font-bold uppercase tracking-wider mb-1">
                Platform Architecture
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                About <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">WebShield AI</span>
              </h1>
            </div>
          </div>
          <p className="text-[#A1A1AA] text-sm sm:text-base leading-relaxed max-w-2xl">
            WebShield AI is a next-generation phishing detection and web threat intelligence platform engineered to protect users from malicious links, spoofed domains, and zero-day online fraud in milliseconds.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          <div className="bg-[#111118]/80 backdrop-blur-xl border border-[#27272F] hover:border-[#8B5CF6]/50 p-6 rounded-3xl transition-all shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6] mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Machine Learning Core</h2>
            <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed">
              Trained on extensive security threat datasets utilizing Random Forest classification models to calculate precise threat probabilities and risk indicators instantly.
            </p>
          </div>

          <div className="bg-[#111118]/80 backdrop-blur-xl border border-[#27272F] hover:border-[#EC4899]/50 p-6 rounded-3xl transition-all shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#EC4899] mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">ShieldSense AI Assistant</h2>
            <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed">
              Powered by Google Gemini and custom security knowledge bases, ShieldSense provides real-time expert answers regarding URL telemetry and threat vectors securely.
            </p>
          </div>

          <div className="bg-[#111118]/80 backdrop-blur-xl border border-[#27272F] hover:border-[#8B5CF6]/50 p-6 rounded-3xl transition-all shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#10B981] mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Instant Lexical Analysis</h2>
            <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed">
              Analyzes structural characteristics including URL length, subdomain depth, hyphen/dot frequency, IP address hosting, and SSL protocol validity.
            </p>
          </div>

          <div className="bg-[#111118]/80 backdrop-blur-xl border border-[#27272F] hover:border-[#EC4899]/50 p-6 rounded-3xl transition-all shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6] mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Secure Telemetry & Logging</h2>
            <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed">
              Maintains secure audit logs of scan telemetry via a robust Node.js/Express backend and MongoDB database architecture without compromising user anonymity.
            </p>
          </div>

        </div>

        {/* Tech Stack Badge Section */}
        <div className="bg-[#111118]/90 backdrop-blur-xl border border-[#27272F] rounded-3xl p-6 sm:p-8 text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#A1A1AA] mb-4">Built With Modern Stack</h2>
          <div className="flex flex-wrap gap-2">
            {['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Python FastAPI', 'Random Forest ML', 'Google Gemini AI'].map((tech) => (
              <span key={tech} className="px-3 py-1.5 rounded-xl bg-[#0A0A0F] border border-[#27272F] text-xs font-medium text-[#C4B5FD]">
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>

      <footer className="text-center text-[11px] text-[#A1A1AA] py-4 relative z-10">
        WebShield AI Platform • Security & Phishing Defense
      </footer>
    </div>
  );
}