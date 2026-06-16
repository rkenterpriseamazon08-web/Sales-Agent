import { useState, useEffect } from 'react';
import { PageLayout } from '../components/Layout.jsx';
import AgentStatusCard from '../components/AgentStatusCard.jsx';
import CommandBox from '../components/CommandBox.jsx';
import { api } from '../lib/api.js';

const AGENTS = [
  {
    id: 'sales-lead-finder',
    name: 'Lead Finder',
    description: 'Finds qualified leads from public sources based on your ICP. Scores every prospect before listing.',
    command: '/sales-ai-team find-leads',
    outputFiles: ['LEADS.md', 'LEADS.csv'],
    checkFiles: null,
  },
  {
    id: 'sales-company-researcher',
    name: 'Company Researcher',
    description: 'Researches company website, identifies pain points, growth signals, and decision-maker personas.',
    command: '/sales-ai-team research <url>',
    outputFiles: ['COMPANY-RESEARCH.md', 'ACCOUNT-FIT.md', 'DECISION-MAKERS.md'],
    checkFiles: ['COMPANY-RESEARCH.md'],
  },
  {
    id: 'sales-opportunity-qualifier',
    name: 'Opportunity Qualifier',
    description: 'Applies BANT and MEDDIC frameworks to score the opportunity 0–100.',
    command: '/sales-ai-team qualify <url>',
    outputFiles: ['LEAD-QUALIFICATION.md'],
    checkFiles: ['LEAD-QUALIFICATION.md'],
  },
  {
    id: 'sales-outreach-strategist',
    name: 'Outreach Strategist',
    description: 'Creates cold emails, follow-up sequences, LinkedIn messages, and persona-wise scripts.',
    command: '/sales-ai-team outreach <company>',
    outputFiles: ['OUTREACH-SEQUENCE.md', 'CALL-SCRIPT.md'],
    checkFiles: ['OUTREACH-SEQUENCE.md'],
  },
  {
    id: 'sales-meeting-coach',
    name: 'Meeting Coach',
    description: 'Prepares discovery questions, objection playbook, negotiation tactics, and closing scripts.',
    command: '/sales-ai-team prep <company>',
    outputFiles: ['MEETING-PREP.md', 'OBJECTION-PLAYBOOK.md', 'CLOSING-SCRIPTS.md', 'SALES-PLAYBOOK.md'],
    checkFiles: ['MEETING-PREP.md'],
  },
];

export default function AgentFlow() {
  const [companyName, setCompanyName] = useState('');
  const [agentStates, setAgentStates] = useState(
    AGENTS.reduce((acc, a) => ({ ...acc, [a.id]: 'not_started' }), {})
  );
  const [companyFiles, setCompanyFiles] = useState([]);

  const checkStatus = async (name) => {
    if (!name) return;
    try {
      const { files } = await api.companies.get(name);
      setCompanyFiles(files || []);
      const newStates = { ...agentStates };
      for (const agent of AGENTS) {
        if (!agent.checkFiles) {
          // Lead finder — check if LEADS.md exists (can't check per company)
          newStates[agent.id] = 'not_started';
          continue;
        }
        const done = agent.checkFiles.every(f => files.includes(f));
        newStates[agent.id] = done ? 'completed' : 'not_started';
      }
      setAgentStates(newStates);
    } catch {
      setCompanyFiles([]);
    }
  };

  const completionPct = Object.values(agentStates).filter(s => s === 'completed').length / AGENTS.length * 100;

  return (
    <PageLayout title="Agent Flow" subtitle="Visual workflow showing your 5 AI sales agents">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Lookup */}
        <div className="card p-5">
          <h3 className="section-title text-sm mb-3">Check agent status for a company</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkStatus(companyName)}
              placeholder="company-name (folder)"
              className="input flex-1"
            />
            <button onClick={() => checkStatus(companyName)} className="btn-primary">
              Check Status
            </button>
          </div>
        </div>

        {/* Progress */}
        {companyName && (
          <div className="card p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Progress</span>
              <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{Math.round(completionPct)}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-700"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Agent cards */}
        <div className="space-y-0">
          {AGENTS.map((agent, i) => (
            <AgentStatusCard
              key={agent.id}
              agent={{ ...agent, status: agentStates[agent.id] }}
              index={i}
              isLast={i === AGENTS.length - 1}
            />
          ))}
        </div>

        {/* Full workflow command */}
        <CommandBox
          command={`/sales-ai-team full https://${companyName || 'company'}.com`}
          label="Run Full Workflow"
          description="Runs all 5 agents in sequence for a single company."
        />

        {/* Agent descriptions */}
        <div className="card p-5">
          <h3 className="section-title text-sm mb-3">How agents work together</h3>
          <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
            <p>Each agent reads the output of the previous one, building on the intelligence gathered. You can run them individually or use <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">/sales-ai-team full</code> to run them all.</p>
            <p>All agents use <strong className="text-slate-700 dark:text-slate-300">public information only</strong>. No private data, no fabricated contact details, no fake emails.</p>
            <p>Output files are saved to <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">sales-agent-workflow/companies/[name]/</code></p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
