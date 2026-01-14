import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityDetailsModal from './ActivityDetailsModal';
import ActivityObjectivesModal from './ActivityObjectivesModal';
import ActivityVerificationModal from './ActivityVerificationModal';
import ActivityOutcomeModal from './ActivityOutcomeModal';
import BudgetRequestForm from './BudgetRequestForm';
import { authFetch } from '../config/api';

interface Activity {
  id: number;
  component_id: number;
  component_name: string;
  sub_program_id: number;
  sub_program_name: string;
  module_id: number;
  module_name: string;
  name: string;
  description: string;
  activity_date: string;
  location: string;

  // USER'S MANUAL STATUS (what user sets via dropdown)
  status: string;

  // AUTO-CALCULATED HEALTH STATUS (system calculated)
  auto_status?: string;

  approval_status: string;
  target_beneficiaries: number;
  actual_beneficiaries: number;
  budget_allocated: number;
  budget_approved?: number | null;
  budget_spent_expenditures?: number;
  budget_spent: number;
}

interface Module {
  id: number;
  name: string;
  code: string;
}

interface SubProgram {
  id: number;
  name: string;
  code: string;
  module_id: number;
}

interface Component {
  id: number;
  name: string;
  code: string;
  sub_program_id: number;
}

type ViewMode = 'list' | 'card';

const AllActivities: React.FC = () => {
  const navigate = useNavigate();

  // Data states
  const [activities, setActivities] = useState<Activity[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([]);
  const [components, setComponents] = useState<Component[]>([]);

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  // Filter states
  const [moduleFilter, setModuleFilter] = useState('all');
  const [subProgramFilter, setSubProgramFilter] = useState('all');
  const [componentFilter, setComponentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

  // New modal states
  const [showObjectivesModal, setShowObjectivesModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showBudgetRequestModal, setShowBudgetRequestModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdownId]);

  // Fetch modules on mount
  useEffect(() => {
    fetchModules();
  }, []);

  // Fetch sub-programs when module changes
  useEffect(() => {
    if (moduleFilter !== 'all') {
      fetchSubPrograms(moduleFilter);
    } else {
      setSubPrograms([]);
      setSubProgramFilter('all');
    }
  }, [moduleFilter]);

  // Fetch components when sub-program changes
  useEffect(() => {
    if (subProgramFilter !== 'all') {
      fetchComponents(subProgramFilter);
    } else {
      setComponents([]);
      setComponentFilter('all');
    }
  }, [subProgramFilter]);

  // Fetch activities when any filter changes
  useEffect(() => {
    fetchActivities();
  }, [moduleFilter, subProgramFilter, componentFilter, statusFilter, approvalFilter, fromDate, toDate]);

  const fetchModules = async () => {
    try {
      const response = await authFetch('/api/programs');
      if (!response.ok) throw new Error('Failed to fetch modules');
      const data = await response.json();
      setModules(data.data || []);
    } catch (err) {
      console.error('Failed to fetch modules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch modules');
    }
  };

  const fetchSubPrograms = async (moduleId: string) => {
    try {
      const response = await authFetch(`/api/sub-programs?module_id=${moduleId}`);
      if (!response.ok) throw new Error('Failed to fetch sub-programs');
      const data = await response.json();
      setSubPrograms(data.data || []);
    } catch (err) {
      console.error('Failed to fetch sub-programs:', err);
    }
  };

  const fetchComponents = async (subProgramId: string) => {
    try {
      const response = await authFetch(`/api/components?sub_program_id=${subProgramId}`);
      if (!response.ok) throw new Error('Failed to fetch components');
      const data = await response.json();
      setComponents(data.data || []);
    } catch (err) {
      console.error('Failed to fetch components:', err);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (moduleFilter !== 'all') params.append('module_id', moduleFilter);
      if (subProgramFilter !== 'all') params.append('sub_program_id', subProgramFilter);
      if (componentFilter !== 'all') params.append('component_id', componentFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (approvalFilter !== 'all') params.append('approval_status', approvalFilter);
      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);

      const response = await authFetch(`/api/activities?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      const fetchedActivities = data.data || [];
      const expenditureTotals = await fetchActivityExpenditureTotals(fetchedActivities);
      const enrichedActivities = fetchedActivities.map((activity: Activity) => {
        const totalSpent = expenditureTotals.get(activity.id) ?? 0;
        return {
          ...activity,
          budget_spent_expenditures: totalSpent,
          budget_spent: totalSpent || activity.budget_spent
        };
      });
      setActivities(enrichedActivities);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const fetchActivityExpenditureTotals = async (activitiesList: Activity[]) => {
    const totals = await Promise.all(
      activitiesList.map(async (activity) => {
        try {
          const response = await authFetch(`/api/budget-requests/activity/${activity.id}/expenditures`);
          if (!response.ok) {
            return { id: activity.id, total: 0 };
          }
          const responseData = await response.json();
          const total = (responseData.data || []).reduce(
            (sum: number, exp: { amount: number }) => sum + (exp.amount || 0),
            0
          );
          return { id: activity.id, total };
        } catch (error) {
          console.error('Failed to fetch expenditures:', error);
          return { id: activity.id, total: 0 };
        }
      })
    );

    return new Map(totals.map(({ id, total }) => [id, total]));
  };

  const handleResetFilters = () => {
    setModuleFilter('all');
    setSubProgramFilter('all');
    setComponentFilter('all');
    setStatusFilter('all');
    setApprovalFilter('all');
    setFromDate('');
    setToDate('');
    setSearchTerm('');
  };

  const filteredActivities = activities.filter((activity) => {
    if (!searchTerm.trim()) {
      return true;
    }
    const values = [
      activity.name,
      activity.description,
      activity.location,
      activity.module_name,
      activity.sub_program_name,
      activity.component_name,
    ];
    return values
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleViewActivity = (activityId: number) => {
    setSelectedActivityId(activityId);
    setIsDetailsModalOpen(true);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusBadgeClass = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      'not-started': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'blocked': 'bg-red-100 text-red-800 border-red-200',
      'cancelled': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getApprovalBadgeClass = (approvalStatus: string) => {
    const approvalClasses: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return approvalClasses[approvalStatus] || 'bg-gray-100 text-gray-800';
  };

  const getAutoStatusBadgeClass = (autoStatus: string) => {
    const classes: Record<string, string> = {
      'on-track': 'bg-green-100 text-green-800 border-green-300',
      'at-risk': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'behind-schedule': 'bg-orange-100 text-orange-800 border-orange-300',
      'delayed': 'bg-red-100 text-red-800 border-red-300',
      'off-track': 'bg-red-100 text-red-800 border-red-300',
    };
    return classes[autoStatus] || 'bg-gray-100 text-gray-600 border-gray-300';
  };

  const getAutoStatusIcon = (autoStatus: string) => {
    const icons: Record<string, string> = {
      'on-track': '✓',
      'at-risk': '⚠',
      'behind-schedule': '⏱',
      'delayed': '❌',
      'off-track': '❌',
    };
    return icons[autoStatus] || '○';
  };

  // Statistics
  const stats = {
    total: activities.length,
    not_started: activities.filter(a => a.status === 'not-started').length,
    in_progress: activities.filter(a => a.status === 'in-progress').length,
    completed: activities.filter(a => a.status === 'completed').length,
    pending_approval: activities.filter(a => a.approval_status === 'submitted').length,
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Activities</h1>
        <p className="text-gray-600 mt-1">View and manage all field activities across programs</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Activities</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-yellow-200">
          <div className="text-sm font-medium text-yellow-800">Not Started</div>
          <div className="text-3xl font-bold text-yellow-700 mt-2">{stats.not_started}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-blue-200">
          <div className="text-sm font-medium text-blue-800">In Progress</div>
          <div className="text-3xl font-bold text-blue-700 mt-2">{stats.in_progress}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-green-200">
          <div className="text-sm font-medium text-green-800">Completed</div>
          <div className="text-3xl font-bold text-green-700 mt-2">{stats.completed}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-orange-200">
          <div className="text-sm font-medium text-orange-800">Pending Approval</div>
          <div className="text-3xl font-bold text-orange-700 mt-2">{stats.pending_approval}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">🔍 Filters</h2>
          <button
            onClick={handleResetFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, location, or program..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Module Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module
            </label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Modules</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Program Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-Program
            </label>
            <select
              value={subProgramFilter}
              onChange={(e) => setSubProgramFilter(e.target.value)}
              disabled={moduleFilter === 'all'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="all">All Sub-Programs</option>
              {subPrograms.map((subProgram) => (
                <option key={subProgram.id} value={subProgram.id}>
                  {subProgram.name}
                </option>
              ))}
            </select>
          </div>

          {/* Component Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component
            </label>
            <select
              value={componentFilter}
              onChange={(e) => setComponentFilter(e.target.value)}
              disabled={subProgramFilter === 'all'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="all">All Components</option>
              {components.map((component) => (
                <option key={component.id} value={component.id}>
                  {component.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Approval Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approval Status
            </label>
            <select
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Approvals</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredActivities.length}</span> activities
        </div>
        <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1 border border-gray-200">
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'card'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Cards
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 List
          </button>
        </div>
      </div>

      {/* Activities Content */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading activities...</p>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-900">No activities found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your filters or create a new activity
          </p>
        </div>
      ) : viewMode === 'card' ? (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white line-clamp-2 flex-1">
                    {activity.name}
                  </h3>
                  {/* 3-Dot Menu */}
                  <div className="relative ml-2 dropdown-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === activity.id ? null : activity.id);
                      }}
                      className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {openDropdownId === activity.id && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                        <button
                          onClick={() => handleOpenObjectives(activity)}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                        >
                          <span className="text-lg">🎯</span>
                          <span className="font-medium">Set Objectives</span>
                        </button>
                        <button
                          onClick={() => handleOpenVerification(activity)}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                        >
                          <span className="text-lg">✅</span>
                          <span className="font-medium">Verify Activity</span>
                        </button>
                        <button
                          onClick={() => handleOpenOutcome(activity)}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                        >
                          <span className="text-lg">📊</span>
                          <span className="font-medium">Record Outcome</span>
                        </button>
                        <button
                          onClick={() => handleOpenBudgetRequest(activity)}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                        >
                          <span className="text-lg">💰</span>
                          <span className="font-medium">Request Budget</span>
                        </button>
                        <button
                          onClick={() => handleViewActivity(activity.id)}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 border-t border-gray-100"
                        >
                          <span className="text-lg">👁️</span>
                          <span className="font-medium">View Details</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hierarchy Info */}
                <div className="mt-2 text-xs text-blue-100">
                  <div>{activity.module_name}</div>
                  <div className="flex items-center gap-1">
                    <span>→</span>
                    <span>{activity.sub_program_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>→</span>
                    <span>{activity.component_name}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Location & Date */}
                <div className="mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <span>📍</span>
                    <span>{activity.location || 'No location specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{formatDate(activity.activity_date)}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {/* User Status */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs opacity-60 font-medium">Status</label>
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg border-2 ${getStatusBadgeClass(activity.status)}`}>
                      {activity.status.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Auto Status (Health) */}
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

                {/* Beneficiaries & Budget */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Beneficiaries</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {activity.actual_beneficiaries || 0} / {activity.target_beneficiaries || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Budget</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(activity.budget_spent_expenditures ?? activity.budget_spent)}
                      {' / '}
                      {formatCurrency(activity.budget_approved ?? activity.budget_allocated)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Hierarchy
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Health
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Approval
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Beneficiaries
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{activity.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <span>📍</span>
                        <span>{activity.location || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600">
                        <div className="font-semibold text-gray-900">{activity.module_name}</div>
                        <div className="text-gray-600">{activity.sub_program_name}</div>
                        <div className="text-gray-500">{activity.component_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(activity.activity_date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(activity.status)}`}>
                        {activity.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.auto_status ? (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAutoStatusBadgeClass(activity.auto_status)} inline-flex items-center gap-1`}>
                          <span>{getAutoStatusIcon(activity.auto_status)}</span>
                          <span>{activity.auto_status.replace('-', ' ')}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getApprovalBadgeClass(activity.approval_status)}`}>
                        {activity.approval_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {activity.actual_beneficiaries || 0} / {activity.target_beneficiaries || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(activity.budget_spent_expenditures ?? activity.budget_spent)}
                      </div>
                      <div className="text-xs text-gray-500">
                        / {formatCurrency(activity.budget_approved ?? activity.budget_allocated)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* 3-Dot Menu */}
                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === activity.id ? null : activity.id);
                          }}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {openDropdownId === activity.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <button
                              onClick={() => handleOpenObjectives(activity)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                            >
                              <span className="text-lg">🎯</span>
                              <span className="font-medium">Set Objectives</span>
                            </button>
                            <button
                              onClick={() => handleOpenVerification(activity)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                            >
                              <span className="text-lg">✅</span>
                              <span className="font-medium">Verify Activity</span>
                            </button>
                            <button
                              onClick={() => handleOpenOutcome(activity)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                            >
                              <span className="text-lg">📊</span>
                              <span className="font-medium">Record Outcome</span>
                            </button>
                            <button
                              onClick={() => handleOpenBudgetRequest(activity)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                            >
                              <span className="text-lg">💰</span>
                              <span className="font-medium">Request Budget</span>
                            </button>
                            <button
                              onClick={() => handleViewActivity(activity.id)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 border-t border-gray-100"
                            >
                              <span className="text-lg">👁️</span>
                              <span className="font-medium">View Details</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {isDetailsModalOpen && selectedActivityId && (
        <ActivityDetailsModal
          activityId={selectedActivityId}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedActivityId(null);
            fetchActivities(); // Refresh activities after closing modal
          }}
          isOpen={isDetailsModalOpen}
          onSuccess={fetchActivities}
        />
      )}

      {/* Objectives Modal */}
      {showObjectivesModal && selectedActivity && (
        <ActivityObjectivesModal
          isOpen={showObjectivesModal}
          activityId={selectedActivity.id}
          activityName={selectedActivity.name}
          onClose={() => {
            setShowObjectivesModal(false);
            setSelectedActivity(null);
            fetchActivities();
          }}
        />
      )}

      {/* Verification Modal */}
      {showVerificationModal && selectedActivity && (
        <ActivityVerificationModal
          isOpen={showVerificationModal}
          activityId={selectedActivity.id}
          activityName={selectedActivity.name}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedActivity(null);
            fetchActivities();
          }}
        />
      )}

      {/* Outcome Modal */}
      {showOutcomeModal && selectedActivity && (
        <ActivityOutcomeModal
          isOpen={showOutcomeModal}
          activityId={selectedActivity.id}
          activityName={selectedActivity.name}
          onClose={() => {
            setShowOutcomeModal(false);
            setSelectedActivity(null);
            fetchActivities();
          }}
        />
      )}

      {/* Budget Request Modal */}
      {showBudgetRequestModal && selectedActivity && (
        <BudgetRequestForm
          activityId={selectedActivity.id}
          onClose={() => {
            setShowBudgetRequestModal(false);
            setSelectedActivity(null);
          }}
          onSuccess={() => {
            setShowBudgetRequestModal(false);
            setSelectedActivity(null);
            fetchActivities(); // Refresh activities after budget request
          }}
        />
      )}
    </div>
  );
};

export default AllActivities;
