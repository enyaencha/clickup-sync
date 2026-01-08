import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authFetch } from '../config/api';

interface Activity {
    id: number;
    name: string;
    responsible_person: string;
    start_date: string;
    end_date: string;
    activity_date: string;
    status: string;
    auto_status?: string;
    manual_status?: string;
    status_override?: boolean;
    progress_percentage?: number;
    risk_level?: string;
    immediate_objectives?: string;
    expected_results?: string;
    outcome_notes?: string;
    challenges_faced?: string;
    lessons_learned?: string;
    recommendations?: string;
    indicators?: Indicator[];
    means_of_verification?: MeansOfVerification[];
}

interface Indicator {
    id: number;
    name: string;
    baseline_value?: number;
    target_value?: number;
    current_value?: number;
    achievement_percentage?: number;
    status?: string;
}

interface MeansOfVerification {
    id: number;
    verification_method: string;
}

interface Component {
    id: number;
    name: string;
    output: string;
    responsible_person: string;
    status?: string;
    overall_status?: string;
    progress_percentage?: number;
    activities: Activity[];
    indicators: Indicator[];
    means_of_verification: MeansOfVerification[];
}

interface SubProgram {
    id: number;
    name: string;
    outcome: string;
    components: Component[];
}

interface LogframeData {
    module: {
        id: number;
        name: string;
        code: string;
        goal: string;
    };
    subPrograms: SubProgram[];
}

const LogframeTemplateView: React.FC = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const navigate = useNavigate();

    const [logframeData, setLogframeData] = useState<LogframeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (moduleId) {
            fetchLogframeData();
        }
    }, [moduleId]);

    const fetchLogframeData = async () => {
        try {
            setLoading(true);
            const response = await authFetch(`/api/logframe/data/${moduleId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch logframe data');
            }

            const result = await response.json();
            console.log('📊 Logframe data received:', {
                moduleId,
                moduleName: result.data?.module?.name,
                subProgramCount: result.data?.subPrograms?.length,
                structure: result.data?.subPrograms?.map(sp => ({
                    subProgram: sp.name,
                    outcome: sp.outcome || 'EMPTY',
                    componentCount: sp.components?.length,
                    components: sp.components?.map(c => ({
                        name: c.name,
                        output: c.output || 'EMPTY',
                        activityCount: c.activities?.length
                    }))
                }))
            });
            setLogframeData(result.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching logframe data:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await authFetch(`/api/logframe/export/${moduleId}`);

            if (!response.ok) {
                throw new Error('Failed to export logframe');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Logframe_${logframeData?.module.code}_${Date.now()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error exporting logframe:', err);
            alert('Failed to export logframe: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadFile(e.target.files[0]);
            setUploadSuccess(null);
        }
    };

    const handleImport = async () => {
        if (!uploadFile) {
            alert('Please select a file to upload');
            return;
        }

        try {
            setUploading(true);
            setUploadSuccess(null);

            const formData = new FormData();
            formData.append('file', uploadFile);

            const response = await authFetch(`/api/logframe/import/${moduleId}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to import logframe');
            }

            const result = await response.json();
            setUploadSuccess(
                `Successfully imported: ${result.summary.subPrograms} sub-programs, ${result.summary.components} components, ${result.summary.activities} activities`
            );
            setUploadFile(null);
            setUploading(false);

            // Refresh data
            await fetchLogframeData();
        } catch (err) {
            console.error('Error importing logframe:', err);
            alert('Failed to import logframe: ' + (err instanceof Error ? err.message : 'Unknown error'));
            setUploading(false);
        }
    };

    const formatTimeframe = (activity: Activity): string => {
        if (activity.start_date && activity.end_date) {
            const start = new Date(activity.start_date);
            const end = new Date(activity.end_date);
            const startQ = `Q${Math.ceil((start.getMonth() + 1) / 3)} ${start.getFullYear()}`;
            const endQ = `Q${Math.ceil((end.getMonth() + 1) / 3)} ${end.getFullYear()}`;
            return startQ === endQ ? startQ : `${startQ} - ${endQ}`;
        } else if (activity.activity_date) {
            const date = new Date(activity.activity_date);
            return `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`;
        }
        return '';
    };

    const getStatusColor = (status: string): string => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower === 'completed') return 'bg-green-100 text-green-800';
        if (statusLower === 'on-track') return 'bg-green-100 text-green-800';
        if (statusLower === 'in-progress') return 'bg-blue-100 text-blue-800';
        if (statusLower === 'at-risk') return 'bg-yellow-100 text-yellow-800';
        if (statusLower === 'delayed') return 'bg-orange-100 text-orange-800';
        if (statusLower === 'off-track') return 'bg-red-100 text-red-800';
        if (statusLower === 'blocked') return 'bg-red-100 text-red-800';
        if (statusLower === 'cancelled') return 'bg-gray-100 text-gray-800';
        return 'bg-gray-100 text-gray-600';
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error || !logframeData) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-semibold">Error</h3>
                    <p className="text-red-600">{error || 'No logframe data available'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Logical Framework Template</h1>
                    <p className="text-gray-600">Program: {logframeData.module.name}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/logframe/${moduleId}`)}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Back to Dashboard
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                    >
                        <span>📥</span>
                        Export to Excel
                    </button>
                </div>
            </div>

            {/* Import Section */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Import from Excel</h3>
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                    />
                    <button
                        onClick={handleImport}
                        disabled={!uploadFile || uploading}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                {uploadSuccess && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-green-700">
                        {uploadSuccess}
                    </div>
                )}
            </div>

            {/* Goal Section */}
            <div className="mb-6 bg-white border border-gray-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-700">GOAL:</span>
                    <span className="text-gray-900">{logframeData.module.goal || 'Not set'}</span>
                </div>
            </div>

          {/* Logframe Table */}
{/* <div className="overflow-x-auto">
    <table className="min-w-full border-collapse border border-gray-300"> */}
{/* Logframe Table */}
<div className="overflow-auto border border-gray-300 rounded-lg" style={{ maxHeight: 'calc(100vh - 400px)' }}>
    <table className="w-full border-collapse border border-gray-300" style={{ minWidth: '2000px' }}>
        <thead className="sticky top-0 z-10">
            <tr className="bg-blue-100">
                <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-blue-100" style={{ minWidth: '250px' }}>
                    Strategic Objective
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-blue-100" style={{ minWidth: '250px' }}>
                    Intermediate Outcomes
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-blue-100" style={{ minWidth: '200px' }}>
                    Output
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-blue-100" style={{ minWidth: '250px' }}>
                    Key Activities
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-blue-100" style={{ minWidth: '200px' }}>
                    Indicators
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-blue-100" style={{ minWidth: '200px' }}>
                    Means of Verification
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-blue-100" style={{ minWidth: '120px' }}>
                    Timeframe
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-blue-100" style={{ minWidth: '150px' }}>
                    Responsibility
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-blue-100" style={{ minWidth: '120px' }}>
                    Status
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-700 bg-blue-100" style={{ minWidth: '120px' }}>
                    Progress %
                </th>
            </tr>
        </thead>
        <tbody>
            {logframeData.subPrograms.flatMap((subProgram, spIdx) =>
                subProgram.components.flatMap((component, compIdx) => {
                    const activities = component.activities.length > 0
                        ? component.activities
                        : [null];

                    return activities.map((activity, actIdx) => {
                        return (
                            <tr key={`${spIdx}-${compIdx}-${actIdx}`} className="hover:bg-gray-50">
                                {/* Strategic Objective */}
                                <td className="border border-gray-300 px-4 py-2 align-top" style={{ minWidth: '250px' }}>
                                    <div className="space-y-2">
                                        <div className="font-medium text-gray-900 mb-3">
                                            {logframeData.module.goal || 'Not set'}
                                        </div>

                                        {activity && (
                                            <>
                                                {activity.immediate_objectives && (
                                                    <div className="text-xs pt-2 border-t border-gray-300">
                                                        <span className="font-semibold text-purple-700">Objectives: </span>
                                                        <span className="text-gray-700">{activity.immediate_objectives}</span>
                                                    </div>
                                                )}

                                                {activity.expected_results && (
                                                    <div className="text-xs">
                                                        <span className="font-semibold text-indigo-700">Expected Results: </span>
                                                        <span className="text-gray-700">{activity.expected_results}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>

                                {/* Intermediate Outcome */}
                                <td className="border border-gray-300 px-4 py-2 align-top" style={{ minWidth: '250px' }}>
                                    <div className="space-y-2">
                                        <div className="font-medium text-gray-800 mb-3">
                                            {subProgram.outcome || '(No outcome set)'}
                                        </div>

                                        {activity && (
                                            <>
                                                {activity.outcome_notes && (
                                                    <div className="text-xs pt-2 border-t border-gray-300">
                                                        <span className="font-semibold text-green-700">Outcomes: </span>
                                                        <span className="text-gray-700">{activity.outcome_notes}</span>
                                                    </div>
                                                )}

                                                {activity.challenges_faced && (
                                                    <div className="text-xs">
                                                        <span className="font-semibold text-orange-700">Challenges: </span>
                                                        <span className="text-gray-700">{activity.challenges_faced}</span>
                                                    </div>
                                                )}

                                                {activity.lessons_learned && (
                                                    <div className="text-xs">
                                                        <span className="font-semibold text-blue-700">Lessons: </span>
                                                        <span className="text-gray-700">{activity.lessons_learned}</span>
                                                    </div>
                                                )}

                                                {activity.recommendations && (
                                                    <div className="text-xs">
                                                        <span className="font-semibold text-teal-700">Recommendations: </span>
                                                        <span className="text-gray-700">{activity.recommendations}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>

                                {/* Output */}
                                <td className="border border-gray-300 px-4 py-2 align-top" style={{ minWidth: '200px' }}>
                                    <div className="font-medium text-gray-800">
                                        {component.output || '(No output set)'}
                                    </div>
                                </td>

                                {/* Activity */}
                                <td className="border border-gray-300 px-4 py-2" style={{ minWidth: '250px' }}>
                                    {activity ? (
                                        <div className="font-medium text-gray-900">{activity.name}</div>
                                    ) : ''}
                                </td>

                                {/* Indicators */}
                                <td className="border border-gray-300 px-4 py-2" style={{ minWidth: '200px' }}>
                                    {activity && activity.indicators && activity.indicators.length > 0
                                        ? activity.indicators.map((ind) => ind.name).join('; ')
                                        : component.indicators && component.indicators.length > 0
                                        ? component.indicators.map((ind) => ind.name).join('; ')
                                        : '-'}
                                </td>

                                {/* Means of Verification */}
                                <td className="border border-gray-300 px-4 py-2" style={{ minWidth: '200px' }}>
                                    {activity && activity.means_of_verification && activity.means_of_verification.length > 0
                                        ? activity.means_of_verification
                                              .map((mov) => mov.verification_method)
                                              .join('; ')
                                        : component.means_of_verification && component.means_of_verification.length > 0
                                        ? component.means_of_verification
                                              .map((mov) => mov.verification_method)
                                              .join('; ')
                                        : '-'}
                                </td>

                                {/* Timeframe */}
                                <td className="border border-gray-300 px-4 py-2" style={{ minWidth: '120px' }}>
                                    {activity ? formatTimeframe(activity) : ''}
                                </td>

                                {/* Responsibility */}
                                <td className="border border-gray-300 px-4 py-2" style={{ minWidth: '150px' }}>
                                    {activity
                                        ? activity.responsible_person || ''
                                        : component.responsible_person || ''}
                                </td>

                                {/* Status */}
                                <td className="border border-gray-300 px-2 py-2" style={{ minWidth: '120px' }}>
                                    {activity && activity.status ? (
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(activity.status)}`}>
                                            {activity.status_override ? '⚠️ ' : ''}
                                            {activity.status.replace('-', ' ').toUpperCase()}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">-</span>
                                    )}
                                </td>

                                {/* Progress % */}
                                <td className="border border-gray-300 px-4 py-2 text-center" style={{ minWidth: '120px' }}>
                                    {activity && activity.progress_percentage !== undefined ? (
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${
                                                        activity.progress_percentage >= 75
                                                            ? 'bg-green-500'
                                                            : activity.progress_percentage >= 50
                                                            ? 'bg-blue-500'
                                                            : activity.progress_percentage >= 25
                                                            ? 'bg-yellow-500'
                                                            : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${activity.progress_percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-gray-700 w-10">
                                                {activity.progress_percentage}%
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs">-</span>
                                    )}
                                </td>
                            </tr>
                        );
                    });
                })
            )}
        </tbody>
    </table>
</div>
            {/* Instructions */}
            <div className="mt-6 bg-gray-50 border border-gray-300 rounded-lg p-4">
                <h3 className="font-bold text-gray-700 mb-2">Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                    <li>Use the strategic plan and operational plan to fill in the information</li>
                    <li>
                        Under Strategic Objective, Intermediate Outcomes, Outputs, Key indicators, MOV, Time frame
                        and responsibility use the guide provided in each of them
                    </li>
                    <li>Create more rows as may be required</li>
                </ol>
            </div>
        </div>
    );
};

export default LogframeTemplateView;
