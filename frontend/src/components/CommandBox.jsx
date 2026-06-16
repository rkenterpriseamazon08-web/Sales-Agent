import { Terminal } from 'lucide-react';
import CopyButton from './CopyButton.jsx';

export default function CommandBox({ command, label, description }) {
  return (
    <div className="card p-4 border-l-4 border-brand-500">
      {label && (
        <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide mb-1">
          {label}
        </p>
      )}
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{description}</p>
      )}
      <div className="flex items-center gap-2 bg-slate-900 dark:bg-slate-950 rounded-lg px-4 py-3">
        <Terminal size={14} className="text-slate-500 flex-shrink-0" />
        <code className="flex-1 text-sm font-mono text-emerald-400">{command}</code>
        <CopyButton text={command} />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
        Copy this command and run it in your Claude Code terminal
      </p>
    </div>
  );
}
