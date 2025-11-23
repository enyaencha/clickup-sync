import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Component {
  id: number;
  sub_program_id: number;
  name: string;
  description: string;
  status: string;
}

const ProjectComponents: React.FC = () => {
  const { programId, projectId } = useParams<{ programId: string; projectId: string }>();
  const navigate = useNavigate();
  const [components, setComponents] = useState<Component[]>([]);
  const [project, setProject] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">
              Programs
            </button>
            <span>/</span>
            <button onClick={() => navigate(`/program/${programId}`)} className="hover:text-blue-600">
              {program?.name}
            </button>
            <span>/</span>
            <span className="text-gray-900">{project?.name || 'Loading...'}</span>
          </nav>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {project?.name}
            </h1>
            <p className="mt-1 text-gray-600">Project Components (ClickUp Lists)</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Components ({components.length})
          </h2>
          <p className="text-gray-600">
            Work packages and thematic areas - click to view activities
          </p>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((component) => (
            <div
              key={component.id}
              onClick={() => navigate(`/program/${programId}/project/${projectId}/component/${component.id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border-t-4 border-green-500"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {component.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {component.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
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

                <span className="text-blue-600 text-sm font-medium">
                  View Activities →
                </span>
              </div>
            </div>
          ))}
        </div>

        {components.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No components found for this sub-program</p>
            <button
              onClick={() => navigate(`/program/${programId}`)}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Sub-Programs
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectComponents;
