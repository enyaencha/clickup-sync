import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddComponentModal from './AddComponentModal';

interface Component {
  id: number;
  sub_program_id: number;
  name: string;
  description: string;
  status: string;
  progress?: number;
}

const ProjectComponents: React.FC = () => {
  const { programId, projectId } = useParams<{ programId: string; projectId: string }>();
  const navigate = useNavigate();
  const [components, setComponents] = useState<Component[]>([]);
  const [project, setProject] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [programId, projectId]);

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

      // Fetch components
      const componentsRes = await fetch(`/api/components?sub_program_id=${projectId}`);
      if (!componentsRes.ok) throw new Error('Failed to fetch components');
      const componentsData = await componentsRes.json();
      setComponents(componentsData.data || []);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleComponentCreated = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading components...</p>
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
            onClick={() => navigate(`/program/${programId}`)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Sub-Programs
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
            <button onClick={() => navigate(`/program/${programId}`)} className="hover:text-blue-600 active:text-blue-700 truncate">
              {program?.name}
            </button>
            <span>/</span>
            <span className="text-gray-900 truncate">{project?.name || 'Loading...'}</span>
          </nav>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {project?.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">Project Components (ClickUp Lists)</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Components ({components.length})
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Work packages and thematic areas - tap to view activities
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Component</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {components.map((component) => (
            <div
              key={component.id}
              onClick={() => navigate(`/program/${programId}/project/${projectId}/component/${component.id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg active:shadow-xl transition-all duration-200 p-4 sm:p-6 cursor-pointer border-t-4 border-green-500 active:scale-[0.98]"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {component.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                {component.description}
              </p>

              {/* Progress Bar */}
              {component.progress !== undefined && (
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Progress</span>
                    <span className="text-xs font-semibold text-gray-900">{component.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        component.progress === 100
                          ? 'bg-green-600'
                          : component.progress >= 50
                          ? 'bg-blue-600'
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${component.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    component.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : component.status === 'planning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : component.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {component.status || 'unknown'}
                </span>

                <span className="text-blue-600 text-xs sm:text-sm font-medium">
                  View Activities →
                </span>
              </div>
            </div>
          ))}
        </div>

        {components.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-sm sm:text-base text-gray-500">No components found for this sub-program</p>
            <button
              onClick={() => navigate(`/program/${programId}`)}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm sm:text-base"
            >
              ← Back to Sub-Programs
            </button>
          </div>
        )}
      </main>

      {/* Add Component Modal */}
      <AddComponentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subProgramId={parseInt(projectId!)}
        onSuccess={handleComponentCreated}
      />
    </div>
  );
};

export default ProjectComponents;
