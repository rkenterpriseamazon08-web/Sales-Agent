export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function slugify(str) {
  return str?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
}

export function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadMarkdown(md, filename) {
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

export function getFileLabel(filename) {
  const map = {
    'COMPANY-RESEARCH': 'Company Research',
    'ACCOUNT-FIT': 'Account Fit',
    'DECISION-MAKERS': 'Decision Makers',
    'LEAD-QUALIFICATION': 'Qualification',
    'OUTREACH-SEQUENCE': 'Outreach',
    'CALL-SCRIPT': 'Call Script',
    'MEETING-PREP': 'Meeting Prep',
    'OBJECTION-PLAYBOOK': 'Objections',
    'CLOSING-SCRIPTS': 'Closing Scripts',
    'SALES-PLAYBOOK': 'Sales Playbook',
    'PROSPECT-ANALYSIS': 'Prospect Analysis',
  };
  const key = filename.replace('.md', '');
  return map[key] || key;
}

export function getAgentForFile(filename) {
  const map = {
    'COMPANY-RESEARCH.md': 'sales-company-researcher',
    'ACCOUNT-FIT.md': 'sales-company-researcher',
    'DECISION-MAKERS.md': 'sales-company-researcher',
    'LEAD-QUALIFICATION.md': 'sales-opportunity-qualifier',
    'OUTREACH-SEQUENCE.md': 'sales-outreach-strategist',
    'CALL-SCRIPT.md': 'sales-outreach-strategist',
    'MEETING-PREP.md': 'sales-meeting-coach',
    'OBJECTION-PLAYBOOK.md': 'sales-meeting-coach',
    'CLOSING-SCRIPTS.md': 'sales-meeting-coach',
    'SALES-PLAYBOOK.md': 'sales-meeting-coach',
  };
  return map[filename] || null;
}
