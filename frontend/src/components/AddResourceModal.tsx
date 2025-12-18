import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ResourceType {
  id: number;
  name: string;
  category: string;
}

const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);

  const [formData, setFormData] = useState({
    resource_type_id: '',
    name: '',
    description: '',
    category: 'equipment',
    acquisition_date: '',
    acquisition_cost: '',
    acquisition_method: 'purchase',
    supplier: '',
    serial_number: '',
    model: '',
    manufacturer: '',
    quantity: '1',
    unit_of_measure: 'units',
    location: '',
    current_location: '',
    condition_status: 'good',
    availability_status: 'available',
    current_value: ''
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
      const response = await authFetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          resource_type_id: formData.resource_type_id ? parseInt(formData.resource_type_id) : null,
          acquisition_cost: formData.acquisition_cost ? parseFloat(formData.acquisition_cost) : null,
          quantity: parseInt(formData.quantity) || 1,
          current_value: formData.current_value ? parseFloat(formData.current_value) : null,
        })
      });

      if (response.ok) {
        onSuccess();
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Failed to create resource: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create resource:', error);
      alert('Failed to create resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      resource_type_id: '',
      name: '',
      description: '',
      category: 'equipment',
      acquisition_date: '',
      acquisition_cost: '',
      acquisition_method: 'purchase',
      supplier: '',
      serial_number: '',
      model: '',
      manufacturer: '',
      quantity: '1',
      unit_of_measure: 'units',
      location: '',
      current_location: '',
      condition_status: 'good',
      availability_status: 'available',
      current_value: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Add New Resource</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type
              </label>
              <select
                name="resource_type_id"
                value={formData.resource_type_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type (Optional)</option>
                {resourceTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="equipment">Equipment</option>
                <option value="vehicle">Vehicle</option>
                <option value="furniture">Furniture</option>
                <option value="technology">Technology</option>
                <option value="supplies">Supplies</option>
                <option value="tools">Tools</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Acquisition Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acquisition Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acquisition Date
                </label>
                <input
                  type="date"
                  name="acquisition_date"
                  value={formData.acquisition_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acquisition Cost (KES)
                </label>
                <input
                  type="number"
                  name="acquisition_cost"
                  value={formData.acquisition_cost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acquisition Method
                </label>
                <select
                  name="acquisition_method"
                  value={formData.acquisition_method}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="purchase">Purchase</option>
                  <option value="donation">Donation</option>
                  <option value="lease">Lease</option>
                  <option value="grant">Grant</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Quantity & Location */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit of Measure
                </label>
                <select
                  name="unit_of_measure"
                  value={formData.unit_of_measure}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="units">Units</option>
                  <option value="pieces">Pieces</option>
                  <option value="boxes">Boxes</option>
                  <option value="sets">Sets</option>
                  <option value="kg">Kilograms</option>
                  <option value="liters">Liters</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Main Office, Warehouse A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location
                </label>
                <input
                  type="text"
                  name="current_location"
                  value={formData.current_location}
                  onChange={handleChange}
                  placeholder="If different from storage"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Status & Valuation */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Valuation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  name="condition_status"
                  value={formData.condition_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="needs_repair">Needs Repair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  name="availability_status"
                  value={formData.availability_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="in_use">In Use</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Value (KES)
                </label>
                <input
                  type="number"
                  name="current_value"
                  value={formData.current_value}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
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
              {loading ? 'Adding...' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;
