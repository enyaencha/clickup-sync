import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Program {
  id: number;
  name: string;
  code: string;
  icon: string;
  description: string;
  status: string;
  budget: number;
}

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      const data = await response.json();
      setPrograms(data.data);
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
          <p className="mt-4 text-gray-600">Loading programs...</p>
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
            onClick={fetchPrograms}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            M&E Project Management System
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Caritas Programs Dashboard</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
            Programs ({programs.length})
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Tap on a program to view projects and manage M&E indicators
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              onClick={() => navigate(`/program/${program.id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg active:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer active:scale-[0.98]"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-3xl sm:text-4xl flex-shrink-0">{program.icon}</span>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                        {program.name}
                      </h3>
                      <span className="text-xs sm:text-sm text-gray-500 font-mono">
                        {program.code}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2">
                  {program.description}
                </p>

                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500">Budget</span>
                    <p className="text-sm font-semibold text-gray-900">
                      ${program.budget ? program.budget.toLocaleString() : '0'}
                    </p>
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      program.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : program.status === 'planning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {program.status || 'unknown'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium w-full text-left">
                  View Projects →
                </button>
              </div>
            </div>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No programs found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Programs;
