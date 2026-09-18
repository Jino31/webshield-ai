import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  ArrowRight,
  ShieldCheck,
  Lock,
  Database,
  Layers,
  Activity,
  Server,
  AlertTriangle,
  Search
} from 'lucide-react';

const featureCards = [
  {
    id: 'ml-core',
    tag: 'MODEL ENGINE',
    title: 'Random Forest Classifier',
    description: 'Trained on security benchmark datasets to evaluate lexical feature weights and predict threat probabilities.',
    icon: <Cpu className="w-5 h-5" aria-hidden="true" />
  },
  {
    id: 'feature-engine',
    tag: 'LEXICAL ANALYSIS',
    title: 'Real-Time Feature Extraction',
    description: 'Parses URL strings instantly to inspect character lengths, domain counts, and protocol security states.',
    icon: <Activity className="w-5 h-5 text-[#06B6D4]" aria-hidden="true" />
  },
  {
    id: 'security-log',
    tag: 'AUDIT SYSTEM',
    title: 'MongoDB Scan Logging',
    description: 'Records scan transactions and classification verdicts via an Express backend for persistent auditing.',
    icon: <Database className="w-5 h-5 text-[#10B981]" aria-hidden="true" />
  }
];

const urlFeatures = [
  { title: 'URL Length', desc: 'Measures character volume to flag obfuscated or abnormally long strings.' },
  { title: 'IP Address Check', desc: 'Detects raw numeric IP addresses substituted in place of standard domains.' },
  { title: 'HTTPS Security', desc: 'Validates transport layer security protocol status.' },
  { title: 'Subdomain Count', desc: 'Evaluates period frequency to uncover deceptive nesting.' },
  { title: 'Hyphen Anomalies', desc: 'Identifies dash patterns commonly used in typosquatting.' },
  { title: 'Special Symbols (@)', desc: 'Scans for redirection symbols that manipulate browser paths.' }
];

const pipelineSteps = [
  { step: '01', title: 'Target Submission', desc: 'User inputs a link into the secure React frontend interface.' },
  { step: '02', title: 'Lexical Parsing', desc: 'The Node.js Express backend deconstructs the URL string.' },
  { step: '03', title: 'Model Inference', desc: 'The trained Random Forest model evaluates the feature vector.' },
  { step: '04', title: 'Verdict Output', desc: 'Classification result and confidence score are returned instantly.' }
];

export default function Home() {
  return (
    <main className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center bg-[#0A0A0F] text-[#FAFAFA] overflow-x-hidden selection:bg-[#8B5CF6] selection:text-white">

      {/* Background VFX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(139,92,246,0.06)_0,transparent_60%)] pointer-events-none" />
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-[#06B6D4]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-30" />

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 py-20 lg:py-28 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#13111C] border border-[#231E33] text-[#C4B5FD] text-xs font-semibold mb-6 uppercase tracking-wider shadow-lg shadow-purple-950/20">
          <Cpu className="w-3.5 h-3.5 text-[#8B5CF6]" aria-hidden="true" /> Applied Machine Learning Security Pipeline
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl leading-[1.1]">
          Detect Phishing & Fake Websites <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#06B6D4] bg-clip-text text-transparent">Instantly</span>
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
          WebShield AI is an advanced machine learning platform combining lexical string analysis with a trained Random Forest classifier to defend against modern web spoofing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to="/scanner"
            className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-95 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-950/50 text-base active:scale-[0.98]"
          >
            Launch URL Scanner <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          
          <a
            href="#how-it-works"
            className="bg-[#13111C] hover:bg-[#1A1528] text-neutral-300 hover:text-white font-medium px-6 py-4 rounded-xl border border-[#231E33] transition-all flex items-center justify-center gap-2 text-base"
          >
            How It Works
          </a>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((card) => (
            <div key={card.id} className="bg-[#13111C]/70 backdrop-blur-xl border border-[#231E33] hover:border-[#8B5CF6]/40 p-6 rounded-3xl transition-all shadow-xl shadow-purple-950/20 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1A1528] border border-[#2B2340] flex items-center justify-center text-[#8B5CF6] group-hover:scale-105 transition">
                  {card.icon}
                </div>
                <span className="text-[10px] font-mono text-neutral-500 tracking-wider bg-[#0A0A0F] px-2.5 py-1 rounded-md border border-[#231E33]">
                  {card.tag}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Analyze */}
      <section id="analysis" className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Lexical Feature Extraction</h2>
          <p className="text-neutral-400 text-sm">Key URL indicators analyzed by our classification pipeline.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {urlFeatures.map((feat, idx) => (
            <div key={idx} className="bg-[#13111C]/50 border border-[#231E33] p-5 rounded-2xl hover:border-[#8B5CF6]/30 transition">
              <div className="flex items-center gap-2.5 mb-2">
                <Search className="w-4 h-4 text-[#8B5CF6]" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-white">{feat.title}</h3>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-16 mb-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">How It Works</h2>
          <p className="text-neutral-400 text-sm">The processing flow from link submission to threat verdict.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pipelineSteps.map((step) => (
            <div key={step.step} className="bg-[#13111C]/70 backdrop-blur-xl border border-[#231E33] p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="text-3xl font-extrabold text-[#8B5CF6]/40 mb-3 font-mono">{step.step}</div>
                <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#231E33] bg-[#0A0A0F] px-6 sm:px-12 py-10 mt-auto">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-white font-bold text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" aria-hidden="true" /> WebShield AI
            </span>
            <p className="text-neutral-500">AI-powered phishing and fake website detection.</p>
          </div>

          <div className="text-neutral-500 text-center md:text-right font-mono">
            Built with React, Node.js & Machine Learning
          </div>
        </div>
      </footer>

    </main>
  );
}