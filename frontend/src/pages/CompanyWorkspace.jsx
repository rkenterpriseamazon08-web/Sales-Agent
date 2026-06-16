import { useState, useEffect } from 'react';
import { PageLayout } from '../components/Layout.jsx';
import { api, extractScore } from '../lib/api.js';
import MarkdownViewer from '../components/MarkdownViewer.jsx';
import { MiniScore } from '../components/ScoreCard.jsx';
import CopyButton from '../components/CopyButton.jsx';
import CommandBox from '../components/CommandBox.jsx';
import { Briefcase, ChevronRight, Building2 } from 'lucide-react';
import { formatDate, getFileLabel } from '../lib/utils.js';

const FILE_ORDER = [
  'COMPANY-RESEARCH.md', 'ACCOUNT-FIT.md', 'DECISION-MAKERS.md',
  'LEAD-QUALIFICATION.md', 'OUTREACH-SEQUENCE.md', 'CALL-SCRIPT.md',
  'MEETING-PREP.md', 'OBJECTION-PLAYBOOK.md', 'CLOSING-SCRIPTS.md',
  'SALES-PLAYBOOK.md',
];

export default function CompanyWorkspace() {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCompany, setLoadingCompany] = useState(false);

  useEffect(() => {
    api.companies.list()
      .then(({ companies: c }) => setCompanies(c || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selectCompany = async (name) => {
    setSelected(name);
    setCompanyData(null);
    setActiveFile(null);
    setLoadingCompany(true);
    try {
      const data = await api.companies.get(name);
      setCompanyData(data);
      const ordered = FILE_ORDER.find(f => data.files?.includes(f));
      setActiveFile(ordered || data.files?.[0] || null);
    } catch {
      setCompanyData({ error: true });
    } finally {
      setLoadingCompany(false);
    }
  };

  const orderedFiles = companyData?.files
    ? FILE_ORDER.filter(f => companyData.files.includes(f))
        .concat(companyData.files.filter(f => !FILE_ORDER.includes(f)))
    : [];

  const activeContent = activeFile
    ? companyData?.contents?.[activeFile.replace('.md', '').toLowerCase().replace(/-/g, '_')]
    : null;

  const fitScore = companyData?.contents?.account_fit
    ? extractScore(companyData.contents.account_fit)
    : null;

  return (
    <PageLayout title="Company Workspaces" subtitle="All research, outreach, and prep in one place">
      <div className="flex gap-6 h-[calc(100vh-10rem)]">
        {/* Left: company list */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-3">
          <div className="card p-4 flex-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              {companies.length} Companies
            </h3>
            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />)}
              </div>
            ) : !companies.length ? (
              <div className="text-center py-8">
                <Building2 size={24} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No companies yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {companies.map(c => (
                  <button
                    key={c.name}
                    onClick={() => selectCompany(c.name)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                      selected === c.name
                        ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">{c.name.replace(/-/g, ' ')}</div>
                    <div className="text-xs text-slate-400">{c.files?.length} docs · {formatDate(c.lastModified)}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="card p-3">
            <p className="text-xs text-slate-400 mb-2">Add a company</p>
            <CommandBox command="/sales-ai-team full https://company.com" />
          </div>
        </div>

        {/* Right: company detail */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {!selected ? (
            <div className="card flex-1 flex items-center justify-center">
              <div className="text-center">
                <Briefcase size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">Select a company to view its workspace</p>
              </div>
            </div>
          ) : loadingCompany ? (
            <div className="card flex-1 flex items-center justify-center">
              <p className="text-slate-400 text-sm">Loading…</p>
            </div>
          ) : companyData?.error ? (
            <div className="card flex-1 flex items-center justify-center">
              <p className="text-red-400 text-sm">Failed to load company data</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="card p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white capitalize">
                    {selected?.replace(/-/g, ' ')}
                  </h2>
                  <p className="text-xs text-slate-400">{orderedFiles.length} documents</p>
                </div>
                {fitScore !== null && <MiniScore score={fitScore} />}
              </div>

              <div className="flex gap-4 flex-1 overflow-hidden">
                {/* File tabs (vertical) */}
                <div className="w-44 flex-shrink-0 card p-2 overflow-y-auto">
                  <div className="space-y-0.5">
                    {orderedFiles.map(file => (
                      <button
                        key={file}
                        onClick={() => setActiveFile(file)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 ${
                          activeFile === file
                            ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-medium'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <ChevronRight size={10} className={activeFile === file ? 'opacity-100' : 'opacity-0'} />
                        {getFileLabel(file)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 card p-5 overflow-y-auto">
                  {activeFile && (
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{getFileLabel(activeFile)}</h3>
                      {activeContent && <CopyButton text={activeContent} />}
                    </div>
                  )}
                  <MarkdownViewer content={activeContent} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
