import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      <div className="max-w-2xl mx-auto w-full pt-10">
        <button 
          onClick={() => navigate('/')} 
          className="text-sm text-indigo-400 hover:text-indigo-300 mb-6 flex items-center gap-2 transition"
        >
          ← Back to Home
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              About WebShield AI
            </h1>
            <p className="text-slate-400 text-sm">
              Next-generation phishing detection and website security analysis powered by machine learning.
            </p>
          </div>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
              <h2 className="font-semibold text-indigo-300 mb-1">🤖 Machine Learning Core</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                WebShield AI evaluates uniform resource locators (URLs) using advanced lexical feature extraction and trained Random Forest classification models to catch spoofed domains and zero-day phishing links instantly.
              </p>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
              <h2 className="font-semibold text-indigo-300 mb-1">⚡ ShieldSense AI Assistant</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Integrated directly into our platform, ShieldSense provides real-time security context, answers questions regarding threat indicators, and breaks down scan results securely using Gemini AI.
              </p>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
              <h2 className="font-semibold text-indigo-300 mb-1">🔒 Privacy & Safety First</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                We prioritize user privacy. Scan telemetry is processed safely without exposing personal credentials, keeping your browsing experience secure and transparent.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 py-4">
        WebShield AI Platform • Security & Phishing Defense
      </footer>
    </div>
  );
}