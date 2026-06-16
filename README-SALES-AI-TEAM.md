# Sales AI Team

A complete AI-powered B2B sales system with 5 specialized agents and a frontend dashboard.

## What You Get

### Claude Code Commands
```
/sales-ai-team icp              → Set up your Ideal Customer Profile
/sales-ai-team find-leads       → Find and score qualified leads
/sales-ai-team research <url>   → Deep-research a company
/sales-ai-team qualify <url>    → BANT + MEDDIC qualification
/sales-ai-team outreach <name>  → Full outreach sequence
/sales-ai-team prep <name>      → Meeting prep + objection playbook
/sales-ai-team full <url>       → Run the entire workflow end-to-end
```

### Frontend Dashboard
A modern web app at `http://localhost:5173` with 10 pages for viewing and managing your sales pipeline.

## Installation

### Step 1: Claude Code Agents (already installed)
The 5 subagent files are at `~/.claude/agents/`:
- `sales-lead-finder.md`
- `sales-company-researcher.md`
- `sales-opportunity-qualifier.md`
- `sales-outreach-strategist.md`
- `sales-meeting-coach.md`

The skill file is at `~/.claude/skills/sales-ai-team/SKILL.md`

### Step 2: Start the Backend
```bash
cd backend
npm install
npm run dev
```

### Step 3: Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

## Example Workflow

```bash
# 1. Set up your ICP
/sales-ai-team icp

# 2. Find leads
/sales-ai-team find-leads

# 3. Run full analysis on a company
/sales-ai-team full https://stripe.com

# 4. Open the dashboard
# → http://localhost:5173
# → Go to "Company Workspaces" to see all files
```

## Output Structure

```
sales-agent-workflow/
├── ICP.md
├── LEADS.md
├── LEADS.csv
└── companies/
    └── stripe/
        ├── COMPANY-RESEARCH.md
        ├── ACCOUNT-FIT.md
        ├── DECISION-MAKERS.md
        ├── LEAD-QUALIFICATION.md
        ├── OUTREACH-SEQUENCE.md
        ├── CALL-SCRIPT.md
        ├── MEETING-PREP.md
        ├── OBJECTION-PLAYBOOK.md
        ├── CLOSING-SCRIPTS.md
        └── SALES-PLAYBOOK.md
```

## Safe Usage

- **Public data only** — no private databases, paywalls, or login-gated pages
- **No fabricated emails** — only emails found on public pages are listed
- **Facts vs assumptions** — clearly labeled in every output
- **Professional outreach** — no spam, no deception, no misleading claims
- **Source links** — every fact has a source

## The 5 Agents

| Agent | Purpose | Output |
|-------|---------|--------|
| Lead Finder | Finds + scores prospects from public sources | LEADS.md, LEADS.csv |
| Company Researcher | Deep company + decision-maker research | COMPANY-RESEARCH.md, ACCOUNT-FIT.md, DECISION-MAKERS.md |
| Opportunity Qualifier | BANT + MEDDIC scoring | LEAD-QUALIFICATION.md |
| Outreach Strategist | Emails, LinkedIn, call scripts | OUTREACH-SEQUENCE.md, CALL-SCRIPT.md |
| Meeting Coach | Discovery, objections, closing | MEETING-PREP.md, OBJECTION-PLAYBOOK.md, CLOSING-SCRIPTS.md, SALES-PLAYBOOK.md |
