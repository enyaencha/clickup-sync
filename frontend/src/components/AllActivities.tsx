import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityDetailsModal from './ActivityDetailsModal';

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
  status: string;
  approval_status: string;
  target_beneficiaries: number;
  actual_beneficiaries: number;
  budget_allocated: number;
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

const AllActivities: React.FC = () => {
  const navigate = useNavigate();

  // Data states
  const [activities, setActivities] = useState<Activity[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([]);
  const [components, setComponents] = useState<Component[]>([]);

  // Filter states
  const [moduleFilter, setModuleFilter] = useState('all');
  const [subProgramFilter, setSubProgramFilter] = useState('all');
  const [componentFilter, setComponentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

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
      const response = await fetch('/api/programs');
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
      const response = await fetch(`/api/sub-programs?module_id=${moduleId}`);
      if (!response.ok) throw new Error('Failed to fetch sub-programs');
      const data = await response.json();
      setSubPrograms(data.data || []);
    } catch (err) {
      console.error('Failed to fetch sub-programs:', err);
    }
  };

  const fetchComponents = async (subProgramId: string) => {
    try {
      const response = await fetch(`/api/components?sub_program_id=${subProgramId}`);
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

      const response = await fetch(`/api/activities?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data.data || []);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setModuleFilter('all');
    setSubProgramFilter('all');
    setComponentFilter('all');
    setStatusFilter('all');
    setApprovalFilter('all');
    setFromDate('');
    setToDate('');
  };

  const handleViewActivity = (activityId: number) => {
    setSelectedActivityId(activityId);
    setIsDetailsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const getStatusBadgeClass = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      planned: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
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

  // Statistics
  const stats = {
    total: activities.length,
    planned: activities.filter(a => a.status === 'planned').length,
    ongoing: activities.filter(a => a.status === 'ongoing').length,
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Activities</h1>
        <p className="text-gray-600 mt-1">View and manage all field activities across programs</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-600">Total Activities</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-600">Planned</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.planned}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-600">Ongoing</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.ongoing}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-600">Pending Approval</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">{stats.pending_approval}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={handleResetFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reset All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Module Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module
            </label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <p className="mt-2">No activities found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your filters or create a new activity
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module / Sub-Program / Component
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approval
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beneficiaries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                      <div className="text-sm text-gray-500">{activity.location || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">
                        <div className="font-medium text-gray-900">{activity.module_name}</div>
                        <div>{activity.sub_program_name}</div>
                        <div className="text-gray-400">{activity.component_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(activity.activity_date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getApprovalBadgeClass(
                          activity.approval_status
                        )}`}
                      >
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
                        {formatCurrency(activity.budget_spent)} / {formatCurrency(activity.budget_allocated)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewActivity(activity.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Activity Details Modal */}
      {isDetailsModalOpen && selectedActivityId && (
        <ActivityDetailsModal
          activityId={selectedActivityId}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedActivityId(null);
            fetchActivities(); // Refresh activities after closing modal
          }}
        />
      )}
    </div>
  );
};

export default AllActivities;
