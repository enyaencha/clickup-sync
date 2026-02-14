import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';
import LocationSelector from './LocationSelector';
import { formatNumberInput, parseNumberInput } from '../utils/numberInput';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentId: number;
  onSuccess: () => void;
}

const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
  componentId,
  onSuccess,
}) => {
  // Basic form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location_details: '',
    location_id: null as number | null,
    parish: '',
    ward: '',
    county: '',
    activity_date: '',
    start_date: '',
    end_date: '',
    duration_hours: '',
    facilitators: '',
    staff_assigned: '',
    target_beneficiaries: '',
    beneficiary_type: '',
    budget_allocated: '',
    status: 'not-started',
    approval_status: 'draft',
    priority: 'normal',
  });

  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  // Module-specific data for Finance (module_id = 6)
  const [financeData, setFinanceData] = useState({
    transaction_type: 'expense',
    expense_category: 'program',
    payment_method: 'bank_transfer',
    budget_line: '',
    vendor_payee: '',
    invoice_number: '',
    receipt_number: '',
    approval_level: 'department',
    expected_amount: '',
  });

  // Module-specific data for Resource Management (module_id = 5)
  const [resourceData, setResourceData] = useState({
    activity_type: 'resource_allocation',
    resource_category: 'equipment',
    resource_id: '',
    quantity_needed: '1',
    duration_of_use: '',
    maintenance_type: '',
    training_topic: '',
    participants_count: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<number | null>(null);
  const [moduleName, setModuleName] = useState<string>('');
  const [loadingModule, setLoadingModule] = useState(true);

  // Fetch module info when modal opens
  useEffect(() => {
    if (isOpen && componentId) {
      fetchModuleInfo();
    }
  }, [isOpen, componentId]);

  const fetchModuleInfo = async () => {
    try {
      setLoadingModule(true);
      setError(null);

      // Fetch module info using the new endpoint
      const response = await authFetch(`/api/components/${componentId}/module`);

      if (!response.ok) {
        throw new Error('Failed to fetch module information');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setModuleId(data.data.module_id);
        setModuleName(data.data.module_name);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error fetching module info:', err);
      setError('Could not determine module type. Using standard form.');
      // Set defaults so form still works
      setModuleId(null);
      setModuleName('');
    } finally {
      setLoadingModule(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinanceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFinanceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResourceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setResourceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Build module-specific data object
      let moduleSpecificData = null;
      if (moduleId === 6) {
        // Finance Module
        moduleSpecificData = {
          ...financeData,
          expected_amount: parseNumberInput(financeData.expected_amount)
        };
      } else if (moduleId === 5) {
        // Resource Management Module
        moduleSpecificData = resourceData;
      }

      const statusAliases: Record<string, string> = {
        planned: 'not-started',
        ongoing: 'in-progress',
        in_progress: 'in-progress',
      };
      const normalizedStatus = statusAliases[formData.status] || formData.status;

      const payload = {
        component_id: componentId,
        code: `ACT-${Date.now()}`, // Generate unique code
        name: formData.name,
        description: formData.description,
        location_details: formData.location_details || null,
        parish: formData.parish || null,
        ward: formData.ward || null,
        county: formData.county || null,
        activity_date: formData.activity_date || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        duration_hours: formData.duration_hours ? parseFloat(formData.duration_hours) : null,
        facilitators: formData.facilitators || null,
        staff_assigned: formData.staff_assigned || null,
        target_beneficiaries: formData.target_beneficiaries
          ? parseInt(formData.target_beneficiaries)
          : null,
        beneficiary_type: formData.beneficiary_type || null,
        budget_allocated: parseNumberInput(formData.budget_allocated),
        status: normalizedStatus,
        approval_status: formData.approval_status,
        priority: formData.priority,
        module_specific_data: moduleSpecificData ? JSON.stringify(moduleSpecificData) : null,
        created_by: null, // Backend will set this from auth
      };

      const response = await authFetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create activity');
      }

      // Reset form and close
      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location_details: '',
      location_id: null,
      parish: '',
      ward: '',
      county: '',
      activity_date: '',
      start_date: '',
      end_date: '',
      duration_hours: '',
      facilitators: '',
      staff_assigned: '',
      target_beneficiaries: '',
      beneficiary_type: '',
      budget_allocated: '',
      status: 'not-started',
      approval_status: 'draft',
      priority: 'normal',
    });
    setSelectedLocation(null);
    setFinanceData({
      transaction_type: 'expense',
      expense_category: 'program',
      payment_method: 'bank_transfer',
      budget_line: '',
      vendor_payee: '',
      invoice_number: '',
      receipt_number: '',
      approval_level: 'department',
      expected_amount: '',
    });
    setResourceData({
      activity_type: 'resource_allocation',
      resource_category: 'equipment',
      resource_id: '',
      quantity_needed: '1',
      duration_of_use: '',
      maintenance_type: '',
      training_topic: '',
      participants_count: '',
    });
  };

  if (!isOpen) return null;

  // Determine if this is a Finance or Resource module
  const isFinanceModule = moduleId === 6;
  const isResourceModule = moduleId === 5;
  const isStandardModule = !isFinanceModule && !isResourceModule;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {loadingModule ? (
              'Add New Activity'
            ) : (
              <>
                {isFinanceModule && <span className="text-2xl">💰</span>}
                {isResourceModule && <span className="text-2xl">🏗️</span>}
                {isStandardModule && <span className="text-2xl">✓</span>}
                Add New {moduleName} Activity
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {loadingModule ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading module information...</p>
            </div>
          ) : (
            <>
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <span>📋</span>
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      isFinanceModule
                        ? 'e.g., Budget Allocation Request'
                        : isResourceModule
                        ? 'e.g., Vehicle Maintenance or Training Session'
                        : 'e.g., Community Health Training'
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the activity..."
                  />
                </div>
              </div>

              {/* ===== FINANCE MODULE SPECIFIC FIELDS ===== */}
              {isFinanceModule && (
                <div className="space-y-4 bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-green-300 pb-2 flex items-center gap-2">
                    <span>💰</span>
                    Finance Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Type
                      </label>
                      <select
                        name="transaction_type"
                        value={financeData.transaction_type}
                        onChange={handleFinanceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="expense">Expense</option>
                        <option value="reimbursement">Reimbursement</option>
                        <option value="advance">Advance Payment</option>
                        <option value="refund">Refund</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expense Category
                      </label>
                      <select
                        name="expense_category"
                        value={financeData.expense_category}
                        onChange={handleFinanceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="operational">Operational</option>
                        <option value="program">Program</option>
                        <option value="capital">Capital</option>
                        <option value="administrative">Administrative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <select
                        name="payment_method"
                        value={financeData.payment_method}
                        onChange={handleFinanceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="cash">Cash</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="check">Check</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Approval Level Required
                      </label>
                      <select
                        name="approval_level"
                        value={financeData.approval_level}
                        onChange={handleFinanceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="department">Department Head</option>
                        <option value="director">Director</option>
                        <option value="board">Board Approval</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget Line/Code
                      </label>
                      <input
                        type="text"
                        name="budget_line"
                        value={financeData.budget_line}
                        onChange={handleFinanceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., BL-2025-001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Amount ($)
                      </label>
                      <input
                        type="text"
                        name="expected_amount"
                        value={financeData.expected_amount}
                        onChange={(e) => setFinanceData({ ...financeData, expected_amount: formatNumberInput(e.target.value) })}
                        inputMode="decimal"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vendor/Payee Name
                      </label>
                      <input
                        type="text"
                        name="vendor_payee"
                        value={financeData.vendor_payee}
                        onChange={handleFinanceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Name of vendor or payee"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Invoice Number
                      </label>
                      <input
                        type="text"
                        name="invoice_number"
                        value={financeData.invoice_number}
                        onChange={handleFinanceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="INV-XXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Receipt Number
                      </label>
                      <input
                        type="text"
                        name="receipt_number"
                        value={financeData.receipt_number}
                        onChange={handleFinanceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="RCP-XXXXX"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ===== RESOURCE MANAGEMENT MODULE SPECIFIC FIELDS ===== */}
              {isResourceModule && (
                <div className="space-y-4 bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-blue-300 pb-2 flex items-center gap-2">
                    <span>🏗️</span>
                    Resource Management Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Activity Type
                      </label>
                      <select
                        name="activity_type"
                        value={resourceData.activity_type}
                        onChange={handleResourceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="resource_allocation">Resource Allocation</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="capacity_building">Capacity Building / Training</option>
                        <option value="equipment_request">Equipment Request</option>
                        <option value="facility_booking">Facility Booking</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resource Category
                      </label>
                      <select
                        name="resource_category"
                        value={resourceData.resource_category}
                        onChange={handleResourceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="equipment">Equipment</option>
                        <option value="vehicle">Vehicle</option>
                        <option value="facility">Facility</option>
                        <option value="tools">Tools</option>
                        <option value="materials">Materials</option>
                      </select>
                    </div>

                    {resourceData.activity_type === 'maintenance' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Maintenance Type
                        </label>
                        <select
                          name="maintenance_type"
                          value={resourceData.maintenance_type}
                          onChange={handleResourceChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select type...</option>
                          <option value="preventive">Preventive</option>
                          <option value="corrective">Corrective</option>
                          <option value="emergency">Emergency</option>
                        </select>
                      </div>
                    )}

                    {resourceData.activity_type === 'capacity_building' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Training Topic
                          </label>
                          <input
                            type="text"
                            name="training_topic"
                            value={resourceData.training_topic}
                            onChange={handleResourceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Financial Literacy"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expected Participants
                          </label>
                          <input
                            type="number"
                            name="participants_count"
                            value={resourceData.participants_count}
                            onChange={handleResourceChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity Needed
                      </label>
                      <input
                        type="number"
                        name="quantity_needed"
                        value={resourceData.quantity_needed}
                        onChange={handleResourceChange}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration of Use (days)
                      </label>
                      <input
                        type="number"
                        name="duration_of_use"
                        value={resourceData.duration_of_use}
                        onChange={handleResourceChange}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Number of days"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Standard Fields (shown for all modules) */}
              {!isFinanceModule && (
                <>
                  {/* Location Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                      <span>📍</span>
                      Location
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location Details
                      </label>
                      <input
                        type="text"
                        name="location_details"
                        value={formData.location_details}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Community Center, Main Road"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location (Hierarchical Selector)
                      </label>
                      <LocationSelector
                        value={formData.location_id}
                        onChange={(locationId, location) => {
                          setFormData(prev => ({
                            ...prev,
                            location_id: locationId,
                            // Keep old fields for backward compatibility
                            parish: location?.type === 'parish' ? location.name : '',
                            ward: location?.type === 'ward' ? location.name : (location?.parent_name || ''),
                            county: location?.county_name || ''
                          }));
                          setSelectedLocation(location);
                        }}
                        maxLevel="ward"
                      />
                      {selectedLocation && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Selected:</span> {selectedLocation.name} ({selectedLocation.type})
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Dates and Duration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <span>📅</span>
                  Schedule
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Date
                    </label>
                    <input
                      type="date"
                      name="activity_date"
                      value={formData.activity_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {!isFinanceModule && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (Hours)
                    </label>
                    <input
                      type="number"
                      name="duration_hours"
                      value={formData.duration_hours}
                      onChange={handleChange}
                      min="0"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 2.5"
                    />
                  </div>
                )}
              </div>

              {/* Staff and Beneficiaries (skip for Finance module) */}
              {!isFinanceModule && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <span>👥</span>
                    Staff & Beneficiaries
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Facilitators
                      </label>
                      <input
                        type="text"
                        name="facilitators"
                        value={formData.facilitators}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Comma-separated names"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Staff Assigned
                      </label>
                      <input
                        type="text"
                        name="staff_assigned"
                        value={formData.staff_assigned}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Comma-separated names"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Beneficiaries
                      </label>
                      <input
                        type="number"
                        name="target_beneficiaries"
                        value={formData.target_beneficiaries}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Beneficiary Type
                      </label>
                      <input
                        type="text"
                        name="beneficiary_type"
                        value={formData.beneficiary_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Women, Children, Youth"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Budget and Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <span>⚙️</span>
                  Budget & Status
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Allocated ($)
                  </label>
                  <input
                    type="text"
                    name="budget_allocated"
                    value={formData.budget_allocated}
                    onChange={(e) => setFormData({ ...formData, budget_allocated: formatNumberInput(e.target.value) })}
                    inputMode="decimal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Approval Status
                    </label>
                    <select
                      name="approval_status"
                      value={formData.approval_status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || loadingModule}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivityModal;
