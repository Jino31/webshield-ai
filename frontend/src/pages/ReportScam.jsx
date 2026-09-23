import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertOctagon, 
  ShieldCheck, 
  Globe, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Link2,
  Terminal,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { scamReportService } from '../services/scamReportService';

export default function ReportScam() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('phishing');
  const [description, setDescription] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [reportId, setReportId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('A valid target URL or domain reference is required for intake.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await scamReportService.submitReport({
        url: url.trim(),
        category,
        description: description.trim(),
        proofUrl: proofUrl.trim() || null
      });
      setVerified(res.verified);
      setReportId(res.reportId || `INTAKE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to transmit threat intake report to cluster.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center px-4 sm:px-8 lg:px-12 py-10 bg-[#0A0A0F] text-[#FAFAFA] font-sans">
      {/* Background Glow Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#EC4899]/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Navigation Header */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-white bg-[#13111C] border border-[#231E33] px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#EC4899]" /> Return Back
        </button>
        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono uppercase tracking-widest bg-[#13111C] px-3.5 py-1.5 rounded-lg border border-[#231E33]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#EC4899]" /> Security Operations Center
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl bg-[#13111C] border border-[#231E33] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#231E33]">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FAFAFA] tracking-tight">Threat Intelligence Intake Portal</h1>
            <p className="text-xs text-neutral-400 mt-1">Submit fraudulent URLs or phishing attack surfaces for automated threat analysis and database synchronization.</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-5 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#FAFAFA]">Threat Report Logged Successfully</h2>
              <p className="text-xs font-mono text-[#8B5CF6] uppercase tracking-wider">Incident Reference: {reportId}</p>
            </div>
            <p className="text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
              {verified
                ? "Thank you for contributing to WebShield AI's global security database. This report has passed verification checks and is actively feeding into the domain's public risk score."
                : "Your report has been successfully ingested and saved for administrative review. Providing a detailed description or proof link on future submissions ensures immediate scoring integration."}
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setUrl('');
                  setDescription('');
                  setProofUrl('');
                }}
                className="px-6 py-3 bg-[#0A0A0F] hover:bg-[#1A1528] border border-[#231E33] text-xs font-bold text-[#FAFAFA] rounded-xl transition cursor-pointer shadow-md"
              >
                Submit Another Threat Report
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2.5 font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="scam-url" className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Suspicious URL / Phishing Domain *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                  <input
                    id="scam-url"
                    type="text"
                    placeholder="https://malicious-login-portal.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#231E33] focus:border-[#EC4899] rounded-xl pl-10 pr-4 py-3 text-[#FAFAFA] placeholder-neutral-600 focus:outline-none transition text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="scam-category" className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Attack Classification Vector *
                </label>
                <select
                  id="scam-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#231E33] focus:border-[#EC4899] rounded-xl px-4 py-3 text-[#FAFAFA] focus:outline-none transition text-xs cursor-pointer font-sans"
                >
                  <option value="phishing" className="bg-[#13111C]">Credential Phishing / Fake Authentication</option>
                  <option value="malware" className="bg-[#13111C]">Malware / Drive-by Payload Delivery</option>
                  <option value="financial" className="bg-[#13111C]">Imitation E-Commerce / Financial Fraud</option>
                  <option value="crypto" className="bg-[#13111C]">Web3 / Cryptocurrency Drainer Contract</option>
                  <option value="other" className="bg-[#13111C]">General Suspicious Activity</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="scam-desc" className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Incident Context & Observations (Optional)
              </label>
              <textarea
                id="scam-desc"
                rows={4}
                placeholder="Describe how the attack vector was delivered (e.g. SMS phishing vector, malicious ad link)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-[#231E33] focus:border-[#EC4899] rounded-xl p-4 text-[#FAFAFA] placeholder-neutral-600 focus:outline-none transition text-xs resize-none"
              />
            </div>

            <div>
              <label htmlFor="scam-proof" className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Verification Proof Link (Screenshot / Evidence Log)
              </label>
              <div className="relative">
                <Link2 className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                <input
                  id="scam-proof"
                  type="text"
                  placeholder="https://imgur.com/... or cloud storage evidence link"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#231E33] focus:border-[#EC4899] rounded-xl pl-10 pr-4 py-3 text-[#FAFAFA] placeholder-neutral-600 focus:outline-none transition text-xs font-mono"
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-2 font-mono">
                ℹ️ Note: Reports containing descriptive text (20+ chars) or verified proof links qualify for automated risk score ingestion.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-95 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-purple-950/50 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Transmitting Report to Cluster...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Broadcast Threat Report
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}