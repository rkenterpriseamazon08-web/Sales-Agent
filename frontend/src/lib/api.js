const BASE = '/api';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export const api = {
  health: () => get('/health'),
  dashboard: () => get('/files/dashboard'),
  icp: {
    get: () => get('/files/icp'),
    save: (content) => post('/files/icp', { content }),
  },
  leads: {
    get: () => get('/files/leads'),
  },
  companies: {
    list: () => get('/files/companies'),
    get: (name) => get(`/files/companies/${encodeURIComponent(name)}`),
    getFile: (name, file) => get(`/files/companies/${encodeURIComponent(name)}/${file}`),
  },
  workflow: {
    commands: () => get('/workflow/commands'),
    command: (action, params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return get(`/workflow/command/${action}${qs ? '?' + qs : ''}`);
    },
  },
};

// Parse CSV string into array of objects
export function parseCSV(csvString) {
  if (!csvString?.trim()) return [];
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header] = (values[i] || '').trim();
      return obj;
    }, {});
  });
}

// Extract score from markdown text
export function extractScore(text) {
  const match = text?.match(/(\d{1,3})\/100/);
  return match ? parseInt(match[1]) : null;
}

// Score color helper
export function scoreColor(score) {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export function scoreBadge(score) {
  if (score >= 80) return 'badge-green';
  if (score >= 60) return 'badge-amber';
  return 'badge-red';
}
