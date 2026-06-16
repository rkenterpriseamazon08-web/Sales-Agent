import { useState, useEffect } from 'react';
import { PageLayout } from '../components/Layout.jsx';
import { api, parseCSV } from '../lib/api.js';
import CommandBox from '../components/CommandBox.jsx';
import { MiniScore } from '../components/ScoreCard.jsx';
import MarkdownViewer from '../components/MarkdownViewer.jsx';
import { downloadCSV, downloadMarkdown } from '../lib/utils.js';
import { Search, Download, FileText } from 'lucide-react';

export default function LeadFinder() {
  const [leads, setLeads] = useState([]);
  const [markdown, setMarkdown] = useState('');
  const [csv, setCsv] = useState('');
  const [view, setView] = useState('table');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.leads.get()
      .then(({ markdown: md, csv: c }) => {
        setMarkdown(md);
        setCsv(c);
        setLeads(parseCSV(c));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hasLeads = leads.length > 0;

  return (
    <PageLayout title="Lead Finder" subtitle="Discover and score qualified prospects">
      <div className="space-y-6">
        {/* Command */}
        <CommandBox
          command="/sales-ai-team find-leads"
          label="Run Agent"
          description="Run this command in Claude Code to find leads matching your ICP. Results will appear here automatically."
        />

        {hasLeads && (
          <div className="flex items-center justify-between">
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setView('table')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${view === 'table' ? 'bg-white dark:bg-slate-900 shadow-sm font-medium text-slate-900 dark:text-white' : 'text-slate-500'}`}
              >
                Table
              </button>
              <button
                onClick={() => setView('markdown')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${view === 'markdown' ? 'bg-white dark:bg-slate-900 shadow-sm font-medium text-slate-900 dark:text-white' : 'text-slate-500'}`}
              >
                Markdown
              </button>
            </div>
            <div className="flex gap-2">
              {csv && (
                <button onClick={() => downloadCSV(csv, 'LEADS.csv')} className="btn-secondary text-xs">
                  <Download size={13} /> CSV
                </button>
              )}
              {markdown && (
                <button onClick={() => downloadMarkdown(markdown, 'LEADS.md')} className="btn-secondary text-xs">
                  <FileText size={13} /> Markdown
                </button>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="card p-8 text-center text-slate-400 text-sm">Loading…</div>
        ) : !hasLeads ? (
          <div className="card p-12 text-center">
            <Search size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">No leads found yet.</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Run the command above in Claude Code, then refresh.</p>
          </div>
        ) : view === 'markdown' ? (
          <div className="card p-6">
            <MarkdownViewer content={markdown} />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    {['Rank', 'Company', 'Industry', 'Geography', 'Size', 'Pain Signal', 'Score', 'Outreach Angle'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {leads.map((lead, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 text-slate-400 text-xs">{lead['Rank'] || i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900 dark:text-white">{lead['Company Name']}</div>
                        {lead['Website'] && (
                          <a href={lead['Website']} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-500 hover:underline">{lead['Website']}</a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">{lead['Industry'] || '—'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">{lead['Geography'] || '—'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">{lead['Company Size'] || '—'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs max-w-48 truncate">{lead['Pain Signal'] || '—'}</td>
                      <td className="px-4 py-3">
                        <MiniScore score={parseInt(lead['Fit Score']) || 0} />
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs max-w-48 truncate">{lead['Outreach Angle'] || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
