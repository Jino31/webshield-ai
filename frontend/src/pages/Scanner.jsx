import React, { useState } from 'react';
import {
  ScanSearch, Globe, Loader2, ShieldCheck, ShieldAlert, ShieldQuestion,
  Clock, Lock, LockOpen, Fingerprint, Users, ExternalLink, AlertTriangle
} from 'lucide-react';
import { scanService } from '../services/scanService';

const LEVEL_STYLES = {
  high: { badge: 'bg-rose-500/10 border-rose-500/30 text-rose-400', bar: 'bg-rose-500', icon: ShieldAlert },
  medium: { badge: 'bg-amber-500/10 border-amber-500/30 text-amber-400', bar: 'bg-amber-500', icon: ShieldQuestion },
  low: { badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', bar: 'bg-emerald-500', icon: ShieldCheck }
};

export default function Scanner() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Enter a URL to scan.');
      return;
    }
    setError('');
    setIsLoading(true);
    setResult(null);
    try {
      const res = await scanService.scanUrl(url.trim());
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const risk = result?.risk;
  const levelStyle = LEVEL_STYLES[risk?.level] || LEVEL_STYLES.low;
  const LevelIcon = levelStyle.icon;

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full flex flex-col items-center px-4 sm:px-8 lg:px-16 py-10 bg-[#05070A] text-[#FAFAFA]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ScanSearch className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Scan a Website</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Check whether a site is safe to share your data with before you enter anything.
            </p>
          </div>
        </div>

        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#0D1117] border border-neutral-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-600 focus:outline-none transition text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanSearch className="w-4 h-4" />}
            {isLoading ? 'Scanning...' : 'Scan'}
          </button>
        </form>

        {error && (
          <div className="p-3 mb-6 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="bg-[#0D1117] border border-neutral-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${levelStyle.badge}`}>
                <LevelIcon className="w-4 h-4" />
                {risk.level.toUpperCase()} RISK — {risk.score}/100
              </div>
              <span className="text-xs text-neutral-500 font-mono">{result.domainInfo?.domain || result.url}</span>
            </div>

            <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
              <div className={`h-full ${levelStyle.bar} transition-all`} style={{ width: `${risk.score}%` }} />
            </div>

            <div>
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Why this score</h3>
              <ul className="space-y-1.5">
                {risk.factors.map((f, i) => (
                  <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-neutral-600 mt-2 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#05070A] border border-neutral-800 rounded-xl p-3 flex flex-col items-center text-center gap-1">
                <Clock className="w-4 h-4 text-neutral-500" />
                <span className="text-[10px] text-neutral-500 uppercase">Domain age</span>
                <span className="text-xs text-white font-medium">
                  {result.domainInfo?.ageDays != null ? `${result.domainInfo.ageDays}d` : '—'}
                </span>
              </div>
              <div className="bg-[#05070A] border border-neutral-800 rounded-xl p-3 flex flex-col items-center text-center gap-1">
                {result.domainInfo?.hasValidSSL ? (
                  <Lock className="w-4 h-4 text-emerald-500" />
                ) : (
                  <LockOpen className="w-4 h-4 text-rose-500" />
                )}
                <span className="text-[10px] text-neutral-500 uppercase">SSL</span>
                <span className="text-xs text-white font-medium">
                  {result.domainInfo?.hasValidSSL ? 'Valid' : 'Invalid'}
                </span>
              </div>
              <div className="bg-[#05070A] border border-neutral-800 rounded-xl p-3 flex flex-col items-center text-center gap-1">
                <Fingerprint className="w-4 h-4 text-neutral-500" />
                <span className="text-[10px] text-neutral-500 uppercase">Typosquat</span>
                <span className="text-xs text-white font-medium">
                  {result.domainInfo?.typosquat?.suspicious ? `~${result.domainInfo.typosquat.brand}` : 'None'}
                </span>
              </div>
              <div className="bg-[#05070A] border border-neutral-800 rounded-xl p-3 flex flex-col items-center text-center gap-1">
                <Users className="w-4 h-4 text-neutral-500" />
                <span className="text-[10px] text-neutral-500 uppercase">Reports</span>
                <span className="text-xs text-white font-medium">{result.verifiedReportCount ?? 0}</span>
              </div>
            </div>

            {result.advice && (
              <div className="border-t border-neutral-800/80 pt-5">
                <p className="text-sm text-neutral-200 mb-3">{result.advice.message}</p>
                {result.advice.actions?.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    {result.advice.actions.map((a, i) =>
                      a.url ? (
                        <a
                          key={i}
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-[#13111C] hover:bg-[#1A1528] border border-neutral-800 text-white px-4 py-2.5 rounded-xl transition"
                        >
                          {a.label} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span
                          key={i}
                          className="inline-flex items-center justify-center text-xs font-medium bg-rose-950/30 border border-rose-800/50 text-rose-300 px-4 py-2.5 rounded-xl"
                        >
                          {a.label}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
