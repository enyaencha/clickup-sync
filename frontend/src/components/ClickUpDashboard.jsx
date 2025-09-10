import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    User,
    Calendar,
    MessageSquare,
    Timer,
    Sync,
    AlertCircle,
    Settings,
    Search,
    Plus,
    Filter,
    RefreshCw
} from 'lucide-react';

// Mock API client (replace with actual API calls)
const api = {
    async get(endpoint) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data based on endpoint
        switch (endpoint) {
            case '/api/stats/dashboard':
                return {
                    success: true,
                    dashboard: {
                        total_tasks: 145,
                        completed_tasks: 89,
                        overdue_tasks: 12,
                        assigned_to_me: 23,
                        total_time_spent: 487200000, // milliseconds
                        task_creation_trend: [
                            { date: '2024-08-20', count: 5 },
                            { date: '2024-08-21', count: 8 },
                            { date: '2024-08-22', count: 3 },
                            { date: '2024-08-23', count: 12 },
                            { date: '2024-08-24', count: 7 },
                            { date: '2024-08-25', count: 9 },
                            { date: '2024-08-26', count: 4 }
                        ]
                    }
                };
            case '/api/sync/status':
                return {
                    success: true,
                    status: {
                        last_full_sync: '2024-08-26T10:30:00Z',
                        sync_status: 'active',
                        pending_operations: 3,
                        pending_conflicts: 1,
                        recent_operations: [
                            { entity_type: 'task', operation_type: 'push', status: 'completed', completed_at: '2024-08-26T11:45:00Z' },
                            { entity_type: 'comment', operation_type: 'pull', status: 'completed', completed_at: '2024-08-26T11:44:00Z' }
                        ]
                    }
                };
            case '/api/conflicts':
                return {
                    success: true,
                    conflicts: [
                        {
                            id: 1,
                            entity_type: 'task',
                            entity_name: 'Fix login bug',
                            conflict_type: 'simultaneous_edit',
                            created_at: '2024-08-26T10:15:00Z'
                        }
                    ]
                };
            case '/api/tasks':
                return {
                    success: true,
                    tasks: [
                        {
                            id: 1,
                            clickup_id: 'abc123',
                            name: 'Implement user authentication',
                            list_name: 'Development',
                            status: 'In Progress',
                            status_color: '#4CAF50',
                            priority_name: 'High',
                            priority_color: '#FF9800',
                            assignee_names: 'John Doe, Jane Smith',
                            due_date: '2024-08-28T12:00:00Z',
                            comment_count: 5,
                            sync_status: 'synced',
                            local_updated_at: '2024-08-26T09:30:00Z'
                        },
                        {
                            id: 2,
                            clickup_id: 'def456',
                            name: 'Design user dashboard',
                            list_name: 'Design',
                            status: 'To Do',
                            status_color: '#9E9E9E',
                            priority_name: 'Medium',
                            priority_color: '#2196F3',
                            assignee_names: 'Bob Wilson',
                            due_date: '2024-08-30T15:00:00Z',
                            comment_count: 2,
                            sync_status: 'pending',
                            local_updated_at: '2024-08-26T11:15:00Z'
                        }
                    ]
                };
            default:
                return { success: false, error: 'Endpoint not found' };
        }
    },

    async post(endpoint, data) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, message: 'Operation completed' };
    }
};

// Utility functions
const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
};

// Components
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
        </div>
    </div>
);

const SyncStatus = ({ status, onSync }) => {
    const [syncing, setSyncing] = useState(false);

    const handleSync = async (type) => {
        setSyncing(true);
        try {
            await api.post(`/api/sync/${type}`);
            // Refresh data after sync
            window.location.reload();
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setSyncing(false);
        }
    };

    const getStatusColor = (syncStatus) => {
        switch (syncStatus) {
            case 'active': return 'text-green-600 bg-green-100';
            case 'paused': return 'text-yellow-600 bg-yellow-100';
            case 'error': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Sync Status</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status.sync_status)}`}>
                    {status.sync_status}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Full Sync:</span>
                    <span className="text-gray-900">{formatDateTime(status.last_full_sync)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending Operations:</span>
                    <span className="text-gray-900">{status.pending_operations}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending Conflicts:</span>
                    <span className={`${status.pending_conflicts > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {status.pending_conflicts}
          </span>
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => handleSync('pull')}
                    disabled={syncing}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                    Pull
                </button>
                <button
                    onClick={() => handleSync('push')}
                    disabled={syncing}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                    Push
                </button>
            </div>
        </div>
    );
};

const TaskList = ({ tasks, onTaskClick }) => {
    const getSyncStatusIcon = (status) => {
        switch (status) {
            case 'synced': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'conflict': return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
            default: return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                    </button>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => onTaskClick(task)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-medium text-gray-900">{task.name}</h4>
                                    {getSyncStatusIcon(task.sync_status)}
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="bg-gray-100 px-2 py-1 rounded">{task.list_name}</span>
                                    <span className={`px-2 py-1 rounded text-white`} style={{ backgroundColor: task.status_color }}>
                    {task.status}
                  </span>
                                    {task.priority_name && (
                                        <span className={`px-2 py-1 rounded text-white`} style={{ backgroundColor: task.priority_color }}>
                      {task.priority_name}
                    </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        <span>{task.assignee_names}</span>
                                    </div>
                                    {task.due_date && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{formatDate(task.due_date)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3" />
                                        <span>{task.comment_count} comments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ConflictList = ({ conflicts, onResolveConflict }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Sync Conflicts ({conflicts.length})
            </h3>
        </div>

        {conflicts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p>No conflicts to resolve</p>
            </div>
        ) : (
            <div className="divide-y divide-gray-200">
                {conflicts.map((conflict) => (
                    <div key={conflict.id} className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">{conflict.entity_name}</h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    {conflict.entity_type} • {conflict.conflict_type} • {formatDateTime(conflict.created_at)}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onResolveConflict(conflict.id, 'local_wins')}
                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                >
                                    Keep Local
                                </button>
                                <button
                                    onClick={() => onResolveConflict(conflict.id, 'clickup_wins')}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                >
                                    Use ClickUp
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const TaskModal = ({ task, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        due_date: '',
        priority_id: 3,
        status_id: 1
    });

    useEffect(() => {
        if (task) {
            setFormData({
                name: task.name || '',
                description: task.description || '',
                due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
                priority_id: task.priority_id || 3,
                status_id: task.status_id || 1
            });
        }
    }, [task]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (task?.id) {
                await api.put(`/api/tasks/${task.id}`, formData);
            } else {
                await api.post('/api/tasks', formData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to save task:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {task?.id ? 'Edit Task' : 'Create Task'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={formData.due_date}
                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                value={formData.priority_id}
                                onChange={(e) => setFormData({ ...formData, priority_id: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1}>Urgent</option>
                                <option value={2}>High</option>
                                <option value={3}>Normal</option>
                                <option value={4}>Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={formData.status_id}
                                onChange={(e) => setFormData({ ...formData, status_id: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1}>To Do</option>
                                <option value={2}>In Progress</option>
                                <option value={3}>Done</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
                        >
                            {task?.id ? 'Update Task' : 'Create Task'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SearchBar = ({ value, onChange, placeholder }) => (
    <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
    </div>
);

const FilterDropdown = ({ options, value, onChange, placeholder }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="">{placeholder}</option>
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

// Main Dashboard Component
const ClickUpDashboard = () => {
    const [dashboardStats, setDashboardStats] = useState(null);
    const [syncStatus, setSyncStatus] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [conflicts, setConflicts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsResponse, syncResponse, tasksResponse, conflictsResponse] = await Promise.all([
                api.get('/api/stats/dashboard'),
                api.get('/api/sync/status'),
                api.get('/api/tasks'),
                api.get('/api/conflicts')
            ]);

            if (statsResponse.success) setDashboardStats(statsResponse.dashboard);
            if (syncResponse.success) setSyncStatus(syncResponse.status);
            if (tasksResponse.success) setTasks(tasksResponse.tasks);
            if (conflictsResponse.success) setConflicts(conflictsResponse.conflicts);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsTaskModalOpen(true);
    };

    const handleResolveConflict = async (conflictId, resolution) => {
        try {
            await api.post(`/api/conflicts/${conflictId}/resolve`, { resolution });
            // Refresh conflicts list
            const response = await api.get('/api/conflicts');
            if (response.success) setConflicts(response.conflicts);
        } catch (error) {
            console.error('Failed to resolve conflict:', error);
        }
    };

    const handleSaveTask = () => {
        loadDashboardData(); // Refresh all data
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.list_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || task.status === statusFilter;
        const matchesPriority = !priorityFilter || task.priority_name === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Sync className="h-8 w-8 text-blue-600" />
                            <h1 className="text-xl font-semibold text-gray-900">ClickUp Sync Dashboard</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleCreateTask}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                New Task
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                                <Settings className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Dashboard Stats */}
                {dashboardStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Tasks"
                            value={dashboardStats.total_tasks}
                            icon={CheckCircle2}
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Completed Tasks"
                            value={dashboardStats.completed_tasks}
                            icon={CheckCircle2}
                            color="bg-green-500"
                        />
                        <StatCard
                            title="Overdue Tasks"
                            value={dashboardStats.overdue_tasks}
                            icon={AlertTriangle}
                            color="bg-red-500"
                        />
                        <StatCard
                            title="Assigned to Me"
                            value={dashboardStats.assigned_to_me}
                            icon={User}
                            color="bg-purple-500"
                        />
                    </div>
                )}

                {/* Sync Status and Conflicts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {syncStatus && (
                        <SyncStatus status={syncStatus} onSync={loadDashboardData} />
                    )}
                    <ConflictList conflicts={conflicts} onResolveConflict={handleResolveConflict} />
                </div>

                {/* Task Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-64">
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search tasks..."
                            />
                        </div>
                        <FilterDropdown
                            options={[
                                { value: 'To Do', label: 'To Do' },
                                { value: 'In Progress', label: 'In Progress' },
                                { value: 'Done', label: 'Done' }
                            ]}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            placeholder="All Statuses"
                        />
                        <FilterDropdown
                            options={[
                                { value: 'Urgent', label: 'Urgent' },
                                { value: 'High', label: 'High' },
                                { value: 'Normal', label: 'Normal' },
                                { value: 'Low', label: 'Low' }
                            ]}
                            value={priorityFilter}
                            onChange={setPriorityFilter}
                            placeholder="All Priorities"
                        />
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('');
                                setPriorityFilter('');
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Tasks List */}
                <TaskList tasks={filteredTasks} onTaskClick={handleTaskClick} />

                {/* Task Modal */}
                <TaskModal
                    task={selectedTask}
                    isOpen={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
                    onSave={handleSaveTask}
                />
            </div>
        </div>
    );
};

export default ClickUpDashboard;