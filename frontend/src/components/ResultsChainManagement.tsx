import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ResultsChainLink {
  id: number;
  from_entity_type: string;
  from_entity_id: number;
  from_entity_name: string;
  to_entity_type: string;
  to_entity_id: number;
  to_entity_name: string;
  contribution_description: string;
  contribution_weight: number;
  notes?: string;
}

interface Entity {
  id: number;
  name: string;
}

type EntityType = 'module' | 'sub_program' | 'component' | 'activity';

const ResultsChainManagement: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();

  const [links, setLinks] = useState<ResultsChainLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<ResultsChainLink | null>(null);

  // Module filter
  const [selectedModuleId, setSelectedModuleId] = useState<number>(
    moduleId ? parseInt(moduleId) : 0
  );

  // Entities for dropdowns
  const [modules, setModules] = useState<Entity[]>([]);
  const [subPrograms, setSubPrograms] = useState<Entity[]>([]);
  const [components, setComponents] = useState<Entity[]>([]);
  const [activities, setActivities] = useState<Entity[]>([]);

  // Filtered entities based on selected module
  const [filteredSubPrograms, setFilteredSubPrograms] = useState<Entity[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Entity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Entity[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    from_entity_type: 'activity' as EntityType,
    from_entity_id: 0,
    to_entity_type: 'component' as EntityType,
    to_entity_id: 0,
    contribution_description: '',
    contribution_weight: 100,
    notes: ''
  });

  // Store full entity objects with parent IDs
  const [selectedFromEntity, setSelectedFromEntity] = useState<any>(null);

  // Filtered entities based on hierarchy
  const [filteredToEntities, setFilteredToEntities] = useState<Entity[]>([]);

  useEffect(() => {
    fetchEntities();
  }, []);

  useEffect(() => {
    fetchLinks();
    if (selectedModuleId > 0) {
      filterEntitiesByModule();
    }
  }, [selectedModuleId, subPrograms, components, activities]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const url = selectedModuleId > 0
        ? `/api/results-chain?module_id=${selectedModuleId}`
        : '/api/results-chain';

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch results chain');

      const data = await response.json();
      setLinks(data.data || []);
    } catch (err) {
      console.error('Error fetching results chain:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEntitiesByModule = () => {
    if (selectedModuleId === 0) {
      setFilteredSubPrograms([]);
      setFilteredComponents([]);
      setFilteredActivities([]);
      return;
    }

    // Filter sub-programs by module
    const moduleSubPrograms = subPrograms.filter(
      (sp: any) => sp.module_id === selectedModuleId
    );
    setFilteredSubPrograms(moduleSubPrograms);

    // Filter components by sub-programs in this module
    const subProgramIds = moduleSubPrograms.map(sp => sp.id);
    const moduleComponents = components.filter(
      (c: any) => subProgramIds.includes(c.sub_program_id)
    );
    setFilteredComponents(moduleComponents);

    // Filter activities by components in this module
    const componentIds = moduleComponents.map(c => c.id);
    const moduleActivities = activities.filter(
      (a: any) => componentIds.includes(a.component_id)
    );
    setFilteredActivities(moduleActivities);
  };

  const fetchEntities = async () => {
    try {
      // Fetch all entity types for dropdowns
      const [modulesRes, subProgramsRes, componentsRes, activitiesRes] = await Promise.all([
        fetch('/api/programs'),
        fetch('/api/sub-programs'),
        fetch('/api/components'),
        fetch('/api/activities')
      ]);

      const [modulesData, subProgramsData, componentsData, activitiesData] = await Promise.all([
        modulesRes.json(),
        subProgramsRes.json(),
        componentsRes.json(),
        activitiesRes.json()
      ]);

      setModules(modulesData.data || []);
      setSubPrograms(subProgramsData.data || []);
      setComponents(componentsData.data || []);
      setActivities(activitiesData.data || []);
    } catch (err) {
      console.error('Error fetching entities:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.from_entity_id === 0 || formData.to_entity_id === 0) {
      alert('Please select both "from" and "to" entities');
      return;
    }

    try {
      const url = editingLink
        ? `/api/results-chain/${editingLink.id}`
        : '/api/results-chain';

      const method = editingLink ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save link');
      }

      await fetchLinks();
      resetForm();
      alert('Results chain link saved successfully!');
    } catch (err) {
      console.error('Error saving link:', err);
      alert('Failed to save link: ' + (err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this results chain link?')) return;

    try {
      const response = await fetch(`/api/results-chain/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete link');

      await fetchLinks();
      alert('Link deleted successfully!');
    } catch (err) {
      console.error('Error deleting link:', err);
      alert('Failed to delete link');
    }
  };

  const handleEdit = (link: ResultsChainLink) => {
    setEditingLink(link);
    setFormData({
      from_entity_type: link.from_entity_type as EntityType,
      from_entity_id: link.from_entity_id,
      to_entity_type: link.to_entity_type as EntityType,
      to_entity_id: link.to_entity_id,
      contribution_description: link.contribution_description || '',
      contribution_weight: link.contribution_weight || 100,
      notes: link.notes || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingLink(null);
    setFormData({
      from_entity_type: 'activity',
      from_entity_id: 0,
      to_entity_type: 'component',
      to_entity_id: 0,
      contribution_description: '',
      contribution_weight: 100,
      notes: ''
    });
  };

  // Filter "to" entities based on hierarchy when "from" entity changes
  useEffect(() => {
    if (formData.from_entity_id === 0 || !selectedFromEntity) {
      setFilteredToEntities([]);
      return;
    }

    filterValidToEntities();
  }, [formData.from_entity_id, formData.to_entity_type, selectedFromEntity]);

  const filterValidToEntities = () => {
    if (!selectedFromEntity) {
      setFilteredToEntities([]);
      return;
    }

    let validEntities: Entity[] = [];

    // Activity → Component: Only the component it belongs to
    if (formData.from_entity_type === 'activity' && formData.to_entity_type === 'component') {
      if (selectedFromEntity.component_id) {
        validEntities = components.filter(c => c.id === selectedFromEntity.component_id);
      }
    }
    // Activity → Sub-Program: Only the sub-program of its component
    else if (formData.from_entity_type === 'activity' && formData.to_entity_type === 'sub_program') {
      const parentComponent = components.find(c => c.id === selectedFromEntity.component_id);
      if (parentComponent && (parentComponent as any).sub_program_id) {
        validEntities = subPrograms.filter(sp => sp.id === (parentComponent as any).sub_program_id);
      }
    }
    // Component → Sub-Program: Only the sub-program it belongs to
    else if (formData.from_entity_type === 'component' && formData.to_entity_type === 'sub_program') {
      if ((selectedFromEntity as any).sub_program_id) {
        validEntities = subPrograms.filter(sp => sp.id === (selectedFromEntity as any).sub_program_id);
      }
    }
    // Component → Module: Only the module of its sub-program
    else if (formData.from_entity_type === 'component' && formData.to_entity_type === 'module') {
      const parentSubProgram = subPrograms.find(sp => sp.id === (selectedFromEntity as any).sub_program_id);
      if (parentSubProgram && (parentSubProgram as any).module_id) {
        validEntities = modules.filter(m => m.id === (parentSubProgram as any).module_id);
      }
    }
    // Sub-Program → Module: Only the module it belongs to
    else if (formData.from_entity_type === 'sub_program' && formData.to_entity_type === 'module') {
      if ((selectedFromEntity as any).module_id) {
        validEntities = modules.filter(m => m.id === (selectedFromEntity as any).module_id);
      }
    }

    setFilteredToEntities(validEntities);

    // Auto-select if only one valid option
    if (validEntities.length === 1) {
      setFormData(prev => ({ ...prev, to_entity_id: validEntities[0].id }));
    }
  };

  const handleFromEntityChange = (entityId: number) => {
    const entityList = getEntityOptions(formData.from_entity_type);
    const entity = entityList.find(e => e.id === entityId);

    setSelectedFromEntity(entity || null);
    setFormData(prev => ({
      ...prev,
      from_entity_id: entityId,
      to_entity_id: 0 // Reset to selection
    }));
  };

  const getEntityOptions = (entityType: EntityType): Entity[] => {
    // If module is selected, return filtered entities
    if (selectedModuleId > 0) {
      switch (entityType) {
        case 'module': return modules.filter(m => m.id === selectedModuleId);
        case 'sub_program': return filteredSubPrograms;
        case 'component': return filteredComponents;
        case 'activity': return filteredActivities;
      }
    }

    // Otherwise return all
    switch (entityType) {
      case 'module': return modules;
      case 'sub_program': return subPrograms;
      case 'component': return components;
      case 'activity': return activities;
    }
  };

  const getToEntityOptions = (): Entity[] => {
    // If we have filtered entities based on hierarchy, use those
    if (filteredToEntities.length > 0) {
      return filteredToEntities;
    }
    // Otherwise show all (for editing existing links)
    return getEntityOptions(formData.to_entity_type);
  };

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'module': 'Module (Impact)',
      'sub_program': 'Sub-Program (Outcome)',
      'component': 'Component (Output)',
      'activity': 'Activity'
    };
    return labels[type] || type;
  };

  const getEntityTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'module': '🎯',
      'sub_program': '📂',
      'component': '📋',
      'activity': '✓'
    };
    return icons[type] || '•';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Results Chain Management</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Link activities to outputs and outcomes</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <span>+</span> Create Link
            </button>
          </div>

          {/* Module Filter */}
          <div className="border-t pt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by Program:
              </label>
              <select
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(parseInt(e.target.value))}
                className="w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="0">All Programs</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
              {selectedModuleId > 0 && (
                <div className="text-xs text-gray-600 bg-blue-50 px-3 py-1 rounded">
                  <span className="font-medium">Filtered:</span>{' '}
                  {filteredSubPrograms.length} sub-programs, {filteredComponents.length} components, {filteredActivities.length} activities
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">📖 What is Results Chain?</h3>
          <p className="text-blue-800 text-xs sm:text-sm mb-2">
            Results Chain documents how activities contribute to higher-level results in your logframe:
          </p>
          <div className="text-blue-800 text-xs sm:text-sm pl-4">
            <p>• <strong>Activity → Component:</strong> How this activity contributes to an output</p>
            <p>• <strong>Component → Sub-Program:</strong> How this output contributes to an outcome</p>
            <p>• <strong>Sub-Program → Module:</strong> How this outcome contributes to the impact/goal</p>
          </div>
        </div>

        {/* Create/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-auto max-h-[85vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  {editingLink ? 'Edit Results Chain Link' : 'Create Results Chain Link'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* FROM Entity */}
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">From (Contributes)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Entity Type
                        </label>
                        <select
                          value={formData.from_entity_type}
                          onChange={(e) => setFormData({ ...formData, from_entity_type: e.target.value as EntityType, from_entity_id: 0 })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="activity">Activity</option>
                          <option value="component">Component (Output)</option>
                          <option value="sub_program">Sub-Program (Outcome)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select {getEntityTypeLabel(formData.from_entity_type)} *
                        </label>
                        <select
                          required
                          value={formData.from_entity_id}
                          onChange={(e) => handleFromEntityChange(parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="0">Select...</option>
                          {getEntityOptions(formData.from_entity_type).map((entity) => (
                            <option key={entity.id} value={entity.id}>
                              {entity.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* TO Entity */}
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">To (Contributes To)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Entity Type
                        </label>
                        <select
                          value={formData.to_entity_type}
                          onChange={(e) => setFormData({ ...formData, to_entity_type: e.target.value as EntityType, to_entity_id: 0 })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="component">Component (Output)</option>
                          <option value="sub_program">Sub-Program (Outcome)</option>
                          <option value="module">Module (Impact/Goal)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select {getEntityTypeLabel(formData.to_entity_type)} *
                          {filteredToEntities.length > 0 && (
                            <span className="ml-2 text-xs text-green-600">
                              (Filtered by hierarchy ✓)
                            </span>
                          )}
                        </label>
                        <select
                          required
                          value={formData.to_entity_id}
                          onChange={(e) => setFormData({ ...formData, to_entity_id: parseInt(e.target.value) })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          disabled={formData.from_entity_id === 0}
                        >
                          <option value="0">
                            {formData.from_entity_id === 0 ? 'Select "From" entity first...' : 'Select...'}
                          </option>
                          {getToEntityOptions().map((entity) => (
                            <option key={entity.id} value={entity.id}>
                              {entity.name}
                            </option>
                          ))}
                        </select>
                        {formData.from_entity_id > 0 && filteredToEntities.length === 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            No valid entities found. This entity may not have the required parent relationships.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contribution Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contribution Description *
                    </label>
                    <textarea
                      required
                      value={formData.contribution_description}
                      onChange={(e) => setFormData({ ...formData, contribution_description: e.target.value })}
                      placeholder="Describe how the lower-level entity contributes to the higher-level result..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contribution Weight (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.contribution_weight}
                      onChange={(e) => setFormData({ ...formData, contribution_weight: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">How much does this contribute? (0-100%)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes..."
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
                      {editingLink ? 'Update' : 'Create'} Link
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Links List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading results chain...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No results chain links yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Create Link" to document how activities contribute to outputs</p>
            </div>
          ) : (
            links.map((link) => (
              <div key={link.id} className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    {/* Link visualization */}
                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {getEntityTypeIcon(link.from_entity_type)} {getEntityTypeLabel(link.from_entity_type)}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                        {getEntityTypeIcon(link.to_entity_type)} {getEntityTypeLabel(link.to_entity_type)}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="font-semibold text-gray-900">{link.from_entity_name}</p>
                      <p className="text-sm text-gray-500">contributes to</p>
                      <p className="font-semibold text-gray-900">{link.to_entity_name}</p>
                    </div>

                    {link.contribution_description && (
                      <div className="mb-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{link.contribution_description}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Weight:</span> {link.contribution_weight}%
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(link)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsChainManagement;
