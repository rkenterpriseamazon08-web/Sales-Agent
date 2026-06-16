import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import filesRouter from './routes/files.js';
import workflowRouter from './routes/workflow.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// Make workflow path available globally
app.locals.workflowPath = join(__dirname, '..', 'sales-agent-workflow');

app.use('/api/files', filesRouter);
app.use('/api/workflow', workflowRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Sales AI Team API running on http://localhost:${PORT}`);
  console.log(`Workflow path: ${app.locals.workflowPath}`);
});
