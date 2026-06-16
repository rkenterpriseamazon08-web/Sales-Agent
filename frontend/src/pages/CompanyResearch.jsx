import { useState } from 'react';
import { PageLayout } from '../components/Layout.jsx';
import { api, extractScore } from '../lib/api.js';
import CommandBox from '../components/CommandBox.jsx';
import MarkdownViewer from '../components/MarkdownViewer.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import { Building2, Search, ChevronRight } from 'lucide-react';

export default function CompanyResearch() {
  const [url, setUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('company_research');

  const handleLookup = async () => {
    const name = companyName.trim();
    if (!name) return;
    try {
      setLoading(true);
      setData(null);
      const result = await api.companies.get(name);
      setData(result);
    } catch {
      setData({ notFound: true });
    } finally {
      setLoading(false);
    }
  };

  const commandUrl = url || 'https://company.com';
  const tabs = data?.contents ? Object.keys(data.contents) : [];

  const TAB_LABELS = {
    company_research: 'Company Research',
    account_fit: 'Account Fit',
    decision_makers: 'Decision Makers',
    lead_qualification: 'Qualification',
    outreach_sequence: 'Outreach',
    call_script: 'Call Script',
    meeting_prep: 'Meeting Prep',
    objection_playbook: 'Objections',
    closing_scripts: 'Closing',
    sales_playbook: 'Playbook',
  };

  const fitScore = data?.contents?.account_fit
    ? extractScore(data.contents.account_fit)
    : null;

  return (
    <PageLayout title="Company Research" subtitle="Deep intelligence on any company">
      <div className="space-y-6">
        {/* Command Generator */}
        <CommandBox
          command={`/sales-ai-team research ${commandUrl}`}
          label="Run Research Agent"
          description="Run this command in Claude Code to research a company. Then look it up below."
        />

        {/* URL input for command generation */}
        <div className="card p-5">
          <h3 className="section-title text-sm mb-3">Generate Research Command</h3>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://company.com"
              className="input flex-1"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">Paste a URL to update the command above, then copy and run it.</p>
        </div>

        {/* Lookup existing results */}
        <div className="card p-5">
          <h3 className="section-title text-sm mb-3">View Saved Research</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLookup()}
              placeholder="company-name (folder name, e.g. stripe)"
              className="input flex-1"
            />
            <button onClick={handleLookup} className="btn-primary" disabled={loading}>
              <Search size={15} />
              {loading ? 'Loading…' : 'Look up'}
            </button>
          </div>
        </div>

        {/* Results */}
        {data?.notFound && (
          <div className="card p-8 text-center">
            <Building2 size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">No research found for "{companyName}".</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
              Run <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">/sales-ai-team research &lt;url&gt;</code> first.
            </p>
          </div>
        )}

        {data && !data.notFound && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                  {data.name?.replace(/-/g, ' ')}
                </h2>
                {fitScore !== null && (
                  <div className="mt-1">
                    <ScoreCard score={fitScore} label="Account Fit Score" />
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            {tabs.length > 0 && (
              <div>
                <div className="flex gap-1 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-700 mb-4">
                  {tabs.map(t => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-3 py-1.5 text-xs rounded-t-md whitespace-nowrap transition-colors ${
                        tab === t
                          ? 'bg-white dark:bg-slate-900 border border-b-white dark:border-b-slate-900 border-slate-200 dark:border-slate-700 font-medium text-brand-600 dark:text-brand-400'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {TAB_LABELS[t] || t}
                    </button>
                  ))}
                </div>
                <div className="card p-6">
                  <MarkdownViewer content={data.contents[tab]} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
