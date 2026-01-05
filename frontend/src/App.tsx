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
import FinanceDashboard from './components/FinanceDashboard';
import ResourceManagement from './components/ResourceManagement';
import ReportsAnalytics from './components/ReportsAnalytics';

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
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <Programs />
                        </ProtectedRoute>
                      }
                    />

                    {/* Level 2: Sub-Programs/Projects (ClickUp Folder) */}
                    <Route
                      path="/program/:programId"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <SubPrograms />
                        </ProtectedRoute>
                      }
                    />

                    {/* Level 3: Project Components (ClickUp List) */}
                    <Route
                      path="/program/:programId/project/:projectId"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <ProjectComponents />
                        </ProtectedRoute>
                      }
                    />

                    {/* Level 4: Activities (ClickUp Task) */}
                    <Route
                      path="/program/:programId/project/:projectId/component/:componentId"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'read' }}>
                          <Activities />
                        </ProtectedRoute>
                      }
                    />

                    {/* All Activities Page (with filters) */}
                    <Route
                      path="/activities"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'read' }}>
                          <AllActivities />
                        </ProtectedRoute>
                      }
                    />

                    {/* Approvals Page */}
                    <Route
                      path="/approvals"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'approve' }}>
                          <Approvals />
                        </ProtectedRoute>
                      }
                    />

                    {/* Settings Page */}
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'settings', action: 'read' }}>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />

                    {/* Logframe Routes */}
                    <Route
                      path="/logframe"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <LogframeDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/dashboard"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <LogframeDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/template/:moduleId"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <LogframeTemplateView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/indicators"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <IndicatorsManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/indicators/:entityType/:entityId"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <IndicatorsManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/assumptions"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <AssumptionsManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/assumptions/:entityType/:entityId"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <AssumptionsManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/verification"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <MeansOfVerificationManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/verification/:entityType/:entityId"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <MeansOfVerificationManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/results-chain"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <ResultsChainManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/results-chain/module/:moduleId"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'modules', action: 'read' }}>
                          <ResultsChainManagement />
                        </ProtectedRoute>
                      }
                    />

                    {/* SEEP Program Module Routes */}
                    <Route
                      path="/beneficiaries"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'read' }}>
                          <Beneficiaries />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/shg"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'read' }}>
                          <SHGManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/loans"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'read' }}>
                          <LoansManagement />
                        </ProtectedRoute>
                      }
                    />

                    {/* Additional Program Module Routes */}
                    <Route
                      path="/gbv"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'read' }}>
                          <GBVCaseManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/relief"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'read' }}>
                          <ReliefDistribution />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/nutrition"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'read' }}>
                          <NutritionAssessment />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agriculture"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'read' }}>
                          <AgricultureMonitoring />
                        </ProtectedRoute>
                      }
                    />

                    {/* Finance Management Module Routes */}
                    <Route
                      path="/finance"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'reports', action: 'read' }}>
                          <FinanceDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/finance/dashboard"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'reports', action: 'read' }}>
                          <FinanceDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Resource Management Module Routes */}
                    <Route
                      path="/resources"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'read' }}>
                          <ResourceManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/resources/inventory"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'activities', action: 'read' }}>
                          <ResourceManagement />
                        </ProtectedRoute>
                      }
                    />

                    {/* Reports & Analytics Module Routes */}
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'reports', action: 'read' }}>
                          <ReportsAnalytics />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports/analytics"
                      element={
                        <ProtectedRoute requirePermission={{ resource: 'reports', action: 'read' }}>
                          <ReportsAnalytics />
                        </ProtectedRoute>
                      }
                    />
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
