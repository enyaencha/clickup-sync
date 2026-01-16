import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { formatNumberInput, parseNumberInput } from '../utils/numberInput';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ProgramModule {
  id: number;
  name: string;
}

interface SubProgram {
  id: number;
  name: string;
  module_id: number;
}

const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [programModules, setProgramModules] = useState<ProgramModule[]>([]);
  const [subPrograms, setSubPrograms] = useState<SubProgram[]>([]);
  const [filteredSubPrograms, setFilteredSubPrograms] = useState<SubProgram[]>([]);

  const [formData, setFormData] = useState({
    program_module_id: '',
    sub_program_id: '',
    fiscal_year: new Date().getFullYear().toString(),
    total_budget: '',
    operational_budget: '',
    program_budget: '',
    capital_budget: '',
    donor: '',
    funding_source: '',
    grant_number: '',
    budget_start_date: '',
    budget_end_date: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchProgramModules();
      fetchSubPrograms();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.program_module_id) {
      const filtered = subPrograms.filter(
        sp => sp.module_id.toString() === formData.program_module_id
      );
      setFilteredSubPrograms(filtered);
    } else {
      setFilteredSubPrograms([]);
    }
  }, [formData.program_module_id, subPrograms]);

  const fetchProgramModules = async () => {
    try {
      const response = await authFetch('/api/programs');
      if (response.ok) {
        const data = await response.json();
        setProgramModules(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch program modules:', error);
    }
  };

  const fetchSubPrograms = async () => {
    try {
      const response = await authFetch('/api/sub-programs');
      if (response.ok) {
        const data = await response.json();
        setSubPrograms(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch sub programs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authFetch('/api/finance/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          program_module_id: parseInt(formData.program_module_id),
          sub_program_id: formData.sub_program_id ? parseInt(formData.sub_program_id) : null,
          total_budget: parseNumberInput(formData.total_budget) ?? 0,
          operational_budget: parseNumberInput(formData.operational_budget),
          program_budget: parseNumberInput(formData.program_budget),
          capital_budget: parseNumberInput(formData.capital_budget),
        })
      });

      if (response.ok) {
        onSuccess();
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Failed to create budget: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create budget:', error);
      alert('Failed to create budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      program_module_id: '',
      sub_program_id: '',
      fiscal_year: new Date().getFullYear().toString(),
      total_budget: '',
      operational_budget: '',
      program_budget: '',
      capital_budget: '',
      donor: '',
      funding_source: '',
      grant_number: '',
      budget_start_date: '',
      budget_end_date: '',
      notes: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Create New Budget</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Program Module & Sub-Program */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Program
              </label>
              <select
                name="sub_program_id"
                value={formData.sub_program_id}
                onChange={handleChange}
                disabled={!formData.program_module_id}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Sub-Program (Optional)</option>
                {filteredSubPrograms.map(sp => (
                  <option key={sp.id} value={sp.id}>{sp.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fiscal Year & Budget Period */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiscal Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="fiscal_year"
                value={formData.fiscal_year}
                onChange={handleChange}
                required
                min="2000"
                max="2100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="budget_start_date"
                value={formData.budget_start_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="budget_end_date"
                value={formData.budget_end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Budget Amounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Budget (KES) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="total_budget"
                value={formData.total_budget}
                onChange={(e) => setFormData({ ...formData, total_budget: formatNumberInput(e.target.value) })}
                required
                inputMode="decimal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operational Budget (KES)
              </label>
              <input
                type="text"
                name="operational_budget"
                value={formData.operational_budget}
                onChange={(e) => setFormData({ ...formData, operational_budget: formatNumberInput(e.target.value) })}
                inputMode="decimal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Budget (KES)
              </label>
              <input
                type="text"
                name="program_budget"
                value={formData.program_budget}
                onChange={(e) => setFormData({ ...formData, program_budget: formatNumberInput(e.target.value) })}
                inputMode="decimal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capital Budget (KES)
              </label>
              <input
                type="text"
                name="capital_budget"
                value={formData.capital_budget}
                onChange={(e) => setFormData({ ...formData, capital_budget: formatNumberInput(e.target.value) })}
                inputMode="decimal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Funding Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donor
              </label>
              <input
                type="text"
                name="donor"
                value={formData.donor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Source
              </label>
              <input
                type="text"
                name="funding_source"
                value={formData.funding_source}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grant Number
              </label>
              <input
                type="text"
                name="grant_number"
                value={formData.grant_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {loading ? 'Creating...' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;
