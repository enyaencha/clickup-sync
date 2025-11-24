import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddSubProgramModal from './AddSubProgramModal';

interface SubProgram {
  id: number;
  program_module_id: number;
  name: string;
  description: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: string;
  progress?: number;
}

interface Program {
  id: number;
  name: string;
  code: string;
  icon: string;
}

interface ProgramStatistics {
  sub_programs: number;
  components: number;
  activities: number;
  overall_progress: number;
  activity_by_status: Array<{ status: string; count: number }>;
}

const SubPrograms: React.FC = () => {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([]);
  const [program, setProgram] = useState<Program | null>(null);
  const [statistics, setStatistics] = useState<ProgramStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProgram();
    fetchSubPrograms();
    fetchStatistics();
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

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/dashboard/program/${programId}`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStatistics(data.data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  };

  const handleSubProgramCreated = () => {
    fetchSubPrograms();
    fetchStatistics();
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 flex-wrap">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 active:text-blue-700">
              Programs
            </button>
            <span>/</span>
            <span className="text-gray-900 truncate">{program?.name || 'Loading...'}</span>
          </nav>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="text-3xl sm:text-4xl lg:text-5xl flex-shrink-0">{program?.icon}</span>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                {program?.name}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">Sub-Programs & Projects (ClickUp Folders)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Program Statistics Dashboard */}
        {statistics && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Program Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Sub-Programs Card */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-5 border-l-4 border-blue-500">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Sub-Programs</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{statistics.sub_programs}</p>
              </div>

              {/* Components Card */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-5 border-l-4 border-green-500">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Components</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{statistics.components}</p>
              </div>

              {/* Activities Card */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-5 border-l-4 border-purple-500">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Activities</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{statistics.activities}</p>
              </div>

              {/* Progress Card */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-5 border-l-4 border-yellow-500">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Progress</p>
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
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">Activity Status</h3>
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

        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              Sub-Programs ({subPrograms.length})
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Tap on a sub-program to view project components
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Project</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Sub-Programs List */}
        <div className="space-y-3 sm:space-y-4">
          {subPrograms.map((subProgram) => (
            <div
              key={subProgram.id}
              onClick={() => navigate(`/program/${programId}/project/${subProgram.id}`)}
              className="bg-white rounded-lg shadow hover:shadow-lg active:shadow-xl transition-all duration-200 p-4 sm:p-6 cursor-pointer border-l-4 border-blue-500 active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {subProgram.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{subProgram.description}</p>

                  {/* Progress Bar */}
                  {subProgram.progress !== undefined && (
                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">Overall Progress</span>
                        <span className="text-xs font-semibold text-gray-900">{subProgram.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            subProgram.progress === 100
                              ? 'bg-green-600'
                              : subProgram.progress >= 50
                              ? 'bg-blue-600'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${subProgram.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4">
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
                          className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
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

                <div className="ml-2 sm:ml-4 text-blue-600 flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
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
            <p className="text-sm sm:text-base text-gray-500">No sub-programs found for this program module</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm sm:text-base"
            >
              ← Back to Programs
            </button>
          </div>
        )}
      </main>

      {/* Add Sub-Program Modal */}
      <AddSubProgramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        programId={parseInt(programId!)}
        onSuccess={handleSubProgramCreated}
      />
    </div>
  );
};

export default SubPrograms;
