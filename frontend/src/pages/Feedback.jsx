import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', category: 'General', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can hook up an API endpoint or email service here
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6">
      {/* Header */}
      <div className="max-w-xl mx-auto w-full pt-10">
        <button 
          onClick={() => navigate('/')} 
          className="text-sm text-indigo-400 hover:text-indigo-300 mb-6 flex items-center gap-2 transition"
        >
          ← Back to Home
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold mb-2">Send Us Your Feedback</h1>
          <p className="text-slate-400 text-sm mb-6">
            Help us improve WebShield AI's detection accuracy and platform features.
          </p>

          {submitted ? (
            <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-center">
              <p className="font-semibold mb-1">Thank you for your feedback!</p>
              <p className="text-xs text-emerald-400/80">We appreciate you helping us make the web safer.</p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 transition"
              >
                Send Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="S Jeffrin Jino"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Feedback Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                >
                  <option value="General">General Feedback</option>
                  <option value="Detection Bug">False Positive / Detection Issue</option>
                  <option value="UI/UX">Interface & Design</option>
                  <option value="ShieldSense AI">ShieldSense AI Assistant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Message</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="Tell us what you think or report an issue..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-indigo-600/20"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 py-4">
        WebShield AI Platform • Security & Phishing Defense
      </footer>
    </div>
  );
}