import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import ICPSetup from './pages/ICPSetup.jsx';
import LeadFinder from './pages/LeadFinder.jsx';
import CompanyResearch from './pages/CompanyResearch.jsx';
import Qualification from './pages/Qualification.jsx';
import Outreach from './pages/Outreach.jsx';
import MeetingPrep from './pages/MeetingPrep.jsx';
import CompanyWorkspace from './pages/CompanyWorkspace.jsx';
import AgentFlow from './pages/AgentFlow.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/icp" element={<ICPSetup />} />
      <Route path="/leads" element={<LeadFinder />} />
      <Route path="/research" element={<CompanyResearch />} />
      <Route path="/qualify" element={<Qualification />} />
      <Route path="/outreach" element={<Outreach />} />
      <Route path="/meeting" element={<MeetingPrep />} />
      <Route path="/workspace" element={<CompanyWorkspace />} />
      <Route path="/agents" element={<AgentFlow />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
