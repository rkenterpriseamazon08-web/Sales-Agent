import { CheckCircle, Circle, Loader, XCircle, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  completed: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-700',
    label: 'Completed',
  },
  running: {
    icon: Loader,
    color: 'text-brand-500 animate-spin',
    bg: 'bg-brand-50 dark:bg-brand-900/20',
    border: 'border-brand-200 dark:border-brand-700',
    label: 'Running',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-700',
    label: 'Failed',
  },
  not_started: {
    icon: Circle,
    color: 'text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-800/50',
    border: 'border-slate-200 dark:border-slate-700',
    label: 'Not Started',
  },
};

export default function AgentStatusCard({ agent, index, isLast }) {
  const status = agent.status || 'not_started';
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col items-center">
      <div className={`w-full card p-5 border ${cfg.border} ${cfg.bg} transition-all`}>
        <div className="flex items-start gap-4">
          <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 border-2 ${cfg.border} flex-shrink-0`}>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{agent.name}</h3>
              <span className={`badge ${
                status === 'completed' ? 'badge-green' :
                status === 'running' ? 'badge-blue' :
                status === 'failed' ? 'badge-red' : 'badge-slate'
              }`}>
                <Icon size={10} className={status === 'running' ? 'animate-spin' : ''} />
                <span className="ml-1">{cfg.label}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{agent.description}</p>
            {agent.outputFiles && agent.outputFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {agent.outputFiles.map(f => (
                  <span key={f} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-600 dark:text-slate-400">
                    {f}
                  </span>
                ))}
              </div>
            )}
            {agent.lastRun && (
              <p className="text-xs text-slate-400 mt-1">Last run: {agent.lastRun}</p>
            )}
            {agent.error && (
              <p className="text-xs text-red-500 mt-1 font-mono">{agent.error}</p>
            )}
          </div>
          <Icon size={20} className={`flex-shrink-0 ${cfg.color}`} />
        </div>
      </div>
      {!isLast && (
        <div className="flex items-center justify-center w-8 h-8">
          <ArrowRight size={16} className="text-slate-400 rotate-90" />
        </div>
      )}
    </div>
  );
}
