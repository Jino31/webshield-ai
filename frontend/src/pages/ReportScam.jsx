import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertOctagon, ShieldCheck, Globe, Send, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ReportScam() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('phishing');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid URL or website link.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate secure backend submission
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center px-4 sm:px-8 lg:px-16 py-10 bg-[#05070A] text-[#FAFAFA]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Header Row */}
      <div className="relative z-10 w-full max-w-3xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-[#22D3EE] bg-[#0D1117] border border-neutral-800/80 px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#22D3EE]" /> Back
        </button>
        <div className="flex items-center gap-2 text-neutral-400 text-xs font-medium">
          <AlertOctagon className="w-4 h-4 text-rose-400" /> Threat Intelligence Intake
        </div>
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-3xl bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-neutral-800/80">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Report a Scam Website</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Help protect the community by submitting fraudulent or phishing links for analysis.</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white">Report Received Successfully</h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Thank you for contributing to WebShield AI security database. Our automated threat models will analyze the URL and add it to our detection blocks if verified.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setUrl('');
                setDescription('');
              }}
              className="mt-4 px-5 py-2.5 bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 text-xs font-medium text-white rounded-xl transition cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="scam-url" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Suspicious URL / Website Link *
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  id="scam-url"
                  type="text"
                  placeholder="https://example-phishing-site.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#05070A] border border-neutral-800 focus:border-[#22D3EE] rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="scam-category" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Threat Category
              </label>
              <select
                id="scam-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#05070A] border border-neutral-800 focus:border-[#22D3EE] rounded-xl px-4 py-3 text-white focus:outline-none transition text-sm cursor-pointer"
              >
                <option value="phishing">Credential Phishing / Fake Login</option>
                <option value="malware">Malware / Drive-by Download</option>
                <option value="financial">Fake E-Commerce / Financial Scam</option>
                <option value="crypto">Cryptocurrency Scam</option>
                <option value="other">Other Suspicious Activity</option>
              </select>
            </div>

            <div>
              <label htmlFor="scam-desc" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                id="scam-desc"
                rows={4}
                placeholder="Describe how you encountered this site or what makes it suspicious..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#05070A] border border-neutral-800 focus:border-[#22D3EE] rounded-xl p-4 text-white placeholder-neutral-600 focus:outline-none transition text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-rose-950/40 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting Report...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Threat Report
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}