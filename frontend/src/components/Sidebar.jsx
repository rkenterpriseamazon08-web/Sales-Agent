import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Target, Search, Building2, ShieldCheck,
  Mail, Calendar, Briefcase, GitBranch, Settings, Zap,
} from 'lucide-react';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/icp', icon: Target, label: 'ICP Setup' },
  { to: '/leads', icon: Search, label: 'Lead Finder' },
  { to: '/research', icon: Building2, label: 'Company Research' },
  { to: '/qualify', icon: ShieldCheck, label: 'Qualification' },
  { to: '/outreach', icon: Mail, label: 'Outreach' },
  { to: '/meeting', icon: Calendar, label: 'Meeting Prep' },
  { to: '/workspace', icon: Briefcase, label: 'Workspaces' },
  { to: '/agents', icon: GitBranch, label: 'Agent Flow' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">Sales AI Team</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-400 dark:text-slate-500">
          <p className="font-medium">Sales AI Team v1.0</p>
          <p className="mt-0.5">Public data only · Safe outreach</p>
        </div>
      </div>
    </aside>
  );
}
