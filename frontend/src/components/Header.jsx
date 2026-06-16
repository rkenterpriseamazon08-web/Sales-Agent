import { Sun, Moon, RefreshCw } from 'lucide-react';

export default function Header({ title, subtitle, onRefresh, darkMode, toggleDark }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div>
        <h1 className="page-title text-xl">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {onRefresh && (
          <button onClick={onRefresh} className="btn-ghost" title="Refresh">
            <RefreshCw size={15} />
          </button>
        )}
        <button
          onClick={toggleDark}
          className="btn-ghost"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
