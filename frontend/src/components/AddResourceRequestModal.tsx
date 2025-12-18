import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

interface AddResourceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Resource {
  id: number;
  name: string;
  resource_code: string;
  category: string;
  availability_status: string;
}

interface ProgramModule {
  id: number;
  name: string;
}

const AddResourceRequestModal: React.FC<AddResourceRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [programModules, setProgramModules] = useState<ProgramModule[]>([]);

  const [formData, setFormData] = useState({
    resource_id: '',
    program_module_id: '',
    request_type: 'allocation',
    quantity_requested: '1',
    purpose: '',
    start_date: '',
    end_date: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (isOpen) {
      fetchResources();
      fetchProgramModules();
    }
  }, [isOpen]);

  const fetchResources = async () => {
    try {
      const response = await authFetch('/api/resources?availability_status=available');
      if (response.ok) {
        const data = await response.json();
        setResources(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
  };

  const fetchProgramModules = async () => {
    try {
      const response = await authFetch('/api/modules');
      if (response.ok) {
        const data = await response.json();
        setProgramModules(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch program modules:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authFetch('/api/resources/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          resource_id: formData.resource_id ? parseInt(formData.resource_id) : null,
          program_module_id: formData.program_module_id ? parseInt(formData.program_module_id) : null,
          quantity_requested: parseInt(formData.quantity_requested) || 1,
        })
      });

      if (response.ok) {
        onSuccess();
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Failed to create resource request: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create resource request:', error);
      alert('Failed to create resource request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      resource_id: '',
      program_module_id: '',
      request_type: 'allocation',
      quantity_requested: '1',
      purpose: '',
      start_date: '',
      end_date: '',
      priority: 'medium'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Create Resource Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Type <span className="text-red-500">*</span>
            </label>
            <select
              name="request_type"
              value={formData.request_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="allocation">Resource Allocation</option>
              <option value="procurement">New Procurement</option>
              <option value="maintenance">Maintenance Request</option>
              <option value="replacement">Replacement</option>
              <option value="disposal">Disposal Request</option>
            </select>
          </div>

          {/* Resource Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource {formData.request_type === 'allocation' && <span className="text-red-500">*</span>}
              </label>
              <select
                name="resource_id"
                value={formData.resource_id}
                onChange={handleChange}
                required={formData.request_type === 'allocation'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {formData.request_type === 'procurement' ? 'N/A - New Procurement' : 'Select Resource'}
                </option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} ({resource.resource_code})
                  </option>
                ))}
              </select>
              {formData.request_type === 'procurement' && (
                <p className="mt-1 text-xs text-gray-500">Leave blank for new procurement requests</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Module <span className="text-red-500">*</span>
              </label>
              <select
                name="program_module_id"
                value={formData.program_module_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Program Module</option>
                {programModules.map(pm => (
                  <option key={pm.id} value={pm.id}>{pm.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity Requested <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity_requested"
                value={formData.quantity_requested}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date {formData.request_type === 'allocation' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required={formData.request_type === 'allocation'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.request_type === 'allocation' && (
                <p className="mt-1 text-xs text-gray-500">When you need the resource</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date {formData.request_type === 'allocation' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required={formData.request_type === 'allocation'}
                min={formData.start_date}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.request_type === 'allocation' && (
                <p className="mt-1 text-xs text-gray-500">When you'll return it</p>
              )}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose / Justification <span className="text-red-500">*</span>
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Explain why you need this resource and how it will be used..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Help Text Based on Request Type */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              {formData.request_type === 'allocation' && (
                <>
                  <strong>Allocation Request:</strong> Request to use an existing resource for a specific period.
                  Select a resource and specify when you need it.
                </>
              )}
              {formData.request_type === 'procurement' && (
                <>
                  <strong>Procurement Request:</strong> Request to acquire a new resource.
                  Describe what you need in the purpose field. No need to select an existing resource.
                </>
              )}
              {formData.request_type === 'maintenance' && (
                <>
                  <strong>Maintenance Request:</strong> Report an issue or request maintenance for a resource.
                  Select the resource and describe the issue.
                </>
              )}
              {formData.request_type === 'replacement' && (
                <>
                  <strong>Replacement Request:</strong> Request to replace a damaged or obsolete resource.
                  Select the resource to be replaced and explain why.
                </>
              )}
              {formData.request_type === 'disposal' && (
                <>
                  <strong>Disposal Request:</strong> Request to dispose of a resource that's no longer needed.
                  Select the resource and provide justification.
                </>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceRequestModal;
