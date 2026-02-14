import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddActivityModal from './AddActivityModal';
import ActivityDetailsModal from './ActivityDetailsModal';
import ActivityObjectivesModal from './ActivityObjectivesModal';
import ActivityVerificationModal from './ActivityVerificationModal';
import ActivityOutcomeModal from './ActivityOutcomeModal';
import ActivityChecklist from './ActivityChecklist';
import BudgetRequestForm from './BudgetRequestForm';
import ActivityExpenditureTracking from './ActivityExpenditureTracking';
import AddResourceRequestModal from './AddResourceRequestModal';
import { authFetch } from '../config/api';

interface Activity {
  id: number;
  component_id: number;
  name: string;
  description: string;
  activity_date: string;
  location: string;

  // USER'S MANUAL STATUS (what user sets via dropdown)
  // Values: not-started, in-progress, completed, blocked, cancelled
  // This is what we display in status dropdown and user can edit
  status: string;

  // AUTO-CALCULATED HEALTH STATUS (set by backend calculation)
  // Values: on-track, at-risk, behind-schedule
  // This is read-only, shown in health badge
  auto_status?: string;

  // For manual health override (advanced feature, not used in normal flow)
  manual_status?: string | null;

  approval_status: string;
  target_beneficiaries: number;
  actual_beneficiaries: number;
  budget_allocated: number;
  budget_approved?: number | null;
  budget_committed?: number | null;
  budget_remaining?: number | null;
  budget_spent: number;
  budget_spent_expenditures?: number;
}

interface ComponentStatistics {
  activities: number;
  overall_progress: number;
  activity_by_status: Array<{ status: string; count: number }>;
}

type ViewMode = 'list' | 'card';

const Activities: React.FC = () => {
  const { programId, projectId, componentId } = useParams<{
    programId: string;
    projectId: string;
    componentId: string;
  }>();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [component, setComponent] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [statistics, setStatistics] = useState<ComponentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View Mode
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [changingStatusId, setChangingStatusId] = useState<number | null>(null);

  // New modals
  const [showObjectivesModal, setShowObjectivesModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showBudgetRequestModal, setShowBudgetRequestModal] = useState(false);
  const [showResourceRequestModal, setShowResourceRequestModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Checklist visibility
  const [expandedChecklistId, setExpandedChecklistId] = useState<number | null>(null);

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
    fetchStatistics();
  }, [programId, projectId, componentId]);

  const fetchData = async () => {
    try {
      const [programsRes, projectsRes, componentsRes, activitiesRes] = await Promise.all([
        authFetch('/api/programs'),
        authFetch(`/api/sub-programs?module_id=${programId}`),
        authFetch(`/api/components?sub_program_id=${projectId}`),
        authFetch(`/api/activities?component_id=${componentId}`)
      ]);

      if (!activitiesRes.ok) throw new Error('Failed to fetch activities');

      const [programsData, projectsData, componentsData, activitiesData] = await Promise.all([
        programsRes.json(),
        projectsRes.json(),
        componentsRes.json(),
        activitiesRes.json()
      ]);

      const foundProgram = programsData.data.find((p: any) => p.id === parseInt(programId!));
      const foundProject = projectsData.data.find((p: any) => p.id === parseInt(projectId!));
      const foundComponent = componentsData.data.find((c: any) => c.id === parseInt(componentId!));

      setProgram(foundProgram);
      setProject(foundProject);
      setComponent(foundComponent);
      setActivities(activitiesData.data || []);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await authFetch(`/api/dashboard/component/${componentId}`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStatistics(data.data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleActivityCreated = () => {
    fetchData();
    fetchStatistics();
  };

  const handleSubmitForApproval = async (activityId: number) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    // Validate if submission is allowed
    try {
      const validationRes = await authFetch('/api/settings/validate/can-submit', {
        method: 'POST',
        body: JSON.stringify({ activity })
      });
      const validationData = await validationRes.json();

      if (!validationData.data.allowed) {
        alert(validationData.data.reason || 'Cannot submit this activity');
        return;
      }
    } catch (err) {
      console.error('Validation error:', err);
    }

    if (!confirm('Submit this activity for approval?')) return;

    try {
      setSubmittingId(activityId);
      const response = await authFetch(`/api/activities/${activityId}/submit`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to submit activity');
        return;
      }

      await fetchData();
      alert('Activity submitted for approval!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit activity');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleViewActivity = (activityId: number) => {
    setSelectedActivityId(activityId);
    setIsDetailsModalOpen(true);
  };

  const handleStatusChange = async (activityId: number, newStatus: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    // Validate if status change is allowed
    try {
      const validationRes = await authFetch('/api/settings/validate/can-change-status', {
        method: 'POST',
        body: JSON.stringify({ activity })
      });
      const validationData = await validationRes.json();

      if (!validationData.data.allowed) {
        alert(validationData.data.reason || 'Cannot change status of this activity');
        return;
      }
    } catch (err) {
      console.error('Validation error:', err);
    }

    try {
      setChangingStatusId(activityId);

      // TEMPORARY FIX: Backend still expects 'status' in request body
      // Backend should save this value to 'manual_status' column, NOT 'status' column
      // Backend should NOT copy this value to 'auto_status' - that's for auto-calculation only
      const response = await authFetch(`/api/activities/${activityId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to update status');
        return;
      }

      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setChangingStatusId(null);
    }
  };

  const handleOpenObjectives = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowObjectivesModal(true);
    setOpenDropdownId(null);
  };

  const handleOpenVerification = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowVerificationModal(true);
    setOpenDropdownId(null);
  };

  const handleOpenOutcome = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowOutcomeModal(true);
    setOpenDropdownId(null);
  };

  const handleOpenBudgetRequest = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowBudgetRequestModal(true);
    setOpenDropdownId(null);
  };

  const handleOpenResourceRequest = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowResourceRequestModal(true);
    setOpenDropdownId(null);
  };

  const handleOpenExpense = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowExpenseModal(true);
    setOpenDropdownId(null);
  };

  const toggleChecklist = (activityId: number) => {
    setExpandedChecklistId(expandedChecklistId === activityId ? null : activityId);
  };

  // Helper to get user status from status field
  const getUserStatus = (activity: Activity): string => {
    return activity.status || 'not-started';
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = searchTerm.trim() === '' || [
      activity.name,
      activity.description,
      activity.location,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
    const userStatus = getUserStatus(activity);
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && userStatus !== statusFilter) return false;
    if (approvalFilter !== 'all' && activity.approval_status !== approvalFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'bg-green-500',
      'in-progress': 'bg-blue-500',
      'not-started': 'bg-yellow-500',
      'blocked': 'bg-red-500',
      'cancelled': 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-400';
  };

  const getApprovalBadgeClass = (approvalStatus: string) => {
    const classes: Record<string, string> = {
      'approved': 'bg-green-100 text-green-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'rejected': 'bg-red-100 text-red-800',
      'draft': 'bg-gray-100 text-gray-800',
    };
    return classes[approvalStatus] || 'bg-gray-100 text-gray-800';
  };

  const getAutoStatusBadgeClass = (autoStatus: string) => {
    const classes: Record<string, string> = {
      'on-track': 'bg-green-100 text-green-800 border-green-300',
      'at-risk': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'behind-schedule': 'bg-red-100 text-red-800 border-red-300',
    };
    return classes[autoStatus] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getAutoStatusIcon = (autoStatus: string) => {
    const icons: Record<string, string> = {
      'on-track': '✓',
      'at-risk': '⚠️',
      'behind-schedule': '🚨',
    };
    return icons[autoStatus] || '●';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md">
          <h2 className="text-red-800 font-bold text-xl mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate(`/program/${programId}/project/${projectId}`)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            ← Back to Components
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--main-background)', color: 'var(--main-text)' }}>
      {/* Header */}
      <header className="shadow-md" style={{ background: 'var(--card-background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-4 flex-wrap">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">
              Programs
            </button>
            <span>/</span>
            <button onClick={() => navigate(`/program/${programId}`)} className="hover:text-blue-600 transition-colors truncate max-w-[150px]">
              {program?.name}
            </button>
            <span>/</span>
            <button onClick={() => navigate(`/program/${programId}/project/${projectId}`)} className="hover:text-blue-600 transition-colors truncate max-w-[150px]">
              {project?.name}
            </button>
            <span>/</span>
            <span className="font-medium truncate max-w-[150px]">{component?.name || 'Loading...'}</span>
          </nav>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">✓</span>
                {component?.name}
              </h1>
              <p className="mt-1 text-sm opacity-80">Field Activities Management</p>
            </div>
            <button
              onClick={() => navigate('/approvals')}
              className="ml-4 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all shadow-md hover:shadow-lg"
              style={{ background: 'var(--accent-primary)', color: 'white' }}
            >
              📋 Approvals
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Dashboard */}
        {statistics && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Component Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Activities */}
              <div className="rounded-xl shadow-lg p-6 border-l-4" style={{ background: 'var(--card-background)', borderLeftColor: 'var(--accent-primary)' }}>
                <p className="text-sm opacity-70 mb-1">Total Activities</p>
                <p className="text-4xl font-bold" style={{ color: 'var(--accent-primary)' }}>{statistics.activities}</p>
              </div>

              {/* Progress */}
              <div className="rounded-xl shadow-lg p-6 border-l-4 border-yellow-500" style={{ background: 'var(--card-background)' }}>
                <p className="text-sm opacity-70 mb-2">Completion Progress</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          statistics.overall_progress === 100 ? 'bg-green-600' :
                          statistics.overall_progress >= 50 ? 'bg-blue-600' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${statistics.overall_progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{statistics.overall_progress}%</span>
                </div>
              </div>

              {/* Status Breakdown */}
              {statistics.activity_by_status && statistics.activity_by_status.length > 0 && (
                statistics.activity_by_status.slice(0, 2).map((item) => (
                  <div key={item.status} className="rounded-xl shadow-lg p-6" style={{ background: 'var(--card-background)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`}></div>
                      <p className="text-sm opacity-70 capitalize">{item.status.replace('-', ' ')}</p>
                    </div>
                    <p className="text-4xl font-bold">{item.count}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Filters & View Toggle */}
        <div className="rounded-xl shadow-lg p-6 mb-6" style={{ background: 'var(--card-background)' }}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, description, or location..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{ background: 'var(--card-background)', borderColor: 'var(--card-border)' }}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{ background: 'var(--card-background)', borderColor: 'var(--card-border)' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Approval</label>
                <select
                  value={approvalFilter}
                  onChange={(e) => setApprovalFilter(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  style={{ background: 'var(--card-background)', borderColor: 'var(--card-border)' }}
                >
                  <option value="all">All Approvals</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* View Toggle & Add Button */}
            <div className="flex gap-3 items-center">
              {/* View Toggle */}
              <div className="flex rounded-lg overflow-hidden border-2" style={{ borderColor: 'var(--card-border)' }}>
                <button
                  onClick={() => setViewMode('card')}
                  className={`px-4 py-2 font-medium transition-all ${
                    viewMode === 'card'
                      ? 'text-white'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  style={viewMode === 'card' ? { background: 'var(--accent-primary)' } : {}}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 font-medium transition-all ${
                    viewMode === 'list'
                      ? 'text-white'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                  style={viewMode === 'list' ? { background: 'var(--accent-primary)' } : {}}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Add Activity Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                style={{ background: 'var(--accent-primary)', color: 'white' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Activity
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm opacity-70">
            Showing {filteredActivities.length} of {activities.length} activities
          </div>
        </div>

        {/* Activities Display */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-16 rounded-xl shadow-lg" style={{ background: 'var(--card-background)' }}>
            <span className="text-8xl mb-6 block">🔍</span>
            <p className="text-xl font-medium mb-2">No activities found</p>
            <p className="opacity-70 mb-6">Try adjusting your filters or create a new activity</p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setApprovalFilter('all');
              }}
              className="px-6 py-2 rounded-lg font-medium"
              style={{ background: 'var(--accent-primary)', color: 'white' }}
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === 'card' ? (
          // Card View
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2"
                style={{ background: 'var(--card-background)', borderColor: 'var(--card-border)' }}
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{activity.name}</h3>
                      <p className="text-sm opacity-70 line-clamp-2">{activity.description}</p>
                    </div>

                    {/* 3-Dot Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === activity.id ? null : activity.id);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdownId === activity.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdownId(null)}
                          />
                          <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl z-20 overflow-hidden border-2"
                            style={{ background: 'var(--card-background)', borderColor: 'var(--card-border)' }}
                          >
                            <button
                              onClick={() => handleOpenObjectives(activity)}
                              className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3"
                            >
                              <span className="text-xl">🎯</span>
                              <span className="font-medium">Add Objectives</span>
                            </button>
                            <button
                              onClick={() => handleOpenVerification(activity)}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3"
                            >
                              <span className="text-xl">✅</span>
                              <span className="font-medium">Verify Activity</span>
                            </button>
                            <button
                              onClick={() => handleOpenOutcome(activity)}
                              className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center gap-3"
                            >
                              <span className="text-xl">📊</span>
                              <span className="font-medium">Record Outcome</span>
                            </button>
                            <button
                              onClick={() => handleOpenBudgetRequest(activity)}
                              className="w-full px-4 py-3 text-left hover:bg-indigo-50 transition-colors flex items-center gap-3"
                            >
                              <span className="text-xl">💰</span>
                              <span className="font-medium">Request Budget</span>
                            </button>
                            <button
                              onClick={() => handleOpenResourceRequest(activity)}
                              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3"
                            >
                              <span className="text-xl">🧰</span>
                              <span className="font-medium">Request Resource</span>
                            </button>
                            <button
                              onClick={() => handleOpenExpense(activity)}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3"
                            >
                              <span className="text-xl">💵</span>
                              <span className="font-medium">Record Expense</span>
                            </button>
                            <button
                              onClick={() => {
                                toggleChecklist(activity.id);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-yellow-50 transition-colors flex items-center gap-3"
                            >
                              <span className="text-xl">☑️</span>
                              <span className="font-medium">View Checklist</span>
                            </button>
                            <div className="border-t" style={{ borderColor: 'var(--card-border)' }} />
                            <button
                              onClick={() => {
                                handleViewActivity(activity.id);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                            >
                              <span className="text-xl">👁️</span>
                              <span className="font-medium">View Full Details</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <span className="opacity-60">Date:</span>
                      <p className="font-medium">
                        {activity.activity_date ? new Date(activity.activity_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="opacity-60">Location:</span>
                      <p className="font-medium truncate">{activity.location || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="opacity-60">Beneficiaries:</span>
                      <p className="font-medium">
                        {activity.actual_beneficiaries || 0} / {activity.target_beneficiaries || 0}
                      </p>
                    </div>
                    <div>
                      <span className="opacity-60">Budget:</span>
                      <p className="font-medium">
                        {formatCurrency(activity.budget_spent_expenditures ?? activity.budget_spent ?? 0)}
                      </p>
                      <p className="text-xs opacity-60">
                        Approved: {formatCurrency(activity.budget_approved ?? activity.budget_allocated ?? 0)}
                      </p>
                    </div>
                  </div>

                  {/* Status & Approval Badges */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    {/* User Status (Manual) */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs opacity-60 font-medium">Status</label>
                      <select
                        value={getUserStatus(activity)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(activity.id, e.target.value);
                        }}
                        disabled={changingStatusId === activity.id}
                        className={`text-xs font-semibold rounded-lg px-3 py-1.5 border-0 cursor-pointer disabled:opacity-50 ${
                          getUserStatus(activity) === 'completed' ? 'bg-green-100 text-green-800' :
                          getUserStatus(activity) === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          getUserStatus(activity) === 'not-started' ? 'bg-yellow-100 text-yellow-800' :
                          getUserStatus(activity) === 'blocked' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Auto Status (Auto-calculated) */}
                    {activity.auto_status && (
                      <div className="flex flex-col gap-1">
                        <label className="text-xs opacity-60 font-medium">Health</label>
                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg border-2 ${getAutoStatusBadgeClass(activity.auto_status)} flex items-center gap-1`}>
                          <span>{getAutoStatusIcon(activity.auto_status)}</span>
                          <span className="capitalize">{activity.auto_status.replace('-', ' ')}</span>
                        </span>
                      </div>
                    )}

                    {/* Approval Status */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs opacity-60 font-medium">Approval</label>
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${getApprovalBadgeClass(activity.approval_status || 'draft')}`}>
                        {activity.approval_status || 'draft'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {activity.approval_status === 'draft' && (
                      <button
                        onClick={() => handleSubmitForApproval(activity.id)}
                        disabled={submittingId === activity.id}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium text-sm transition-all"
                      >
                        {submittingId === activity.id ? 'Submitting...' : '✓ Submit'}
                      </button>
                    )}
                    <button
                      onClick={() => handleViewActivity(activity.id)}
                      className="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                      style={{ background: 'var(--accent-primary)', color: 'white' }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>

                {/* Expandable Checklist */}
                {expandedChecklistId === activity.id && (
                  <div className="border-t p-5" style={{ borderColor: 'var(--card-border)' }}>
                    <ActivityChecklist
                      activityId={activity.id}
                      activityApprovalStatus={activity.approval_status}
                      readOnly={false}
                      onChecklistChange={fetchData}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="rounded-xl shadow-lg overflow-hidden" style={{ background: 'var(--card-background)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Beneficiaries</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">User Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Health</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Approval</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
                  {filteredActivities.map((activity) => (
                    <React.Fragment key={activity.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{activity.name}</div>
                          <div className="text-sm opacity-70 line-clamp-1">{activity.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {activity.activity_date ? new Date(activity.activity_date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {activity.location || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {activity.actual_beneficiaries || 0} / {activity.target_beneficiaries || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={getUserStatus(activity)}
                            onChange={(e) => handleStatusChange(activity.id, e.target.value)}
                            disabled={changingStatusId === activity.id}
                            className={`text-xs font-semibold rounded-lg px-3 py-1 border-0 cursor-pointer disabled:opacity-50 ${
                              getUserStatus(activity) === 'completed' ? 'bg-green-100 text-green-800' :
                              getUserStatus(activity) === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              getUserStatus(activity) === 'not-started' ? 'bg-yellow-100 text-yellow-800' :
                              getUserStatus(activity) === 'blocked' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value="not-started">Not Started</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="blocked">Blocked</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {activity.auto_status ? (
                            <span className={`px-3 py-1 text-xs font-semibold rounded-lg border-2 inline-flex items-center gap-1 ${getAutoStatusBadgeClass(activity.auto_status)}`}>
                              <span>{getAutoStatusIcon(activity.auto_status)}</span>
                              <span className="capitalize">{activity.auto_status.replace('-', ' ')}</span>
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getApprovalBadgeClass(activity.approval_status || 'draft')}`}>
                            {activity.approval_status || 'draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {activity.approval_status === 'draft' && (
                              <button
                                onClick={() => handleSubmitForApproval(activity.id)}
                                disabled={submittingId === activity.id}
                                className="text-green-600 hover:text-green-800 font-medium text-sm disabled:opacity-50"
                              >
                                {submittingId === activity.id ? 'Submitting...' : '✓ Submit'}
                              </button>
                            )}
                            <button
                              onClick={() => handleViewActivity(activity.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              View →
                            </button>

                            {/* 3-Dot Menu */}
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(openDropdownId === activity.id ? null : activity.id);
                                }}
                                className="p-1 rounded hover:bg-gray-100"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>

                              {openDropdownId === activity.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setOpenDropdownId(null)}
                                  />
                                  <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl z-20 overflow-hidden border-2"
                                    style={{ background: 'var(--card-background)', borderColor: 'var(--card-border)' }}
                                  >
                                    <button
                                      onClick={() => handleOpenObjectives(activity)}
                                      className="w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-colors flex items-center gap-2 text-sm"
                                    >
                                      <span>🎯</span> Add Objectives
                                    </button>
                                    <button
                                      onClick={() => handleOpenVerification(activity)}
                                      className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm"
                                    >
                                      <span>✅</span> Verify Activity
                                    </button>
                                    <button
                                      onClick={() => handleOpenOutcome(activity)}
                                      className="w-full px-4 py-2.5 text-left hover:bg-green-50 transition-colors flex items-center gap-2 text-sm"
                                    >
                                      <span>📊</span> Record Outcome
                                    </button>
                                    <button
                                      onClick={() => handleOpenBudgetRequest(activity)}
                                      className="w-full px-4 py-2.5 text-left hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm"
                                    >
                                      <span>💰</span> Request Budget
                                    </button>
                                    <button
                                      onClick={() => handleOpenResourceRequest(activity)}
                                      className="w-full px-4 py-2.5 text-left hover:bg-orange-50 transition-colors flex items-center gap-2 text-sm"
                                    >
                                      <span>🧰</span> Request Resource
                                    </button>
                                    <button
                                      onClick={() => handleOpenExpense(activity)}
                                      className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm"
                                    >
                                      <span>💵</span> Record Expense
                                    </button>
                                    <button
                                      onClick={() => {
                                        toggleChecklist(activity.id);
                                        setOpenDropdownId(null);
                                      }}
                                      className="w-full px-4 py-2.5 text-left hover:bg-yellow-50 transition-colors flex items-center gap-2 text-sm"
                                    >
                                      <span>☑️</span> View Checklist
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Checklist Row */}
                      {expandedChecklistId === activity.id && (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 bg-gray-50">
                            <ActivityChecklist
                              activityId={activity.id}
                              activityApprovalStatus={activity.approval_status}
                              readOnly={false}
                              onChecklistChange={fetchData}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        componentId={parseInt(componentId!)}
        onSuccess={handleActivityCreated}
      />

      <ActivityDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedActivityId(null);
        }}
        activityId={selectedActivityId}
        onSuccess={fetchData}
      />

      {selectedActivity && (
        <>
          <ActivityObjectivesModal
            isOpen={showObjectivesModal}
            onClose={() => {
              setShowObjectivesModal(false);
              setSelectedActivity(null);
            }}
            activityId={selectedActivity.id}
            activityName={selectedActivity.name}
          />

          <ActivityVerificationModal
            isOpen={showVerificationModal}
            onClose={() => {
              setShowVerificationModal(false);
              setSelectedActivity(null);
            }}
            activityId={selectedActivity.id}
            activityName={selectedActivity.name}
          />

          <ActivityOutcomeModal
            isOpen={showOutcomeModal}
            onClose={() => {
              setShowOutcomeModal(false);
              setSelectedActivity(null);
            }}
            activityId={selectedActivity.id}
            activityName={selectedActivity.name}
          />

          {showBudgetRequestModal && (
            <BudgetRequestForm
              activityId={selectedActivity.id}
              activityName={selectedActivity.name}
              onClose={() => {
                setShowBudgetRequestModal(false);
                setSelectedActivity(null);
              }}
              onSuccess={() => {
                setShowBudgetRequestModal(false);
                setSelectedActivity(null);
                fetchData(); // Refresh activities after budget request
              }}
            />
          )}

          {showResourceRequestModal && (
            <AddResourceRequestModal
              isOpen={showResourceRequestModal}
              onClose={() => {
                setShowResourceRequestModal(false);
                setSelectedActivity(null);
              }}
              onSuccess={() => {
                setShowResourceRequestModal(false);
                setSelectedActivity(null);
              }}
              activityId={selectedActivity.id}
              programModuleId={programId ? parseInt(programId) : undefined}
            />
          )}

          {showExpenseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
                  <h2 className="text-xl font-bold">Expenditure Tracking</h2>
                  <button
                    onClick={() => {
                      setShowExpenseModal(false);
                      setSelectedActivity(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <div className="p-4">
                  <ActivityExpenditureTracking
                    activityId={selectedActivity.id}
                    activityName={selectedActivity.name}
                    approvedBudget={selectedActivity.budget_approved ?? selectedActivity.budget_allocated ?? 0}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Activities;
