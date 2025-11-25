import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Assumption {
  id: number;
  assumption_text: string;
  assumption_category: string;
  likelihood: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  impact: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  status: 'valid' | 'invalid' | 'partially-valid' | 'needs-review';
  mitigation_strategy: string;
  mitigation_status: 'not-started' | 'in-progress' | 'implemented' | 'not-needed';
  responsible_person: string;
  entity_name?: string;
}

interface AssumptionFormData {
  assumption_text: string;
  assumption_category: string;
  likelihood: string;
  impact: string;
  mitigation_strategy: string;
  responsible_person: string;
  entity_type: string;
  entity_id: number;
}

const AssumptionsManagement: React.FC = () => {
  const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();

  const [assumptions, setAssumptions] = useState<Assumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAssumption, setEditingAssumption] = useState<Assumption | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const [formData, setFormData] = useState<AssumptionFormData>({
    assumption_text: '',
    assumption_category: 'external',
    likelihood: 'medium',
    impact: 'medium',
    mitigation_strategy: '',
    responsible_person: '',
    entity_type: entityType || 'module',
    entity_id: parseInt(entityId || '0')
  });

  useEffect(() => {
    fetchAssumptions();
  }, [entityType, entityId, filterRisk]);

  const fetchAssumptions = async () => {
    try {
      setLoading(true);
      let url = entityType && entityId
        ? `/api/assumptions/entity/${entityType}/${entityId}`
        : '/api/assumptions';

      if (filterRisk !== 'all') {
        url = `/api/assumptions/risk-level/${filterRisk}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch assumptions');

      const data = await response.json();
      setAssumptions(data.data || []);
    } catch (err) {
      console.error('Error fetching assumptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        [`${formData.entity_type}_id`]: formData.entity_id
      };

      const url = editingAssumption
        ? `/api/assumptions/${editingAssumption.id}`
        : '/api/assumptions';

      const method = editingAssumption ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save assumption');

      await fetchAssumptions();
      resetForm();
    } catch (err) {
      console.error('Error saving assumption:', err);
      alert('Failed to save assumption');
    }
  };

  const handleValidate = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/assumptions/${id}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, validation_notes: '' })
      });

      if (!response.ok) throw new Error('Failed to validate assumption');

      await fetchAssumptions();
    } catch (err) {
      console.error('Error validating assumption:', err);
      alert('Failed to validate assumption');
    }
  };

  const handleUpdateMitigation = async (id: number, mitigationStatus: string) => {
    try {
      const response = await fetch(`/api/assumptions/${id}/mitigation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mitigation_status: mitigationStatus })
      });

      if (!response.ok) throw new Error('Failed to update mitigation');

      await fetchAssumptions();
    } catch (err) {
      console.error('Error updating mitigation:', err);
      alert('Failed to update mitigation status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this assumption?')) return;

    try {
      const response = await fetch(`/api/assumptions/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete assumption');

      await fetchAssumptions();
    } catch (err) {
      console.error('Error deleting assumption:', err);
      alert('Failed to delete assumption');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingAssumption(null);
    setFormData({
      assumption_text: '',
      assumption_category: 'external',
      likelihood: 'medium',
      impact: 'medium',
      mitigation_strategy: '',
      responsible_person: '',
      entity_type: entityType || 'module',
      entity_id: parseInt(entityId || '0')
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-400 text-gray-900';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'invalid': return 'bg-red-100 text-red-800';
      case 'partially-valid': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assumptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assumptions & Risk Management</h1>
              <p className="text-gray-600 mt-1">Track assumptions and manage risks for your program</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <span>+</span> Add Assumption
            </button>
          </div>

          {/* Risk Level Filter */}
          <div className="flex gap-4">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Assumption Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingAssumption ? 'Edit Assumption' : 'Add New Assumption'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assumption Text *
                    </label>
                    <textarea
                      required
                      value={formData.assumption_text}
                      onChange={(e) => setFormData({ ...formData, assumption_text: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={3}
                      placeholder="Describe the assumption..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.assumption_category}
                      onChange={(e) => setFormData({ ...formData, assumption_category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="external">External</option>
                      <option value="internal">Internal</option>
                      <option value="financial">Financial</option>
                      <option value="political">Political</option>
                      <option value="social">Social</option>
                      <option value="environmental">Environmental</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Likelihood *
                      </label>
                      <select
                        value={formData.likelihood}
                        onChange={(e) => setFormData({ ...formData, likelihood: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="very-low">Very Low</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="very-high">Very High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Impact *
                      </label>
                      <select
                        value={formData.impact}
                        onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="very-low">Very Low</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="very-high">Very High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mitigation Strategy
                    </label>
                    <textarea
                      value={formData.mitigation_strategy}
                      onChange={(e) => setFormData({ ...formData, mitigation_strategy: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={3}
                      placeholder="Describe the mitigation strategy..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsible Person
                    </label>
                    <input
                      type="text"
                      value={formData.responsible_person}
                      onChange={(e) => setFormData({ ...formData, responsible_person: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {editingAssumption ? 'Update' : 'Create'} Assumption
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Assumptions List */}
        <div className="grid gap-4">
          {assumptions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No assumptions found</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add Assumption" to create your first assumption</p>
            </div>
          ) : (
            assumptions.map((assumption) => (
              <div key={assumption.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getRiskColor(assumption.risk_level)}`}>
                      {assumption.risk_level.toUpperCase()} RISK
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(assumption.status)}`}>
                      {assumption.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {assumption.assumption_category.toUpperCase()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(assumption.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-gray-900 font-medium mb-3">{assumption.assumption_text}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-xs text-gray-500">Likelihood</p>
                    <p className="font-medium capitalize">{assumption.likelihood.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Impact</p>
                    <p className="font-medium capitalize">{assumption.impact.replace('-', ' ')}</p>
                  </div>
                </div>

                {assumption.mitigation_strategy && (
                  <div className="mb-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm font-medium text-blue-900 mb-1">Mitigation Strategy</p>
                    <p className="text-sm text-gray-700">{assumption.mitigation_strategy}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <select
                      value={assumption.status}
                      onChange={(e) => handleValidate(assumption.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="needs-review">Needs Review</option>
                      <option value="valid">Valid</option>
                      <option value="partially-valid">Partially Valid</option>
                      <option value="invalid">Invalid</option>
                    </select>

                    <select
                      value={assumption.mitigation_status}
                      onChange={(e) => handleUpdateMitigation(assumption.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="implemented">Implemented</option>
                      <option value="not-needed">Not Needed</option>
                    </select>
                  </div>

                  {assumption.responsible_person && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Responsible:</span> {assumption.responsible_person}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AssumptionsManagement;
