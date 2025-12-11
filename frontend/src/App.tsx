import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import Programs from './components/Programs';
import SubPrograms from './components/SubPrograms';
import ProjectComponents from './components/ProjectComponents';
import Activities from './components/Activities';
import AllActivities from './components/AllActivities';
import Approvals from './components/Approvals';
import Settings from './components/SettingsNew';
import LogframeDashboard from './components/LogframeDashboard';
import LogframeTemplateView from './components/LogframeTemplateView';
import IndicatorsManagement from './components/IndicatorsManagement';
import AssumptionsManagement from './components/AssumptionsManagement';
import MeansOfVerificationManagement from './components/MeansOfVerificationManagement';
import ResultsChainManagement from './components/ResultsChainManagement';
import Beneficiaries from './components/Beneficiaries';
import SHGManagement from './components/SHGManagement';
import LoansManagement from './components/LoansManagement';
import GBVCaseManagement from './components/GBVCaseManagement';
import ReliefDistribution from './components/ReliefDistribution';
import NutritionAssessment from './components/NutritionAssessment';
import AgricultureMonitoring from './components/AgricultureMonitoring';

const App: React.FC = () => {
  return (
    <ThemeProvider>
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

                    {/* All Activities Page (with filters) */}
                    <Route path="/activities" element={<AllActivities />} />

                    {/* Approvals Page */}
                    <Route path="/approvals" element={<Approvals />} />

                    {/* Settings Page */}
                    <Route path="/settings" element={<Settings />} />

                    {/* Logframe Routes */}
                    <Route path="/logframe" element={<LogframeDashboard />} />
                    <Route path="/logframe/dashboard" element={<LogframeDashboard />} />
                    <Route path="/logframe/template/:moduleId" element={<LogframeTemplateView />} />
                    <Route path="/logframe/indicators" element={<IndicatorsManagement />} />
                    <Route path="/logframe/indicators/:entityType/:entityId" element={<IndicatorsManagement />} />
                    <Route path="/logframe/assumptions" element={<AssumptionsManagement />} />
                    <Route path="/logframe/assumptions/:entityType/:entityId" element={<AssumptionsManagement />} />
                    <Route path="/logframe/verification" element={<MeansOfVerificationManagement />} />
                    <Route path="/logframe/verification/:entityType/:entityId" element={<MeansOfVerificationManagement />} />
                    <Route path="/logframe/results-chain" element={<ResultsChainManagement />} />
                    <Route path="/logframe/results-chain/module/:moduleId" element={<ResultsChainManagement />} />

                    {/* SEEP Program Module Routes */}
                    <Route path="/beneficiaries" element={<Beneficiaries />} />
                    <Route path="/shg" element={<SHGManagement />} />
                    <Route path="/loans" element={<LoansManagement />} />

                    {/* Additional Program Module Routes */}
                    <Route path="/gbv" element={<GBVCaseManagement />} />
                    <Route path="/relief" element={<ReliefDistribution />} />
                    <Route path="/nutrition" element={<NutritionAssessment />} />
                    <Route path="/agriculture" element={<AgricultureMonitoring />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
