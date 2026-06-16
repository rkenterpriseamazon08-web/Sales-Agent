import { Router } from 'express';
import { readFile, writeFile, readdir, stat, mkdir } from 'fs/promises';
import { join, basename } from 'path';
import { existsSync } from 'fs';

const router = Router();

function getWorkflowPath(req) {
  return req.app.locals.workflowPath;
}

// GET /api/files/icp
router.get('/icp', async (req, res) => {
  try {
    const filePath = join(getWorkflowPath(req), 'ICP.md');
    if (!existsSync(filePath)) {
      return res.json({ content: '', exists: false });
    }
    const content = await readFile(filePath, 'utf-8');
    res.json({ content, exists: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/files/icp
router.post('/icp', async (req, res) => {
  try {
    const { content } = req.body;
    if (typeof content !== 'string') return res.status(400).json({ error: 'content required' });
    const filePath = join(getWorkflowPath(req), 'ICP.md');
    await writeFile(filePath, content, 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/files/leads
router.get('/leads', async (req, res) => {
  try {
    const wfPath = getWorkflowPath(req);
    const mdPath = join(wfPath, 'LEADS.md');
    const csvPath = join(wfPath, 'LEADS.csv');

    const md = existsSync(mdPath) ? await readFile(mdPath, 'utf-8') : '';
    const csv = existsSync(csvPath) ? await readFile(csvPath, 'utf-8') : '';

    res.json({ markdown: md, csv });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/files/companies
router.get('/companies', async (req, res) => {
  try {
    const companiesPath = join(getWorkflowPath(req), 'companies');
    if (!existsSync(companiesPath)) {
      return res.json({ companies: [] });
    }
    const entries = await readdir(companiesPath);
    const companies = await Promise.all(
      entries.map(async (name) => {
        const dirPath = join(companiesPath, name);
        const info = await stat(dirPath);
        if (!info.isDirectory()) return null;
        const files = await readdir(dirPath);
        return { name, files, lastModified: info.mtime };
      })
    );
    res.json({ companies: companies.filter(Boolean) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/files/companies/:name
router.get('/companies/:name', async (req, res) => {
  try {
    const companyPath = join(getWorkflowPath(req), 'companies', req.params.name);
    if (!existsSync(companyPath)) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const files = await readdir(companyPath);
    const contents = {};
    await Promise.all(
      files.map(async (file) => {
        const content = await readFile(join(companyPath, file), 'utf-8');
        const key = basename(file, '.md').toLowerCase().replace(/-/g, '_');
        contents[key] = content;
      })
    );
    res.json({ name: req.params.name, files, contents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/files/companies/:name/:file
router.get('/companies/:name/:file', async (req, res) => {
  try {
    const filePath = join(
      getWorkflowPath(req), 'companies', req.params.name, req.params.file
    );
    if (!existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const content = await readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/files/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const wfPath = getWorkflowPath(req);
    const companiesPath = join(wfPath, 'LEADS.csv');

    let totalLeads = 0;
    let avgScore = 0;
    let companies = [];

    if (existsSync(companiesPath)) {
      const csv = await readFile(companiesPath, 'utf-8');
      const rows = csv.split('\n').slice(1).filter(r => r.trim());
      totalLeads = rows.length;
      const scores = rows.map(r => parseInt(r.split(',')[6]) || 0).filter(s => s > 0);
      avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    }

    const companiesDirPath = join(wfPath, 'companies');
    let researchedCount = 0;
    let outreachCount = 0;
    let meetingPrepCount = 0;
    let recentCompanies = [];

    if (existsSync(companiesDirPath)) {
      const dirs = await readdir(companiesDirPath);
      for (const dir of dirs) {
        const dirPath = join(companiesDirPath, dir);
        const info = await stat(dirPath);
        if (!info.isDirectory()) continue;
        const files = await readdir(dirPath);
        if (files.includes('COMPANY-RESEARCH.md')) researchedCount++;
        if (files.includes('OUTREACH-SEQUENCE.md')) outreachCount++;
        if (files.includes('MEETING-PREP.md')) meetingPrepCount++;
        recentCompanies.push({ name: dir, files, lastModified: info.mtime });
      }
      recentCompanies.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
      recentCompanies = recentCompanies.slice(0, 5);
    }

    res.json({
      totalLeads,
      avgScore,
      researchedCount,
      outreachCount,
      meetingPrepCount,
      recentCompanies,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
