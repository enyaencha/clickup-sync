import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import Programs from './components/Programs';
import SubPrograms from './components/SubPrograms';
import ProjectComponents from './components/ProjectComponents';
import Activities from './components/Activities';
import Approvals from './components/Approvals';
import Settings from './components/Settings';
import LogframeDashboard from './components/LogframeDashboard';
import IndicatorsManagement from './components/IndicatorsManagement';
import AssumptionsManagement from './components/AssumptionsManagement';
import MeansOfVerificationManagement from './components/MeansOfVerificationManagement';
import ResultsChainManagement from './components/ResultsChainManagement';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    {/* Level 1: Program Modules (ClickUp Space) */}
                    <Route path="/" element={<Programs />} />

                    {/* Level 2: Sub-Programs/Projects (ClickUp Folder) */}
                    <Route path="/program/:programId" element={<SubPrograms />} />

                    {/* Level 3: Project Components (ClickUp List) */}
                    <Route path="/program/:programId/project/:projectId" element={<ProjectComponents />} />

                    {/* Level 4: Activities (ClickUp Task) */}
                    <Route path="/program/:programId/project/:projectId/component/:componentId" element={<Activities />} />

                    {/* Approvals Page */}
                    <Route path="/approvals" element={<Approvals />} />

                    {/* Settings Page */}
                    <Route path="/settings" element={<Settings />} />

                    {/* Logframe Routes */}
                    <Route path="/logframe" element={<LogframeDashboard />} />
                    <Route path="/logframe/dashboard" element={<LogframeDashboard />} />
                    <Route path="/logframe/indicators" element={<IndicatorsManagement />} />
                    <Route path="/logframe/indicators/:entityType/:entityId" element={<IndicatorsManagement />} />
                    <Route path="/logframe/assumptions" element={<AssumptionsManagement />} />
                    <Route path="/logframe/assumptions/:entityType/:entityId" element={<AssumptionsManagement />} />
                    <Route path="/logframe/verification" element={<MeansOfVerificationManagement />} />
                    <Route path="/logframe/verification/:entityType/:entityId" element={<MeansOfVerificationManagement />} />
                    <Route path="/logframe/results-chain" element={<ResultsChainManagement />} />
                    <Route path="/logframe/results-chain/module/:moduleId" element={<ResultsChainManagement />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
