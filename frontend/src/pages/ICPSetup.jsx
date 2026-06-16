import { useState, useEffect } from 'react';
import { PageLayout } from '../components/Layout.jsx';
import { api } from '../lib/api.js';
import { Save, Target, Download } from 'lucide-react';
import { downloadMarkdown } from '../lib/utils.js';

const TEMPLATE = `# Ideal Customer Profile (ICP)
Last updated: ${new Date().toLocaleDateString()}

## Product / Service Description
[Describe what you sell — be specific about outcomes, not features]

## Target Industries
- [Industry 1, e.g., B2B SaaS]
- [Industry 2, e.g., FinTech]
- [Industry 3]

## Target Geography
- Primary: [e.g., United States, India]
- Secondary: [e.g., Canada, UK]
- Excluded: [Any regions you don't serve]

## Company Size
- Employees: [e.g., 50–500]
- Revenue: [e.g., $5M–$100M ARR]
- Stage: [e.g., Series A to Series C]

## Buyer Personas
### Primary Buyer
- Title: [e.g., VP of Sales]
- Primary pain: [What keeps them up at night]
- Success metric: [How they measure success]

### Secondary Buyer
- Title: [e.g., CTO]
- Primary concern: [Security, integration, scalability]

## Pain Points We Solve
1. [Specific pain point]
2. [Specific pain point]
3. [Specific pain point]

## Budget Indicators
- Minimum deal size: [e.g., $10,000/year]
- Budget signals: [e.g., Series A+ funded, hiring sales team]
- Disqualify if: [e.g., Bootstrap with <10 employees]

## Trigger Events
- [e.g., Recent funding round]
- [e.g., New VP of Sales hired]
- [e.g., Company expanding to new market]

## Disqualification Criteria
- [e.g., Less than 20 employees]
- [e.g., Pure B2C]
- [e.g., Government/public sector]

## Preferred Outreach Tone
[e.g., Professional but conversational. Direct. Value-led.]

## Pricing (Optional)
- Price range: [e.g., $500–$5,000/month]
- Pricing model: [e.g., Per seat, usage-based]

## Competitor Positioning
- Main competitors: [Competitor A, Competitor B]
- Key differentiators: [What makes us different]
- When we lose: [Honest assessment]
`;

export default function ICPSetup() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    api.icp.get()
      .then(({ content: c, exists }) => {
        setContent(exists && c ? c : TEMPLATE);
        setLoading(false);
      })
      .catch(() => {
        setContent(TEMPLATE);
        setLoading(false);
        setBackendError(true);
      });
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await api.icp.save(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout title="ICP Setup" subtitle="Define your Ideal Customer Profile">
      {backendError && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs">
          Backend not connected — edits will not be saved to file. Start the backend to enable saving.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="xl:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-brand-500" />
                <span className="font-semibold text-slate-900 dark:text-white text-sm">ICP.md</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadMarkdown(content, 'ICP.md')}
                  className="btn-ghost text-xs"
                >
                  <Download size={13} /> Export
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || backendError}
                  className={`btn-primary text-xs ${(saving || backendError) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Save size={13} />
                  {saving ? 'Saving…' : saved ? 'Saved!' : 'Save to file'}
                </button>
              </div>
            </div>
            {loading ? (
              <div className="h-96 animate-pulse bg-slate-100 dark:bg-slate-800" />
            ) : (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full h-[60vh] p-5 font-mono text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 resize-none focus:outline-none"
                placeholder="Edit your ICP here…"
                spellCheck={false}
              />
            )}
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>

        {/* Guide */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="section-title text-sm mb-3">What is an ICP?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your Ideal Customer Profile defines exactly who you want to sell to. A sharp ICP means better leads, shorter sales cycles, and higher close rates.
            </p>
          </div>
          <div className="card p-5">
            <h3 className="section-title text-sm mb-3">After saving</h3>
            <div className="space-y-2">
              {[
                { cmd: '/sales-ai-team find-leads', label: 'Find matching leads' },
                { cmd: '/sales-ai-team full <url>', label: 'Full company analysis' },
              ].map(({ cmd, label }) => (
                <div key={cmd}>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                  <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400 block bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg">
                    {cmd}
                  </code>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="section-title text-sm mb-3">File location</h3>
            <code className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg block break-all">
              sales-agent-workflow/ICP.md
            </code>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
