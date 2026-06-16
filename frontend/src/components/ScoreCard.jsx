import { cn } from '../lib/utils.js';

export default function ScoreCard({ score, label, size = 'md' }) {
  const pct = Math.min(100, Math.max(0, score || 0));

  const color =
    pct >= 80 ? 'text-emerald-500' :
    pct >= 60 ? 'text-amber-500' :
    pct >= 40 ? 'text-orange-500' :
    'text-red-500';

  const trackColor =
    pct >= 80 ? 'bg-emerald-500' :
    pct >= 60 ? 'bg-amber-500' :
    pct >= 40 ? 'bg-orange-500' :
    'bg-red-500';

  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className={`text-5xl font-bold ${color}`}>{pct}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label || 'out of 100'}</div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${trackColor} rounded-full transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`text-2xl font-bold ${color}`}>{pct}<span className="text-sm font-normal text-slate-400">/100</span></div>
      <div className="flex-1">
        {label && <div className="text-xs text-slate-500 mb-1">{label}</div>}
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${trackColor} rounded-full transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function MiniScore({ score }) {
  const pct = Math.min(100, Math.max(0, score || 0));
  const color =
    pct >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
    pct >= 60 ? 'text-amber-600 dark:text-amber-400' :
    'text-red-600 dark:text-red-400';
  const bg =
    pct >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20' :
    pct >= 60 ? 'bg-amber-50 dark:bg-amber-900/20' :
    'bg-red-50 dark:bg-red-900/20';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${color} ${bg}`}>
      {pct}/100
    </span>
  );
}
