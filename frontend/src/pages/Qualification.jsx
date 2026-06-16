import { useState } from 'react';
import { PageLayout } from '../components/Layout.jsx';
import { api, extractScore } from '../lib/api.js';
import CommandBox from '../components/CommandBox.jsx';
import MarkdownViewer from '../components/MarkdownViewer.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import { ShieldCheck, Search } from 'lucide-react';

export default function Qualification() {
  const [url, setUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    const name = companyName.trim();
    if (!name) return;
    try {
      setLoading(true);
      setContent(null);
      const { content: c } = await api.companies.getFile(name, 'LEAD-QUALIFICATION.md');
      setContent(c);
    } catch {
      setContent('NOT_FOUND');
    } finally {
      setLoading(false);
    }
  };

  const score = content && content !== 'NOT_FOUND' ? extractScore(content) : null;

  return (
    <PageLayout title="Qualification" subtitle="BANT + MEDDIC opportunity scoring">
      <div className="space-y-6">
        <CommandBox
          command={`/sales-ai-team qualify ${url || 'https://company.com'}`}
          label="Run Qualification Agent"
          description="Run this to qualify a company using BANT and MEDDIC frameworks."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="section-title text-sm mb-3">Set URL for command</h3>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://company.com"
              className="input"
            />
          </div>
          <div className="card p-5">
            <h3 className="section-title text-sm mb-3">View qualification results</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookup()}
                placeholder="company-name (folder)"
                className="input flex-1"
              />
              <button onClick={handleLookup} disabled={loading} className="btn-primary">
                <Search size={15} />
                {loading ? '…' : 'View'}
              </button>
            </div>
          </div>
        </div>

        {/* Framework info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">BANT Framework</h3>
            <div className="space-y-2">
              {[
                { label: 'Budget', desc: 'Can they afford it? What are the signals?' },
                { label: 'Authority', desc: 'Who makes the decision? Is it accessible?' },
                { label: 'Need', desc: 'How strong is the pain? Is there urgency?' },
                { label: 'Timing', desc: 'Trigger events? Fiscal year? Deadlines?' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex gap-3">
                  <span className="w-16 text-xs font-bold text-brand-600 dark:text-brand-400 flex-shrink-0 pt-0.5">{label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">MEDDIC Framework</h3>
            <div className="space-y-2">
              {[
                { label: 'Metrics', desc: 'What measurable outcomes do they care about?' },
                { label: 'Econ. Buyer', desc: 'Who signs the check?' },
                { label: 'Decision', desc: 'What criteria drive their decision?' },
                { label: 'Process', desc: 'How do they buy? Who else is involved?' },
                { label: 'Pain', desc: 'What specific problem are we solving?' },
                { label: 'Champion', desc: 'Who will advocate internally?' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex gap-3">
                  <span className="w-16 text-xs font-bold text-violet-600 dark:text-violet-400 flex-shrink-0 pt-0.5">{label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {content === 'NOT_FOUND' && (
          <div className="card p-8 text-center">
            <ShieldCheck size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No qualification found for "{companyName}".</p>
          </div>
        )}

        {content && content !== 'NOT_FOUND' && (
          <div className="space-y-4">
            {score !== null && (
              <div className="card p-6">
                <ScoreCard score={score} label="Opportunity Score" size="lg" />
              </div>
            )}
            <div className="card p-6">
              <MarkdownViewer content={content} />
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
