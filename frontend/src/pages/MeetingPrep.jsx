import { useState } from 'react';
import { PageLayout } from '../components/Layout.jsx';
import { api } from '../lib/api.js';
import CommandBox from '../components/CommandBox.jsx';
import MarkdownViewer from '../components/MarkdownViewer.jsx';
import CopyButton from '../components/CopyButton.jsx';
import { Calendar, Search, BookOpen, Shield, X } from 'lucide-react';

export default function MeetingPrep() {
  const [companyInput, setCompanyInput] = useState('');
  const [company, setCompany] = useState('');
  const [files, setFiles] = useState({});
  const [tab, setTab] = useState('meeting_prep');
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    const name = companyInput.trim();
    if (!name) return;
    setCompany(name);
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.companies.getFile(name, 'MEETING-PREP.md'),
        api.companies.getFile(name, 'OBJECTION-PLAYBOOK.md'),
        api.companies.getFile(name, 'CLOSING-SCRIPTS.md'),
        api.companies.getFile(name, 'SALES-PLAYBOOK.md'),
      ]);
      setFiles({
        meeting_prep: results[0].status === 'fulfilled' ? results[0].value.content : null,
        objection_playbook: results[1].status === 'fulfilled' ? results[1].value.content : null,
        closing_scripts: results[2].status === 'fulfilled' ? results[2].value.content : null,
        sales_playbook: results[3].status === 'fulfilled' ? results[3].value.content : null,
      });
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: 'meeting_prep', label: 'Meeting Prep', icon: Calendar },
    { id: 'objection_playbook', label: 'Objections', icon: Shield },
    { id: 'closing_scripts', label: 'Closing Scripts', icon: BookOpen },
    { id: 'sales_playbook', label: 'Sales Playbook', icon: BookOpen },
  ];

  const hasAny = Object.values(files).some(Boolean);

  return (
    <PageLayout title="Meeting Prep" subtitle="Discovery questions, objections, and closing scripts">
      <div className="space-y-6">
        <CommandBox
          command={`/sales-ai-team prep ${company || 'company-name'}`}
          label="Run Meeting Coach Agent"
          description="Generates meeting brief, discovery questions, objection playbook, and closing scripts."
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

        {hasAny ? (
          <>
            <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
              {TABS.map(({ id, label, icon: Icon }) => (
                files[id] && (
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
                )
              ))}
            </div>

            <div className="card p-6">
              {files[tab] ? (
                <>
                  <div className="flex justify-end mb-4">
                    <CopyButton text={files[tab]} />
                  </div>
                  <MarkdownViewer content={files[tab]} />
                </>
              ) : (
                <p className="text-slate-400 text-sm text-center py-8">Not available for this tab.</p>
              )}
            </div>
          </>
        ) : company && !loading ? (
          <div className="card p-8 text-center">
            <Calendar size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No meeting prep found for "{company}".</p>
            <p className="text-xs text-slate-400 mt-1">Run the command above first.</p>
          </div>
        ) : null}
      </div>
    </PageLayout>
  );
}
