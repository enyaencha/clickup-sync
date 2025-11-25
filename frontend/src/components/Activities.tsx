import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddActivityModal from './AddActivityModal';
import ActivityDetailsModal from './ActivityDetailsModal';

interface Activity {
  id: number;
  component_id: number;
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

interface ComponentStatistics {
  activities: number;
  overall_progress: number;
  activity_by_status: Array<{ status: string; count: number }>;
}

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

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [changingStatusId, setChangingStatusId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
    fetchStatistics();
  }, [programId, projectId, componentId]);

  const fetchData = async () => {
    try {
      // Fetch program info
      const programsRes = await fetch('/api/programs');
      const programsData = await programsRes.json();
      const foundProgram = programsData.data.find((p: any) => p.id === parseInt(programId!));
      setProgram(foundProgram);

      // Fetch project info
      const projectsRes = await fetch(`/api/sub-programs?module_id=${programId}`);
      const projectsData = await projectsRes.json();
      const foundProject = projectsData.data.find((p: any) => p.id === parseInt(projectId!));
      setProject(foundProject);

      // Fetch component info
      const componentsRes = await fetch(`/api/components?sub_program_id=${projectId}`);
      const componentsData = await componentsRes.json();
      const foundComponent = componentsData.data.find((c: any) => c.id === parseInt(componentId!));
      setComponent(foundComponent);

      // Fetch activities
      const activitiesRes = await fetch(`/api/activities?component_id=${componentId}`);
      if (!activitiesRes.ok) throw new Error('Failed to fetch activities');
      const activitiesData = await activitiesRes.json();
      setActivities(activitiesData.data || []);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/dashboard/component/${componentId}`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStatistics(data.data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const handleActivityCreated = () => {
    fetchData();
    fetchStatistics();
  };

  const handleSubmitForApproval = async (activityId: number) => {
    if (!confirm('Submit this activity for approval?')) return;

    try {
      setSubmittingId(activityId);
      const response = await fetch(`/api/activities/${activityId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to submit activity');

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
    try {
      setChangingStatusId(activityId);
      const response = await fetch(`/api/activities/${activityId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setChangingStatusId(null);
    }
  };

  const filteredActivities = activities.filter((activity) => {
    if (statusFilter !== 'all' && activity.status !== statusFilter) return false;
    if (approvalFilter !== 'all' && activity.approval_status !== approvalFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate(`/program/${programId}/project/${projectId}`)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Components
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 flex-wrap">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 active:text-blue-700">
              Programs
            </button>
            <span>/</span>
            <button onClick={() => navigate(`/program/${programId}`)} className="hover:text-blue-600 active:text-blue-700 truncate max-w-[80px] sm:max-w-none">
              {program?.name}
            </button>
            <span>/</span>
            <button onClick={() => navigate(`/program/${programId}/project/${projectId}`)} className="hover:text-blue-600 active:text-blue-700 truncate max-w-[80px] sm:max-w-none">
              {project?.name}
            </button>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[100px] sm:max-w-none">{component?.name || 'Loading...'}</span>
          </nav>

          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {component?.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">Field Activities (ClickUp Tasks)</p>
          </div>
          <button
            onClick={() => navigate('/approvals')}
            className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium whitespace-nowrap"
          >
            📋 Approvals
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Component Statistics Dashboard */}
        {statistics && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Component Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Activities Card */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-5 border-l-4 border-purple-500">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Activities</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{statistics.activities}</p>
              </div>

              {/* Progress Card */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-5 border-l-4 border-yellow-500">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Completion Progress</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          statistics.overall_progress === 100
                            ? 'bg-green-600'
                            : statistics.overall_progress >= 50
                            ? 'bg-blue-600'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${statistics.overall_progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {statistics.overall_progress}%
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Status Breakdown */}
            {statistics.activity_by_status && statistics.activity_by_status.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4 sm:p-5 mt-4 sm:mt-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">Activity Status Breakdown</h3>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {statistics.activity_by_status.map((item) => (
                    <div key={item.status} className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          item.status === 'completed'
                            ? 'bg-green-500'
                            : item.status === 'in-progress'
                            ? 'bg-blue-500'
                            : item.status === 'not-started'
                            ? 'bg-yellow-500'
                            : item.status === 'blocked'
                            ? 'bg-red-500'
                            : 'bg-gray-400'
                        }`}
                      ></div>
                      <span className="text-xs sm:text-sm text-gray-700 capitalize">
                        {item.status.replace('-', ' ')}:
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Approval Status
              </label>
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Approvals</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="sm:flex-1"></div>

            <div className="flex items-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 active:bg-blue-800 text-sm sm:text-base"
              >
                + New Activity
              </button>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
            Showing {filteredActivities.length} of {activities.length} activities
          </div>
        </div>

        {/* Activities - Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beneficiaries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approval
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{activity.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.activity_date ? new Date(activity.activity_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.location || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.actual_beneficiaries || 0} / {activity.target_beneficiaries || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={activity.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(activity.id, e.target.value);
                        }}
                        disabled={changingStatusId === activity.id}
                        className={`text-xs font-semibold rounded-lg px-3 py-1 border-0 cursor-pointer disabled:opacity-50 ${
                          activity.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : activity.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : activity.status === 'not-started'
                            ? 'bg-yellow-100 text-yellow-800'
                            : activity.status === 'blocked'
                            ? 'bg-red-100 text-red-800'
                            : activity.status === 'cancelled'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-gray-100 text-gray-800'
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
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.approval_status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : activity.approval_status === 'submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : activity.approval_status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {activity.approval_status || 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {activity.approval_status === 'draft' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubmitForApproval(activity.id);
                            }}
                            disabled={submittingId === activity.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 font-medium"
                          >
                            {submittingId === activity.id ? 'Submitting...' : '✓ Submit'}
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewActivity(activity.id);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No activities found matching your filters</p>
              <button
                onClick={() => navigate(`/program/${programId}/project/${projectId}`)}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                ← Back to Components
              </button>
            </div>
          )}
        </div>

        {/* Activities - Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-lg shadow p-4 active:shadow-lg transition-all duration-200 active:scale-[0.99]"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{activity.name}</h3>
                <button
                  onClick={() => handleViewActivity(activity.id)}
                  className="text-blue-600 text-xs whitespace-nowrap ml-2"
                >
                  View →
                </button>
              </div>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{activity.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-gray-500">Date:</span>
                  <p className="font-medium text-gray-900">
                    {activity.activity_date ? new Date(activity.activity_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <p className="font-medium text-gray-900 truncate">{activity.location || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Beneficiaries:</span>
                  <p className="font-medium text-gray-900">
                    {activity.actual_beneficiaries || 0} / {activity.target_beneficiaries || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                <select
                  value={activity.status}
                  onChange={(e) => handleStatusChange(activity.id, e.target.value)}
                  disabled={changingStatusId === activity.id}
                  className={`text-xs font-semibold rounded-lg px-2 py-1 border-0 cursor-pointer disabled:opacity-50 ${
                    activity.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : activity.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : activity.status === 'not-started'
                      ? 'bg-yellow-100 text-yellow-800'
                      : activity.status === 'blocked'
                      ? 'bg-red-100 text-red-800'
                      : activity.status === 'cancelled'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    activity.approval_status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : activity.approval_status === 'submitted'
                      ? 'bg-blue-100 text-blue-800'
                      : activity.approval_status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {activity.approval_status || 'draft'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t">
                {activity.approval_status === 'draft' && (
                  <button
                    onClick={() => handleSubmitForApproval(activity.id)}
                    disabled={submittingId === activity.id}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-xs font-medium"
                  >
                    {submittingId === activity.id ? 'Submitting...' : '✓ Submit for Approval'}
                  </button>
                )}
                <button className="flex-1 text-blue-600 text-xs font-medium">
                  View Details →
                </button>
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-sm text-gray-500">No activities found matching your filters</p>
              <button
                onClick={() => navigate(`/program/${programId}/project/${projectId}`)}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Back to Components
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add Activity Modal */}
      <AddActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        componentId={parseInt(componentId!)}
        onSuccess={handleActivityCreated}
      />

      {/* Activity Details Modal */}
      <ActivityDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedActivityId(null);
        }}
        activityId={selectedActivityId}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Activities;
