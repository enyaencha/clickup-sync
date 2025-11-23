import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface SubProgram {
  id: number;
  program_module_id: number;
  name: string;
  description: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: string;
}

interface Program {
  id: number;
  name: string;
  code: string;
  icon: string;
}

const SubPrograms: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([]);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgram();
    fetchSubPrograms();
  }, [programId]);

  const fetchProgram = async () => {
    try {
      const response = await fetch(`/api/programs`);
      if (!response.ok) throw new Error('Failed to fetch program');
      const data = await response.json();
      const foundProgram = data.data.find((p: Program) => p.id === parseInt(programId!));
      setProgram(foundProgram);
    } catch (err) {
      console.error('Error fetching program:', err);
    }
  };

  const fetchSubPrograms = async () => {
    try {
      const response = await fetch(`/api/sub-programs?module_id=${programId}`);
      if (!response.ok) throw new Error('Failed to fetch sub-programs');
      const data = await response.json();
      setSubPrograms(data.data || []);
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
          <p className="mt-4 text-gray-600">Loading sub-programs...</p>
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
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Programs
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
            <span className="text-gray-900">{program?.name || 'Loading...'}</span>
          </nav>

          <div className="flex items-center space-x-4">
            <span className="text-5xl">{program?.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {program?.name}
              </h1>
              <p className="mt-1 text-gray-600">Sub-Programs & Projects (ClickUp Folders)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Sub-Programs ({subPrograms.length})
          </h2>
          <p className="text-gray-600">
            Click on a sub-program to view project components
          </p>
        </div>

        {/* Sub-Programs List */}
        <div className="space-y-4">
          {subPrograms.map((subProgram) => (
            <div
              key={subProgram.id}
              onClick={() => navigate(`/program/${programId}/project/${subProgram.id}`)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {subProgram.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{subProgram.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <span className="text-xs text-gray-500">Budget</span>
                      <p className="text-sm font-semibold text-gray-900">
                        ${subProgram.budget ? subProgram.budget.toLocaleString() : '0'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Start Date</span>
                      <p className="text-sm font-semibold text-gray-900">
                        {subProgram.start_date ? new Date(subProgram.start_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">End Date</span>
                      <p className="text-sm font-semibold text-gray-900">
                        {subProgram.end_date ? new Date(subProgram.end_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Status</span>
                      <p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            subProgram.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : subProgram.status === 'planning'
                              ? 'bg-yellow-100 text-yellow-800'
                              : subProgram.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {subProgram.status || 'unknown'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ml-4 text-blue-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {subPrograms.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No sub-programs found for this program module</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              ← Back to Programs
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubPrograms;
