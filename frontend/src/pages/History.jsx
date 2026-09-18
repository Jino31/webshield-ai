import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History as HistoryIcon, ShieldCheck, ShieldAlert, Clock, ExternalLink } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();

  // Mock scan history items (can be connected to backend storage later)
  const scanHistory = [
    { id: 1, url: 'https://secure-login-update.com', status: 'Phishing', score: 94, date: '2026-09-16 14:32' },
    { id: 2, url: 'https://github.com', status: 'Safe', score: 2, date: '2026-09-16 12:15' },
    { id: 3, url: 'http://free-crypto-giveaway-airdrop.xyz', status: 'Phishing', score: 98, date: '2026-09-15 19:40' },
    { id: 4, url: 'https://google.com', status: 'Safe', score: 1, date: '2026-09-15 09:10' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center px-4 sm:px-8 lg:px-12 py-12 bg-[#0A0A0F] text-[#FAFAFA]">
      {/* Background VFX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-[#8B5CF6]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header with Back Button */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-white bg-[#13111C] border border-[#231E33] px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8B5CF6]" /> Back
        </button>
        <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono">
          <HistoryIcon className="w-4 h-4 text-[#8B5CF6]" /> Scan Audit Logs
        </div>
      </div>

      {/* History Content Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#13111C]/90 backdrop-blur-2xl border border-[#231E33] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40">
        <div className="border-b border-[#231E33] pb-5 mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">Recent Scan History</h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">Review previously analyzed URLs and classification verdicts.</p>
        </div>

        <div className="space-y-3">
          {scanHistory.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#0A0A0F] border border-[#231E33] hover:border-[#8B5CF6]/50 p-4 rounded-2xl transition gap-3">
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className={`p-2.5 rounded-xl shrink-0 ${item.status === 'Safe' ? 'bg-emerald-950/60 border border-emerald-800/60 text-[#10B981]' : 'bg-rose-950/60 border border-rose-800/60 text-[#F43F5E]'}`}>
                  {item.status === 'Safe' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-white truncate max-w-xs sm:max-w-md">{item.url}</p>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
                    <span>•</span>
                    <span>Confidence: <strong className="text-[#C4B5FD] font-mono">{item.score}%</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.status === 'Safe' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950/80 text-rose-300 border border-rose-800/50'}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}