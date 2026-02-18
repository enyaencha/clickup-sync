import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Programs = lazy(() => import('./components/Programs'));
const SubPrograms = lazy(() => import('./components/SubPrograms'));
const ProjectComponents = lazy(() => import('./components/ProjectComponents'));
const Activities = lazy(() => import('./components/Activities'));
const AllActivities = lazy(() => import('./components/AllActivities'));
const Approvals = lazy(() => import('./components/Approvals'));
const Settings = lazy(() => import('./components/SettingsNew'));
const LogframeDashboard = lazy(() => import('./components/LogframeDashboard'));
const LogframeTemplateView = lazy(() => import('./components/LogframeTemplateView'));
const IndicatorsManagement = lazy(() => import('./components/IndicatorsManagement'));
const AssumptionsManagement = lazy(() => import('./components/AssumptionsManagement'));
const MeansOfVerificationManagement = lazy(() => import('./components/MeansOfVerificationManagement'));
const ResultsChainManagement = lazy(() => import('./components/ResultsChainManagement'));
const Beneficiaries = lazy(() => import('./components/Beneficiaries'));
const SHGManagement = lazy(() => import('./components/SHGManagement'));
const LoansManagement = lazy(() => import('./components/LoansManagement'));
const GBVCaseManagement = lazy(() => import('./components/GBVCaseManagement'));
const ReliefDistribution = lazy(() => import('./components/ReliefDistribution'));
const NutritionAssessment = lazy(() => import('./components/NutritionAssessment'));
const AgricultureMonitoring = lazy(() => import('./components/AgricultureMonitoring'));
const FinanceDashboard = lazy(() => import('./components/FinanceDashboard'));
const ResourceManagement = lazy(() => import('./components/ResourceManagement'));
const ReportsAnalytics = lazy(() => import('./components/ReportsAnalytics'));
const MyBudgetRequests = lazy(() => import('./components/MyBudgetRequests'));

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] w-full flex items-center justify-center">
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <span className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" aria-hidden="true" />
      <span>Loading page…</span>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<RouteLoadingFallback />}>
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
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
