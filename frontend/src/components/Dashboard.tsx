import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../config/api';

type RoleGroup =
  | 'admin'
  | 'leadership'
  | 'finance'
  | 'field'
  | 'report'
  | 'other';

const roleGroups: Record<string, RoleGroup> = {
  system_admin: 'admin',
  me_director: 'leadership',
  program_director: 'leadership',
  module_manager: 'leadership',
  me_manager: 'leadership',
  program_manager: 'leadership',
  finance_manager: 'finance',
  finance_officer: 'finance',
  field_officer: 'field',
  data_entry_officer: 'field',
  data_entry_clerk: 'field',
  community_mobilizer: 'field',
  enumerator: 'field',
  report_viewer: 'report',
  external_auditor: 'report'
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const userRoles = user?.roles || [];
  const primaryRole = userRoles[0]?.name || 'user';
  const group = roleGroups[primaryRole] || 'other';
  const assignedModules = user?.module_assignments || [];
  const assignedModuleIds = useMemo(
    () => assignedModules.map((m) => m.module_id),
    [assignedModules]
  );

  const greeting = user?.full_name ? `Welcome, ${user.full_name}` : 'Welcome';

  const [overallStats, setOverallStats] = useState<any | null>(null);
  const [budgetSummary, setBudgetSummary] = useState<any[] | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<number | null>(null);
  const [syncStatus, setSyncStatus] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const statusData = useMemo(() => {
    const byStatus = overallStats?.activity_by_status || [];
    const total = byStatus.reduce((sum: number, item: any) => sum + Number(item.count || 0), 0) || 0;
    return byStatus.map((item: any) => ({
      status: item.status,
      count: Number(item.count || 0),
      percent: total > 0 ? Math.round((Number(item.count || 0) / total) * 100) : 0
    }));
  }, [overallStats]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      try {
        const moduleParam = assignedModuleIds.length > 0 ? `?modules=${assignedModuleIds.join(',')}` : '';
        const overallRes = await authFetch(`/api/dashboard/overall${moduleParam}`);
        const overallJson = await overallRes.json();
        if (overallRes.ok) {
          setOverallStats(overallJson.data);
        }

        if (group === 'finance') {
          const budgetRes = await authFetch('/api/finance/budget-summary');
          const budgetJson = await budgetRes.json();
          if (budgetRes.ok) {
            setBudgetSummary(budgetJson.data || []);
          }

          const approvalsRes = await authFetch('/api/finance/approvals?status=pending');
          const approvalsJson = await approvalsRes.json();
          if (approvalsRes.ok) {
            setPendingApprovals((approvalsJson.data || []).length);
          }
        }

        if (group === 'admin') {
          const syncRes = await authFetch('/api/dashboard/sync-status');
          const syncJson = await syncRes.json();
          if (syncRes.ok) {
            setSyncStatus(syncJson.data || []);
          }
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, group, assignedModuleIds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-slate-50 to-emerald-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 font-semibold">Dashboard</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{greeting}</h1>
              <p className="text-sm text-slate-600 mt-1">
                Role: <span className="font-semibold">{userRoles[0]?.display_name || 'User'}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {userRoles.map((role) => (
                <span
                  key={role.id}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200"
                >
                  {role.display_name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Assigned Modules */}
        <div className="mt-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Assigned Programs</h2>
              <span className="text-xs text-slate-500">Auto-filtered by your access</span>
            </div>
            {assignedModules.length === 0 ? (
              <div className="mt-4 text-sm text-slate-500">
                No specific assignments. You may see all programs depending on your role.
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {assignedModules.map((module) => (
                  <span
                    key={module.module_id}
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 font-medium"
                  >
                    {module.module_name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Role-specific content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {group === 'admin' && (
              <>
                <SectionTitle title="System Control Center" subtitle="Global visibility and configuration" />
                <CardGrid>
                <StatCard title="User Administration" value="Manage" hint="Roles, permissions, access" />
                  <StatCard
                    title="Sync & Integrations"
                    value={syncStatus ? `${syncStatus.length}` : loading ? '...' : '0'}
                    hint="Active sync queue items"
                  />
                  <StatCard title="Security Audit" value="Review" hint="Recent access logs" />
                  <StatCard title="System Health" value="Stable" hint="Services & database status" />
                </CardGrid>
              </>
            )}

            {group === 'leadership' && (
              <>
                <SectionTitle title="Program Overview" subtitle="Performance across assigned programs" />
                <CardGrid>
                  <StatCard
                    title="Active Programs"
                    value={overallStats ? `${overallStats.sub_programs}` : loading ? '...' : '0'}
                    hint="Sub-programs in scope"
                  />
                  <StatCard
                    title="Activities On Track"
                    value={overallStats ? `${overallStats.activities}` : loading ? '...' : '0'}
                    hint="Total activities in scope"
                  />
                  <StatCard title="Pending Approvals" value="-" hint="Requires action" />
                  <StatCard title="Data Quality Alerts" value="-" hint="Missing or inconsistent data" />
                </CardGrid>
                <HighlightCard
                  title="Executive Snapshot"
                  description="Key results, risks, and narrative summary will appear here."
                  action="Open reports"
                />
              </>
            )}

            {group === 'finance' && (
              <>
                <SectionTitle title="Finance Snapshot" subtitle="Budgets, approvals, and spend" />
                <CardGrid>
                  <StatCard
                    title="Budget Utilization"
                    value={budgetSummary ? `${budgetSummary.length}` : loading ? '...' : '0'}
                    hint="Programs with budgets"
                  />
                  <StatCard
                    title="Pending Requests"
                    value={pendingApprovals !== null ? `${pendingApprovals}` : loading ? '...' : '0'}
                    hint="Awaiting approval"
                  />
                  <StatCard title="Recent Transactions" value="-" hint="Latest 30 days" />
                  <StatCard title="Variance Alerts" value="-" hint="Over/under budget" />
                </CardGrid>
                <HighlightCard
                  title="Finance Actions"
                  description="Approve requests and review anomalies directly from your queue."
                  action="Go to finance"
                />
              </>
            )}

            {group === 'field' && (
              <>
                <SectionTitle title="Field Workspace" subtitle="Your daily operations" />
                <CardGrid>
                  <StatCard
                    title="Assigned Activities"
                    value={overallStats ? `${overallStats.activities}` : loading ? '...' : '0'}
                    hint="Total activities in scope"
                  />
                  <StatCard title="Forms to Submit" value="-" hint="Drafts pending" />
                  <StatCard title="Beneficiaries Updated" value="-" hint="Last 7 days" />
                  <StatCard title="Locations Covered" value="-" hint="Assigned areas" />
                </CardGrid>
                <HighlightCard
                  title="Quick Actions"
                  description="Create activities, update beneficiaries, and submit evidence."
                  action="Open activities"
                />
              </>
            )}

            {group === 'report' && (
              <>
                <SectionTitle title="Reporting" subtitle="Read-only insights" />
                <CardGrid>
                  <StatCard
                    title="Reports Available"
                    value={overallStats ? `${overallStats.sub_programs}` : loading ? '...' : '0'}
                    hint="Programs in scope"
                  />
                  <StatCard title="Key KPIs" value="-" hint="Summary view" />
                  <StatCard title="Program Trends" value="-" hint="Monthly trends" />
                  <StatCard title="Compliance Notes" value="-" hint="Audit highlights" />
                </CardGrid>
              </>
            )}

            {group === 'other' && (
              <>
                <SectionTitle title="Your Workspace" subtitle="Quick links based on your access" />
                <CardGrid>
                  <StatCard
                    title="Programs"
                    value={overallStats ? `${overallStats.sub_programs}` : loading ? '...' : '0'}
                    hint="Filtered access"
                  />
                  <StatCard
                    title="Activities"
                    value={overallStats ? `${overallStats.activities}` : loading ? '...' : '0'}
                    hint="Assigned modules"
                  />
                  <StatCard title="Reports" value="-" hint="Read-only" />
                  <StatCard title="Settings" value="-" hint="Theme and account" />
                </CardGrid>
              </>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Activity Progress</h3>
              <p className="text-xs text-slate-500 mt-1">Overall completion rate</p>
              <div className="mt-4 flex items-center justify-center">
                <ProgressRing
                  value={overallStats?.overall_progress ?? 0}
                  size={120}
                  stroke={12}
                />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Activity Status</h3>
              <p className="text-xs text-slate-500 mt-1">Distribution by status</p>
              <div className="mt-4 space-y-3">
                {loading && <div className="text-sm text-slate-500">Loading...</div>}
                {!loading && statusData.length === 0 && (
                  <div className="text-sm text-slate-500">No activity data.</div>
                )}
                {statusData.map((row: any) => (
                  <StatusBar
                    key={row.status}
                    label={row.status}
                    value={row.count}
                    percent={row.percent}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl p-5 shadow-md">
              <h3 className="text-lg font-bold">Status</h3>
              <p className="text-sm text-emerald-100 mt-1">You are signed in and synced.</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span>Session</span>
                <span className="font-semibold">Active</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span>Last login</span>
                <span className="font-semibold">Today</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Next Steps</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Review assigned programs.</li>
                <li>Complete pending actions.</li>
                <li>Update your profile in Settings.</li>
              </ul>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Help</h3>
              <p className="mt-2 text-sm text-slate-600">
                Need assistance? Contact your administrator for access updates or training.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div>
    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
  </div>
);

const CardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

const StatCard: React.FC<{ title: string; value: string; hint: string }> = ({ title, value, hint }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
    <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 font-semibold">{title}</p>
    <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
    <p className="text-xs text-slate-500 mt-1">{hint}</p>
  </div>
);

const HighlightCard: React.FC<{ title: string; description: string; action: string }> = ({ title, description, action }) => (
  <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <button className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
        {action}
      </button>
    </div>
    <p className="text-sm text-slate-600 mt-2">{description}</p>
  </div>
);

const ProgressRing: React.FC<{ value: number; size: number; stroke: number }> = ({ value, size, stroke }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="block">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e2e8f0"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#10b981"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-slate-900 font-bold text-lg"
      >
        {progress}%
      </text>
    </svg>
  );
};

const StatusBar: React.FC<{ label: string; value: number; percent: number }> = ({ label, value, percent }) => (
  <div>
    <div className="flex items-center justify-between text-xs text-slate-600">
      <span className="capitalize">{label.replace('-', ' ')}</span>
      <span className="font-semibold">{value}</span>
    </div>
    <div className="mt-1 h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-emerald-500 rounded-full"
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

export default Dashboard;
