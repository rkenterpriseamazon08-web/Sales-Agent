import { useState, useEffect } from 'react';
import { PageLayout } from '../components/Layout.jsx';
import { api, scoreColor } from '../lib/api.js';
import { formatDate } from '../lib/utils.js';
import {
  Users, Building2, Mail, Calendar, TrendingUp, Clock, Star,
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color = 'text-brand-500' }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${color}`}>
          <Icon size={18} />
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white">{value ?? '—'}</div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const d = await api.dashboard();
      setData(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <PageLayout title="Dashboard" subtitle="Your AI sales pipeline at a glance" onRefresh={load}>
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          <strong>Backend not reachable.</strong> Start the backend with{' '}
          <code className="bg-red-100 dark:bg-red-900/40 px-1 rounded">cd backend && npm install && npm run dev</code>
          {' '}then refresh.
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <StatCard icon={Users} label="Total Leads" value={loading ? '…' : data?.totalLeads ?? 0} color="text-brand-500" />
        <StatCard icon={TrendingUp} label="Avg Fit Score" value={loading ? '…' : data?.avgScore ? `${data.avgScore}/100` : '—'} color="text-emerald-500" />
        <StatCard icon={Building2} label="Researched" value={loading ? '…' : data?.researchedCount ?? 0} color="text-violet-500" />
        <StatCard icon={Mail} label="Outreach Ready" value={loading ? '…' : data?.outreachCount ?? 0} color="text-amber-500" />
        <StatCard icon={Calendar} label="Meeting Preps" value={loading ? '…' : data?.meetingPrepCount ?? 0} color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Companies */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-amber-500" />
            <h2 className="section-title text-base">Recent Companies</h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              ))}
            </div>
          ) : !data?.recentCompanies?.length ? (
            <EmptyState message="No companies analyzed yet. Run /sales-ai-team research <url> to get started." />
          ) : (
            <div className="space-y-2">
              {data.recentCompanies.map(c => (
                <div key={c.name} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                      {c.name.replace(/-/g, ' ')}
                    </p>
                    <p className="text-xs text-slate-400">{c.files?.length} files · {formatDate(c.lastModified)}</p>
                  </div>
                  <span className="badge badge-blue">{c.files?.length} docs</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-brand-500" />
            <h2 className="section-title text-base">Quick Commands</h2>
          </div>
          <div className="space-y-2">
            {[
              { cmd: '/sales-ai-team icp', desc: 'Set up your Ideal Customer Profile' },
              { cmd: '/sales-ai-team find-leads', desc: 'Find leads matching your ICP' },
              { cmd: '/sales-ai-team full https://company.com', desc: 'Full analysis of a company' },
            ].map(({ cmd, desc }) => (
              <div key={cmd} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{cmd}</code>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Run these in your Claude Code terminal</p>
        </div>
      </div>
    </PageLayout>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm text-slate-400 dark:text-slate-500">{message}</p>
    </div>
  );
}
