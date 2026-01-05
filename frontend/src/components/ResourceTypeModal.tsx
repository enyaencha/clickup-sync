import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

interface ResourceType {
  id: number;
  name: string;
  category: string;
  description?: string;
}

interface ResourceTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ResourceTypeModal: React.FC<ResourceTypeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchResourceTypes();
    }
  }, [isOpen]);

  const fetchResourceTypes = async () => {
    try {
      const response = await authFetch('/api/resources/types');
      if (response.ok) {
        const data = await response.json();
        setResourceTypes(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch resource types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId
        ? `/api/resources/types/${editingId}`
        : '/api/resources/types';

      const method = editingId ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save resource type');
      }

      setFormData({ name: '', category: '', description: '' });
      setEditingId(null);
      fetchResourceTypes();
      onSuccess();
    } catch (error) {
      console.error('Error saving resource type:', error);
      alert('Failed to save resource type');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type: ResourceType) => {
    setEditingId(type.id);
    setFormData({
      name: type.name,
      category: type.category,
      description: type.description || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', description: '' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this resource type?')) {
      return;
    }

    try {
      const response = await authFetch(`/api/resources/types/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchResourceTypes();
        onSuccess();
      }
    } catch (error) {
      console.error('Error deleting resource type:', error);
      alert('Failed to delete resource type');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Resource Types</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {editingId ? 'Edit Resource Type' : 'Add New Resource Type'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Toyota Land Cruiser"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="equipment">Equipment</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="facility">Facility</option>
                    <option value="material">Material</option>
                    <option value="technology">Technology</option>
                    <option value="human_resource">Human Resource</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List of Resource Types */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Existing Resource Types</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {resourceTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{type.name}</h4>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {type.category}
                      </span>
                    </div>
                    {type.description && (
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(type)}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {resourceTypes.length === 0 && (
                <p className="text-center text-gray-500 py-8">No resource types yet. Add one above!</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceTypeModal;
