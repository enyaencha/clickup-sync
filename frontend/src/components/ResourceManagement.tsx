import React, { useEffect, useState } from 'react';
import { authFetch } from '../config/api';
import AddResourceModal from './AddResourceModal';
import AddResourceRequestModal from './AddResourceRequestModal';
import EditResourceModal from './EditResourceModal';
import ResourceTypeModal from './ResourceTypeModal';

interface Resource {
  id: number;
  resource_code: string;
  name: string;
  category: string;
  availability_status: string;
  condition_status: string;
  assigned_to_user?: string;
  assigned_to_program?: string;
  location: string;
  quantity: number;
}

interface ResourceRequest {
  id: number;
  request_number: string;
  resource_id?: number;
  resource_name: string;
  request_type: string;
  quantity_requested: number;
  purpose: string;
  status: string;
  priority: string;
  start_date?: string;
  end_date?: string;
  requester_name: string;
  program_module_name?: string;
  resource_status?: string;
  has_conflict?: boolean;
  queue_position?: number | null;
  conflict_details?: {
    request_number: string;
    status: string;
    start_date: string;
    end_date: string;
    requester_name?: string;
  } | null;
}

interface ResourceType {
  id: number;
  name: string;
  category: string;
}

interface ResourceComment {
  id: number;
  comment_text: string;
  created_at: string;
  created_by_name?: string;
}

const ResourceManagement: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests' | 'maintenance'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [maintenanceSearchTerm, setMaintenanceSearchTerm] = useState('');
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [commentThreads, setCommentThreads] = useState<Record<number, ResourceComment[]>>({});
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchResourceData();
  }, []);

  const fetchResourceData = async () => {
    try {
      setLoading(true);

      // Fetch resources inventory
      const resourcesResponse = await authFetch('/api/resources');
      if (resourcesResponse.ok) {
        const resourcesData = await resourcesResponse.json();
        setResources(resourcesData.data || []);
      }

      // Fetch resource requests
      const requestsResponse = await authFetch('/api/resources/requests');
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setRequests(requestsData.data || []);
      }

      // Fetch resource types
      const typesResponse = await authFetch('/api/resources/types');
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        setResourceTypes(typesData.data || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch resource data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    const colors: { [key: string]: string } = {
      'available': 'bg-green-100 text-green-800',
      'in_use': 'bg-blue-100 text-blue-800',
      'reserved': 'bg-yellow-100 text-yellow-800',
      'under_maintenance': 'bg-orange-100 text-orange-800',
      'retired': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'allocated': 'bg-purple-100 text-purple-800',
      'returned': 'bg-gray-100 text-gray-800',
      'rejected': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800',
    };
    return colors[(status || '').toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getConditionColor = (condition?: string) => {
    const colors: { [key: string]: string } = {
      'excellent': 'text-green-600',
      'good': 'text-blue-600',
      'fair': 'text-yellow-600',
      'poor': 'text-orange-600',
      'damaged': 'text-red-600',
    };
    return colors[(condition || '').toLowerCase()] || 'text-gray-600';
  };

  const getCategoryIcon = (category?: string) => {
    const icons: { [key: string]: string } = {
      'equipment': '🖥️',
      'vehicle': '🚗',
      'facility': '🏢',
      'material': '📦',
      'technology': '💻',
      'human_resource': '👤',
      'other': '📋',
    };
    return icons[(category || '').toLowerCase()] || '📋';
  };

  const handleApproveRequest = async (requestId: number) => {
    if (!window.confirm('Are you sure you want to approve this resource request?')) {
      return;
    }

    try {
      const response = await authFetch(`/api/resources/requests/${requestId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve request');
      }

      alert('Resource request approved successfully!');
      await fetchResourceData();
    } catch (error) {
      console.error('Error approving resource request:', error);
      alert(error instanceof Error ? error.message : 'Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason || reason.trim() === '') {
      alert('Rejection reason is required');
      return;
    }

    try {
      const response = await authFetch(`/api/resources/requests/${requestId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rejection_reason: reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject request');
      }

      alert('Resource request rejected');
      await fetchResourceData();
    } catch (error) {
      console.error('Error rejecting resource request:', error);
      alert(error instanceof Error ? error.message : 'Failed to reject request');
    }
  };

  const handleAllocateRequest = async (requestId: number) => {
    if (!window.confirm('Allocate this resource now?')) {
      return;
    }

    try {
      const response = await authFetch(`/api/resources/requests/${requestId}/allocate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to allocate request');
      }

      alert('Resource allocated successfully!');
      await fetchResourceData();
    } catch (error) {
      console.error('Error allocating resource request:', error);
      alert(error instanceof Error ? error.message : 'Failed to allocate request');
    }
  };

  const handleReturnRequest = async (requestId: number) => {
    if (!window.confirm('Confirm that this resource has been returned?')) {
      return;
    }

    try {
      const response = await authFetch(`/api/resources/requests/${requestId}/return`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm return');
      }

      alert('Resource return confirmed.');
      await fetchResourceData();
    } catch (error) {
      console.error('Error confirming resource return:', error);
      alert(error instanceof Error ? error.message : 'Failed to confirm return');
    }
  };

  const toggleComments = async (requestId: number) => {
    const isOpen = !!expandedComments[requestId];
    if (isOpen) {
      setExpandedComments((prev) => ({ ...prev, [requestId]: false }));
      return;
    }

    if (!commentThreads[requestId]) {
      try {
        const response = await authFetch(`/api/resources/requests/${requestId}/comments`);
        if (response.ok) {
          const data = await response.json();
          setCommentThreads((prev) => ({
            ...prev,
            [requestId]: data.data || []
          }));
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    }

    setExpandedComments((prev) => ({ ...prev, [requestId]: true }));
  };

  const handleAddComment = async (requestId: number) => {
    const text = (commentDrafts[requestId] || '').trim();
    if (!text) {
      alert('Please enter a comment before submitting.');
      return;
    }

    try {
      const response = await authFetch(`/api/resources/requests/${requestId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: text })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }

      setCommentDrafts((prev) => ({ ...prev, [requestId]: '' }));

      const refreshed = await authFetch(`/api/resources/requests/${requestId}/comments`);
      if (refreshed.ok) {
        const data = await refreshed.json();
        setCommentThreads((prev) => ({
          ...prev,
          [requestId]: data.data || []
        }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(error instanceof Error ? error.message : 'Failed to add comment');
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingResource(null);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = (resource.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.resource_code || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || resource.availability_status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredRequests = requests.filter((request) => {
    if (!requestSearchTerm.trim()) return true;
    const values = [
      request.resource_name,
      request.request_number,
      request.requester_name,
      request.purpose,
    ];
    return values
      .filter(Boolean)
      .some((value) => (value as string).toLowerCase().includes(requestSearchTerm.toLowerCase()));
  });

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const availableResources = resources.filter(r => r.availability_status === 'available');
  const inUseResources = resources.filter(r => r.availability_status === 'in_use');
  const maintenanceResources = resources.filter(r => r.availability_status === 'under_maintenance');

  const filteredMaintenance = maintenanceResources.filter((resource) => {
    if (!maintenanceSearchTerm.trim()) return true;
    const values = [
      resource.name,
      resource.resource_code,
      resource.location,
      resource.assigned_to_user,
    ];
    return values
      .filter(Boolean)
      .some((value) => (value as string).toLowerCase().includes(maintenanceSearchTerm.toLowerCase()));
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-4xl">🏗️</span>
                Resource Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">Equipment, Vehicles, Facilities & Materials Management</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTypeModal(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Types
              </button>
              <button
                onClick={() => setShowResourceModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Resource
              </button>
              <button
                onClick={() => setShowRequestModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Request Resource
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{resources.length}</p>
              </div>
              <div className="text-blue-500 text-3xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-700 mt-1">{availableResources.length}</p>
              </div>
              <div className="text-green-500 text-3xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Use</p>
                <p className="text-2xl font-bold text-orange-700 mt-1">{inUseResources.length}</p>
              </div>
              <div className="text-orange-500 text-3xl">🔧</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-700 mt-1">{pendingRequests.length}</p>
              </div>
              <div className="text-yellow-500 text-3xl">⏳</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'inventory'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors relative ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Requests
                {pendingRequests.length > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'maintenance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Maintenance
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'inventory' && (
              <div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {Array.from(new Set(resources.map(r => r.category))).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="in_use">In Use</option>
                    <option value="reserved">Reserved</option>
                    <option value="under_maintenance">Under Maintenance</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <div key={resource.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{getCategoryIcon(resource.category)}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{resource.name}</h3>
                            <p className="text-sm text-gray-500">{resource.resource_code}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{resource.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium">{resource.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{resource.location || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Condition:</span>
                          <span className={`font-medium ${getConditionColor(resource.condition_status)}`}>
                            {resource.condition_status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(resource.availability_status)}`}>
                            {resource.availability_status}
                          </span>
                        </div>
                        {resource.assigned_to_user && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Assigned To:</span>
                            <span className="font-medium">{resource.assigned_to_user}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleEditResource(resource)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        {resource.availability_status === 'available' && (
                          <button
                            onClick={() => setShowRequestModal(true)}
                            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                          >
                            Request
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredResources.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-4xl mb-2">🔍</p>
                    <p>No resources found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <h2 className="text-xl font-semibold">Resource Requests</h2>
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={requestSearchTerm}
                    onChange={(e) => setRequestSearchTerm(e.target.value)}
                    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{request.resource_name || 'New Resource Request'}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {(request.request_type || 'request')
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-700 mb-2">{request.purpose}</p>
                          {request.has_conflict && request.conflict_details && (
                            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-2">
                              Conflict with {request.conflict_details.request_number} ({new Date(request.conflict_details.start_date).toLocaleDateString()} - {new Date(request.conflict_details.end_date).toLocaleDateString()})
                            </div>
                          )}
                          {request.status === 'pending' && request.queue_position && request.queue_position > 1 && (
                            <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 mb-2">
                              Queue position: {request.queue_position}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{request.request_number}</span>
                            <span>•</span>
                            <span>Requested by: {request.requester_name}</span>
                            {request.start_date && (
                              <>
                                <span>•</span>
                                <span>{new Date(request.start_date).toLocaleDateString()}</span>
                              </>
                            )}
                            {request.end_date && (
                              <>
                                <span>•</span>
                                <span>{new Date(request.end_date).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                          {request.program_module_name && (
                            <div className="text-xs text-gray-500 mt-1">
                              Program: {request.program_module_name}
                            </div>
                          )}
                          {request.resource_status && (
                            <div className="text-xs text-gray-500 mt-1">
                              Resource status: {request.resource_status}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">Qty: {request.quantity_requested}</p>
                          {request.status === 'pending' && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {request.status === 'approved' && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleAllocateRequest(request.id)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                              >
                                Allocate
                              </button>
                            </div>
                          )}
                          {['allocated', 'in_use', 'returned'].includes(request.status) && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleReturnRequest(request.id)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm"
                              >
                                Confirm Return
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => toggleComments(request.id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {expandedComments[request.id] ? 'Hide Comments' : 'View Comments'}
                        </button>
                      </div>
                      {expandedComments[request.id] && (
                        <div className="mt-3 border rounded-lg p-3 bg-gray-50">
                          <div className="space-y-2">
                            {(commentThreads[request.id] || []).map((comment) => (
                              <div key={comment.id} className="text-sm text-gray-700 bg-white rounded-md p-2 border">
                                <div className="text-xs text-gray-500 mb-1">
                                  {comment.created_by_name || 'User'} • {new Date(comment.created_at).toLocaleString()}
                                </div>
                                <div>{comment.comment_text}</div>
                              </div>
                            ))}
                            {(commentThreads[request.id] || []).length === 0 && (
                              <div className="text-sm text-gray-500">No comments yet.</div>
                            )}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <input
                              type="text"
                              value={commentDrafts[request.id] || ''}
                              onChange={(e) =>
                                setCommentDrafts((prev) => ({
                                  ...prev,
                                  [request.id]: e.target.value
                                }))
                              }
                              placeholder="Write a comment..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <button
                              onClick={() => handleAddComment(request.id)}
                              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredRequests.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-4xl mb-2">📋</p>
                      <p>No resource requests found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <h2 className="text-xl font-semibold">Maintenance Schedule</h2>
                  <input
                    type="text"
                    placeholder="Search maintenance..."
                    value={maintenanceSearchTerm}
                    onChange={(e) => setMaintenanceSearchTerm(e.target.value)}
                    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-4">
                  {filteredMaintenance.map((resource) => (
                    <div key={resource.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getCategoryIcon(resource.category)}</span>
                          <div>
                            <h3 className="font-semibold">{resource.name}</h3>
                            <p className="text-sm text-gray-500">{resource.resource_code}</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                          View History
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredMaintenance.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-4xl mb-2">✅</p>
                      <p>No resources under maintenance found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddResourceModal
        isOpen={showResourceModal}
        onClose={() => setShowResourceModal(false)}
        onSuccess={fetchResourceData}
      />
      <AddResourceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={fetchResourceData}
      />
      <EditResourceModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSuccess={fetchResourceData}
        resource={editingResource}
      />
      <ResourceTypeModal
        isOpen={showTypeModal}
        onClose={() => setShowTypeModal(false)}
        onSuccess={fetchResourceData}
      />
    </div>
  );
};

export default ResourceManagement;
