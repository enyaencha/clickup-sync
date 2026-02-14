import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
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
import MyBudgetRequests from './components/MyBudgetRequests';

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
                        <ProtectedRoute requireFeature="programs">
                          <Programs />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute requireFeature="dashboard">
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Level 2: Sub-Programs/Projects (ClickUp Folder) */}
                    <Route
                      path="/program/:programId"
                      element={
                        <ProtectedRoute requireFeature="programs">
                          <SubPrograms />
                        </ProtectedRoute>
                      }
                    />

                    {/* Level 3: Project Components (ClickUp List) */}
                    <Route
                      path="/program/:programId/project/:projectId"
                      element={
                        <ProtectedRoute requireFeature="programs">
                          <ProjectComponents />
                        </ProtectedRoute>
                      }
                    />

                    {/* Level 4: Activities (ClickUp Task) */}
                    <Route
                      path="/program/:programId/project/:projectId/component/:componentId"
                      element={
                        <ProtectedRoute requireFeature="activities">
                          <Activities />
                        </ProtectedRoute>
                      }
                    />

                    {/* All Activities Page (with filters) */}
                    <Route
                      path="/activities"
                      element={
                        <ProtectedRoute requireFeature="activities">
                          <AllActivities />
                        </ProtectedRoute>
                      }
                    />

                    {/* Approvals Page */}
                    <Route
                      path="/approvals"
                      element={
                        <ProtectedRoute requireFeature="approvals">
                          <Approvals />
                        </ProtectedRoute>
                      }
                    />

                    {/* Settings Page */}
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute requireFeature="settings">
                          <Settings />
                        </ProtectedRoute>
                      }
                    />

                    {/* Logframe Routes */}
                    <Route
                      path="/logframe"
                      element={
                        <ProtectedRoute requireFeature="logframe">
                          <LogframeDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/dashboard"
                      element={
                        <ProtectedRoute requireFeature="logframe">
                          <LogframeDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/template/:moduleId"
                      element={
                        <ProtectedRoute requireFeature="logframe">
                          <LogframeTemplateView />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/indicators"
                      element={
                        <ProtectedRoute requireFeature="indicators">
                          <IndicatorsManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/indicators/:entityType/:entityId"
                      element={
                        <ProtectedRoute requireFeature="indicators">
                          <IndicatorsManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/assumptions"
                      element={
                        <ProtectedRoute requireFeature="assumptions">
                          <AssumptionsManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/assumptions/:entityType/:entityId"
                      element={
                        <ProtectedRoute requireFeature="assumptions">
                          <AssumptionsManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/verification"
                      element={
                        <ProtectedRoute requireFeature="verification">
                          <MeansOfVerificationManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/verification/:entityType/:entityId"
                      element={
                        <ProtectedRoute requireFeature="verification">
                          <MeansOfVerificationManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/results-chain"
                      element={
                        <ProtectedRoute requireFeature="results_chain">
                          <ResultsChainManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/logframe/results-chain/module/:moduleId"
                      element={
                        <ProtectedRoute requireFeature="results_chain">
                          <ResultsChainManagement />
                        </ProtectedRoute>
                      }
                    />

                    {/* SEEP Program Module Routes */}
                    <Route
                      path="/beneficiaries"
                      element={
                        <ProtectedRoute requireFeature="beneficiaries">
                          <Beneficiaries />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/shg"
                      element={
                        <ProtectedRoute requireFeature="shg">
                          <SHGManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/loans"
                      element={
                        <ProtectedRoute requireFeature="loans">
                          <LoansManagement />
                        </ProtectedRoute>
                      }
                    />

                    {/* Additional Program Module Routes */}
                    <Route
                      path="/gbv"
                      element={
                        <ProtectedRoute requireFeature="gbv">
                          <GBVCaseManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/relief"
                      element={
                        <ProtectedRoute requireFeature="relief">
                          <ReliefDistribution />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/nutrition"
                      element={
                        <ProtectedRoute requireFeature="nutrition">
                          <NutritionAssessment />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agriculture"
                      element={
                        <ProtectedRoute requireFeature="agriculture">
                          <AgricultureMonitoring />
                        </ProtectedRoute>
                      }
                    />

                    {/* Finance Management Module Routes */}
                    <Route
                      path="/finance"
                      element={
                        <ProtectedRoute requireFeature="finance">
                          <FinanceDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/finance/dashboard"
                      element={
                        <ProtectedRoute requireFeature="finance">
                          <FinanceDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-budget-requests"
                      element={
                        <ProtectedRoute requireFeature="finance">
                          <MyBudgetRequests />
                        </ProtectedRoute>
                      }
                    />

                    {/* Resource Management Module Routes */}
                    <Route
                      path="/resources"
                      element={
                        <ProtectedRoute requireFeature="resources">
                          <ResourceManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/resources/inventory"
                      element={
                        <ProtectedRoute requireFeature="resources">
                          <ResourceManagement />
                        </ProtectedRoute>
                      }
                    />

                    {/* Reports & Analytics Module Routes */}
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute requireFeature="reports">
                          <ReportsAnalytics />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports/analytics"
                      element={
                        <ProtectedRoute requireFeature="reports">
                          <ReportsAnalytics />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
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
