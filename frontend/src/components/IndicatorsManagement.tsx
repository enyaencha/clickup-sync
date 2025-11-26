import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Indicator {
  id: number;
  name: string;
  code: string;
  description: string;
  type: 'impact' | 'outcome' | 'output' | 'process';
  category: string;
  unit_of_measure: string;
  baseline_value: number;
  baseline_date: string;
  target_value: number;
  target_date: string;
  current_value: number;
  achievement_percentage: number;
  status: 'on-track' | 'at-risk' | 'off-track' | 'not-started';
  responsible_person: string;
  collection_frequency: string;
  data_source?: string;
  verification_method?: string;
  entity_name?: string;
  module_id?: number;
  sub_program_id?: number;
  component_id?: number;
  activity_id?: number;
}

interface Entity {
  id: number;
  name: string;
}

type EntityType = 'module' | 'sub_program' | 'component' | 'activity';

const IndicatorsManagement: React.FC = () => {
  const { entityType: urlEntityType, entityId: urlEntityId } = useParams<{ entityType: string; entityId: string }>();

  // Tab state
  const [activeTab, setActiveTab] = useState<EntityType>(urlEntityType as EntityType || 'module');
  const [selectedEntity, setSelectedEntity] = useState<number>(parseInt(urlEntityId || '0'));

  // Data state
  const [entities, setEntities] = useState<Entity[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    type: 'output' as 'impact' | 'outcome' | 'output' | 'process',
    category: '',
    unit_of_measure: '',
    baseline_value: 0,
    baseline_date: '',
    target_value: 0,
    target_date: '',
    current_value: 0,
    collection_frequency: 'monthly',
    data_source: '',
    verification_method: '',
    status: 'not-started' as 'on-track' | 'at-risk' | 'off-track' | 'not-started',
    responsible_person: ''
  });

  // Fetch entities when tab changes
  useEffect(() => {
    fetchEntities(activeTab);
  }, [activeTab]);

  // Fetch indicators when entity is selected
  useEffect(() => {
    if (selectedEntity > 0) {
      fetchIndicators();
    } else {
      setIndicators([]);
    }
  }, [selectedEntity, activeTab, filterType, filterStatus]);

  const fetchEntities = async (type: EntityType) => {
    try {
      setLoadingEntities(true);
      let url = '';

      switch (type) {
        case 'module':
          url = '/api/programs';
          break;
        case 'sub_program':
          url = '/api/sub-programs';
          break;
        case 'component':
          url = '/api/components';
          break;
        case 'activity':
          url = '/api/activities';
          break;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch entities');

      const data = await response.json();
      setEntities(data.data || data || []);

      // Auto-select first entity if none selected
      if (data.data && data.data.length > 0 && selectedEntity === 0) {
        setSelectedEntity(data.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching entities:', err);
      setEntities([]);
    } finally {
      setLoadingEntities(false);
    }
  };

  const fetchIndicators = async () => {
    if (selectedEntity === 0) return;

    try {
      setLoading(true);
      let url = `/api/indicators/entity/${activeTab}/${selectedEntity}`;

      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch indicators');

      const data = await response.json();
      setIndicators(data.data || []);
    } catch (err) {
      console.error('Error fetching indicators:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEntity === 0) {
      alert('Please select an entity first');
      return;
    }

    try {
      // Build minimal payload - only send fields with values
      const payload: any = {
        name: formData.name,
        code: formData.code,
        type: formData.type
      };

      // Add optional fields only if they have values
      if (formData.description) payload.description = formData.description;
      if (formData.category) payload.category = formData.category;
      if (formData.unit_of_measure) payload.unit_of_measure = formData.unit_of_measure;
      if (formData.baseline_value) payload.baseline_value = formData.baseline_value;
      if (formData.baseline_date) payload.baseline_date = formData.baseline_date;
      if (formData.target_value) payload.target_value = formData.target_value;
      if (formData.target_date) payload.target_date = formData.target_date;
      if (formData.current_value !== undefined && formData.current_value !== null) payload.current_value = formData.current_value;
      if (formData.collection_frequency) payload.collection_frequency = formData.collection_frequency;
      if (formData.data_source) payload.data_source = formData.data_source;
      if (formData.verification_method) payload.verification_method = formData.verification_method;
      if (formData.status) payload.status = formData.status;
      if (formData.responsible_person) payload.responsible_person = formData.responsible_person;

      // Set the entity ID based on active tab
      if (activeTab === 'module') payload.module_id = selectedEntity;
      if (activeTab === 'sub_program') payload.sub_program_id = selectedEntity;
      if (activeTab === 'component') payload.component_id = selectedEntity;
      if (activeTab === 'activity') payload.activity_id = selectedEntity;

      console.log('Submitting minimal payload:', payload);

      const url = editingIndicator
        ? `/api/indicators/${editingIndicator.id}`
        : '/api/indicators';

      const method = editingIndicator ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to save indicator');
      }

      await fetchIndicators();
      resetForm();
      alert('Indicator saved successfully!');
    } catch (err) {
      console.error('Error saving indicator:', err);
      alert('Failed to save indicator: ' + (err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this indicator?')) return;

    try {
      const response = await fetch(`/api/indicators/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete indicator');

      await fetchIndicators();
      alert('Indicator deleted successfully!');
    } catch (err) {
      console.error('Error deleting indicator:', err);
      alert('Failed to delete indicator');
    }
  };

  const handleEdit = (indicator: Indicator) => {
    setEditingIndicator(indicator);
    setFormData({
      name: indicator.name,
      code: indicator.code,
      description: indicator.description || '',
      type: indicator.type,
      category: indicator.category || '',
      unit_of_measure: indicator.unit_of_measure || '',
      baseline_value: indicator.baseline_value || 0,
      baseline_date: indicator.baseline_date || '',
      target_value: indicator.target_value,
      target_date: indicator.target_date || '',
      current_value: indicator.current_value || 0,
      collection_frequency: indicator.collection_frequency || 'monthly',
      data_source: indicator.data_source || '',
      verification_method: indicator.verification_method || '',
      status: indicator.status || 'not-started',
      responsible_person: indicator.responsible_person || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingIndicator(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      type: 'output',
      category: '',
      unit_of_measure: '',
      baseline_value: 0,
      baseline_date: '',
      target_value: 0,
      target_date: '',
      current_value: 0,
      collection_frequency: 'monthly',
      data_source: '',
      verification_method: '',
      status: 'not-started',
      responsible_person: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'off-track': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'impact': return 'bg-purple-100 text-purple-800';
      case 'outcome': return 'bg-blue-100 text-blue-800';
      case 'output': return 'bg-green-100 text-green-800';
      case 'process': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTabLabel = (type: EntityType) => {
    switch (type) {
      case 'module': return 'Modules';
      case 'sub_program': return 'Sub-Programs';
      case 'component': return 'Components';
      case 'activity': return 'Activities';
    }
  };

  const selectedEntityName = entities.find(e => e.id === selectedEntity)?.name || 'Select an entity';

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Indicators Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Track SMART indicators by entity</p>
        </div>

        {/* Tabs for Entity Types */}
        <div className="bg-white shadow rounded-lg mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex overflow-x-auto">
              {(['module', 'sub_program', 'component', 'activity'] as EntityType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedEntity(0);
                  }}
                  className={`
                    whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                    ${activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {getTabLabel(tab)}
                </button>
              ))}
            </nav>
          </div>

          {/* Entity Selector */}
          <div className="p-4">
            {loadingEntities ? (
              <p className="text-gray-500">Loading {getTabLabel(activeTab).toLowerCase()}...</p>
            ) : entities.length === 0 ? (
              <p className="text-gray-500">No {getTabLabel(activeTab).toLowerCase()} found</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Select {activeTab.replace('_', ' ')}:
                </label>
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(parseInt(e.target.value))}
                  className="w-full sm:w-auto flex-1 border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="0">Select...</option>
                  {entities.map((entity) => (
                    <option key={entity.id} value={entity.id}>
                      {entity.name}
                    </option>
                  ))}
                </select>

                {selectedEntity > 0 && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <span>+</span> Add Indicator
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Entity Info & Filters */}
        {selectedEntity > 0 && (
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedEntityName}</h2>
                <p className="text-sm text-gray-500">Indicators for this {activeTab.replace('_', ' ')}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-auto"
              >
                <option value="all">All Types</option>
                <option value="impact">Impact</option>
                <option value="outcome">Outcome</option>
                <option value="output">Output</option>
                <option value="process">Process</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="off-track">Off Track</option>
                <option value="not-started">Not Started</option>
              </select>
            </div>
          </div>
        )}

        {/* Indicator Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-auto max-h-[85vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  {editingIndicator ? 'Edit Indicator' : 'Add New Indicator'}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  For: <span className="font-semibold">{selectedEntityName}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Indicator Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="impact">Impact</option>
                        <option value="outcome">Outcome</option>
                        <option value="output">Output</option>
                        <option value="process">Process</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Health, Education, Infrastructure"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit of Measure
                      </label>
                      <input
                        type="text"
                        value={formData.unit_of_measure}
                        onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
                        placeholder="e.g., people, households, %, Kg"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="not-started">Not Started</option>
                        <option value="on-track">On Track</option>
                        <option value="at-risk">At Risk</option>
                        <option value="off-track">Off Track</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Baseline Value
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.baseline_value || ''}
                        onChange={(e) => setFormData({ ...formData, baseline_value: e.target.value ? parseFloat(e.target.value) : 0 })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Baseline Date
                      </label>
                      <input
                        type="date"
                        value={formData.baseline_date}
                        onChange={(e) => setFormData({ ...formData, baseline_date: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Value *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.target_value || ''}
                        onChange={(e) => setFormData({ ...formData, target_value: e.target.value ? parseFloat(e.target.value) : 0 })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Date
                      </label>
                      <input
                        type="date"
                        value={formData.target_date}
                        onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Value
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.current_value || ''}
                        onChange={(e) => setFormData({ ...formData, current_value: e.target.value ? parseFloat(e.target.value) : 0 })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Collection Frequency
                      </label>
                      <select
                        value={formData.collection_frequency}
                        onChange={(e) => setFormData({ ...formData, collection_frequency: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Source
                    </label>
                    <textarea
                      value={formData.data_source}
                      onChange={(e) => setFormData({ ...formData, data_source: e.target.value })}
                      placeholder="Where will the data come from?"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Method
                    </label>
                    <textarea
                      value={formData.verification_method}
                      onChange={(e) => setFormData({ ...formData, verification_method: e.target.value })}
                      placeholder="How will the data be verified?"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={2}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                    >
                      {editingIndicator ? 'Update' : 'Create'} Indicator
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Indicators List */}
        {selectedEntity > 0 && (
          <div className="grid gap-4">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading indicators...</p>
              </div>
            ) : indicators.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 text-lg">No indicators found</p>
                <p className="text-gray-400 text-sm mt-2">Click "Add Indicator" to create your first indicator</p>
              </div>
            ) : (
              indicators.map((indicator) => (
                <div key={indicator.id} className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">{indicator.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(indicator.type)}`}>
                          {indicator.type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(indicator.status)}`}>
                          {indicator.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{indicator.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Code</p>
                          <p className="font-medium text-sm">{indicator.code}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Baseline</p>
                          <p className="font-medium text-sm">{indicator.baseline_value} {indicator.unit_of_measure}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Current</p>
                          <p className="font-medium text-sm">{indicator.current_value} {indicator.unit_of_measure}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Target</p>
                          <p className="font-medium text-sm">{indicator.target_value} {indicator.unit_of_measure}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Achievement</span>
                          <span className="font-semibold">{Number(indicator.achievement_percentage || 0).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              Number(indicator.achievement_percentage) >= 75 ? 'bg-green-500' :
                              Number(indicator.achievement_percentage) >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(Number(indicator.achievement_percentage || 0), 100)}%` }}
                          />
                        </div>
                      </div>

                      {indicator.responsible_person && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Responsible:</span> {indicator.responsible_person}
                        </p>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleEdit(indicator)}
                        className="flex-1 sm:flex-none px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(indicator.id)}
                        className="flex-1 sm:flex-none px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* No Entity Selected State */}
        {selectedEntity === 0 && !loadingEntities && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">Select a {activeTab.replace('_', ' ')} to view and manage indicators</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndicatorsManagement;
