import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');

  useEffect(() => {
    fetchData();
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4 flex-wrap">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">
              Programs
            </button>
            <span>/</span>
            <button onClick={() => navigate(`/program/${programId}`)} className="hover:text-blue-600">
              {program?.name}
            </button>
            <span>/</span>
            <button onClick={() => navigate(`/program/${programId}/project/${projectId}`)} className="hover:text-blue-600">
              {project?.name}
            </button>
            <span>/</span>
            <span className="text-gray-900">{component?.name || 'Loading...'}</span>
          </nav>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {component?.name}
            </h1>
            <p className="mt-1 text-gray-600">Field Activities (ClickUp Tasks)</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approval Status
              </label>
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Approvals</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex-1"></div>

            <div className="flex items-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                + New Activity
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredActivities.length} of {activities.length} activities
          </div>
        </div>

        {/* Activities Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activity.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : activity.status === 'ongoing'
                          ? 'bg-blue-100 text-blue-800'
                          : activity.status === 'planned'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {activity.status || 'unknown'}
                    </span>
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
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
      </main>
    </div>
  );
};

export default Activities;
