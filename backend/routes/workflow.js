import { Router } from 'express';

const router = Router();

// Returns the Claude Code command to run for each workflow step
// Frontend uses these to display "copy & run" commands — no direct execution
router.get('/command/:action', (req, res) => {
  const { action } = req.params;
  const { url, company } = req.query;

  const commands = {
    icp: '/sales-ai-team icp',
    'find-leads': '/sales-ai-team find-leads',
    research: url ? `/sales-ai-team research ${url}` : null,
    qualify: url ? `/sales-ai-team qualify ${url}` : null,
    outreach: (company || url) ? `/sales-ai-team outreach ${company || url}` : null,
    prep: (company || url) ? `/sales-ai-team prep ${company || url}` : null,
    full: url ? `/sales-ai-team full ${url}` : null,
  };

  const command = commands[action];
  if (!command) {
    return res.status(400).json({ error: 'Unknown action or missing parameters' });
  }

  res.json({ command, action });
});

// GET /api/workflow/commands — list all available commands
router.get('/commands', (req, res) => {
  res.json({
    commands: [
      {
        name: 'icp',
        command: '/sales-ai-team icp',
        description: 'Set up or update your Ideal Customer Profile',
        requiresUrl: false,
      },
      {
        name: 'find-leads',
        command: '/sales-ai-team find-leads',
        description: 'Find and score qualified leads from public sources',
        requiresUrl: false,
      },
      {
        name: 'research',
        command: '/sales-ai-team research <url>',
        description: 'Deep research on a specific company',
        requiresUrl: true,
      },
      {
        name: 'qualify',
        command: '/sales-ai-team qualify <url>',
        description: 'Qualify opportunity using BANT and MEDDIC frameworks',
        requiresUrl: true,
      },
      {
        name: 'outreach',
        command: '/sales-ai-team outreach <company>',
        description: 'Create full outreach sequence for a company',
        requiresUrl: false,
        requiresCompany: true,
      },
      {
        name: 'prep',
        command: '/sales-ai-team prep <company>',
        description: 'Generate meeting prep, objection playbook, and closing scripts',
        requiresUrl: false,
        requiresCompany: true,
      },
      {
        name: 'full',
        command: '/sales-ai-team full <url>',
        description: 'Run the complete workflow end-to-end for a company',
        requiresUrl: true,
      },
    ],
  });
});

export default router;
