import { useState } from 'react';
import { PageLayout } from '../components/Layout.jsx';
import { api } from '../lib/api.js';
import CommandBox from '../components/CommandBox.jsx';
import CopyButton from '../components/CopyButton.jsx';
import MarkdownViewer from '../components/MarkdownViewer.jsx';
import { Mail, Phone, Linkedin, Search } from 'lucide-react';

function extractSection(md, heading) {
  if (!md) return '';
  const lines = md.split('\n');
  let capture = false;
  const result = [];
  for (const line of lines) {
    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (capture) break;
      if (line.toLowerCase().includes(heading.toLowerCase())) {
        capture = true;
        continue;
      }
    }
    if (capture) result.push(line);
  }
  return result.join('\n').trim();
}

export default function Outreach() {
  const [companyInput, setCompanyInput] = useState('');
  const [company, setCompany] = useState('');
  const [outreach, setOutreach] = useState(null);
  const [callScript, setCallScript] = useState(null);
  const [tab, setTab] = useState('email');
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    const name = companyInput.trim();
    if (!name) return;
    setCompany(name);
    setLoading(true);
    try {
      const [o, c] = await Promise.allSettled([
        api.companies.getFile(name, 'OUTREACH-SEQUENCE.md'),
        api.companies.getFile(name, 'CALL-SCRIPT.md'),
      ]);
      setOutreach(o.status === 'fulfilled' ? o.value.content : null);
      setCallScript(c.status === 'fulfilled' ? c.value.content : null);
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: 'email', label: 'Email Sequence', icon: Mail },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'call', label: 'Call Script', icon: Phone },
    { id: 'persona', label: 'Persona-wise', icon: Mail },
  ];

  return (
    <PageLayout title="Outreach" subtitle="Personalized email, LinkedIn, and call sequences">
      <div className="space-y-6">
        <CommandBox
          command={`/sales-ai-team outreach ${company || 'company-name'}`}
          label="Run Outreach Agent"
          description="Generates cold email sequence, LinkedIn messages, and call script."
        />

        <div className="card p-5">
          <div className="flex gap-2">
            <input
              type="text"
              value={companyInput}
              onChange={e => setCompanyInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLookup()}
              placeholder="company-name (folder, e.g. stripe)"
              className="input flex-1"
            />
            <button onClick={handleLookup} disabled={loading} className="btn-primary">
              <Search size={15} />
              {loading ? '…' : 'Load'}
            </button>
          </div>
        </div>

        {(outreach || callScript) ? (
          <>
            <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${
                    tab === id
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-medium'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon size={14} />{label}
                </button>
              ))}
            </div>

            {tab === 'email' && outreach && (
              <EmailSection content={outreach} />
            )}
            {tab === 'linkedin' && outreach && (
              <div className="card p-6">
                <MarkdownViewer content={extractSection(outreach, 'linkedin') || outreach} />
              </div>
            )}
            {tab === 'call' && (
              <div className="card p-6">
                {callScript ? <MarkdownViewer content={callScript} /> : <Empty />}
              </div>
            )}
            {tab === 'persona' && outreach && (
              <div className="card p-6">
                <MarkdownViewer content={extractSection(outreach, 'persona') || outreach} />
              </div>
            )}
          </>
        ) : company && !loading ? (
          <div className="card p-8 text-center">
            <Mail size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No outreach found for "{company}".</p>
            <p className="text-xs text-slate-400 mt-1">Run the command above first.</p>
          </div>
        ) : null}
      </div>
    </PageLayout>
  );
}

function EmailSection({ content }) {
  const emailKeywords = ['Cold Email', 'Follow-up', 'Follow Up'];
  const sections = [];
  const lines = content.split('\n');
  let current = null;

  for (const line of lines) {
    if (line.match(/^#{1,3}\s+(Cold Email|Follow.?up \d|LinkedIn|Call Script|Persona)/i)) {
      if (current) sections.push(current);
      current = { title: line.replace(/^#+\s*/, ''), body: [] };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) sections.push(current);

  if (!sections.length) {
    return <div className="card p-6"><MarkdownViewer content={content} /></div>;
  }

  return (
    <div className="space-y-4">
      {sections.map((s, i) => {
        const text = s.body.join('\n').trim();
        return (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{s.title}</h3>
              <CopyButton text={text} />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">
              {text || <span className="text-slate-400 italic">Empty section</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-slate-400 text-center py-8">No content available.</p>;
}
