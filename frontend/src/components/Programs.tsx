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

interface Statistics {
  sub_programs: number;
  components: number;
  activities: number;
  overall_progress: number;
  activity_by_status: Array<{ status: string; count: number }>;
}

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
    fetchStatistics();
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

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/dashboard/overall');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStatistics(data.data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                M&E Project Management System
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Caritas Programs Dashboard</p>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dashboard Statistics */}
        {statistics && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Overview Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6">
              {/* Sub-Programs Card */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-t-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Sub-Programs</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{statistics.sub_programs}</p>
                  </div>
                  <div className="text-blue-500 text-2xl sm:text-3xl">📁</div>
                </div>
              </div>

              {/* Components Card */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-t-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Components</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{statistics.components}</p>
                  </div>
                  <div className="text-green-500 text-2xl sm:text-3xl">📋</div>
                </div>
              </div>

              {/* Activities Card */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-t-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Activities</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{statistics.activities}</p>
                  </div>
                  <div className="text-purple-500 text-2xl sm:text-3xl">✓</div>
                </div>
              </div>

              {/* Overall Progress Card */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-t-4 border-yellow-500">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Overall Progress</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                        <div
                          className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
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
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      {statistics.overall_progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Status Breakdown */}
            {statistics.activity_by_status && statistics.activity_by_status.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Activity Status Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                  {statistics.activity_by_status.map((item) => (
                    <div key={item.status} className="text-center">
                      <p className="text-xs text-gray-600 mb-1 capitalize">
                        {item.status.replace('-', ' ')}
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">{item.count}</p>
                      <div
                        className={`mt-2 h-1 rounded-full ${
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
