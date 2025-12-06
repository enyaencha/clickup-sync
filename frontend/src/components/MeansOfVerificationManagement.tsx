import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../config/api';
import EvidenceViewer from './EvidenceViewer';

interface Verification {
  id: number;
  entity_type: string;
  entity_id: number;
  verification_method: string;
  description: string;
  evidence_type: string;
  document_name: string;
  document_path: string;
  document_date: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'needs-update';
  verified_by: number | null;
  verified_date: string | null;
  verification_notes: string;
  collection_frequency: string;
  responsible_person: string;
  notes: string;
  entity_name?: string;
}

interface Entity {
  id: number;
  name: string;
}

interface Attachment {
  id: number;
  entity_type: string;
  entity_id: number;
  file_name: string;
  file_path: string | null;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  attachment_type: string;
  description: string | null;
  uploaded_at: string;
  uploaded_by: number | null;
}

type EntityType = 'module' | 'sub_program' | 'component' | 'activity' | 'indicator';

const MeansOfVerificationManagement: React.FC = () => {
  const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();
  const { user } = useAuth();

  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVerification, setEditingVerification] = useState<Verification | null>(null);

  // Program filter
  const [selectedModuleId, setSelectedModuleId] = useState<number>(0);

  // Entities for dropdowns
  const [modules, setModules] = useState<Entity[]>([]);
  const [subPrograms, setSubPrograms] = useState<Entity[]>([]);
  const [components, setComponents] = useState<Entity[]>([]);
  const [activities, setActivities] = useState<Entity[]>([]);
  const [indicators, setIndicators] = useState<Entity[]>([]);

  // Filtered entities based on selected module
  const [filteredSubPrograms, setFilteredSubPrograms] = useState<Entity[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Entity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Entity[]>([]);
  const [filteredIndicators, setFilteredIndicators] = useState<Entity[]>([]);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [attachments, setAttachments] = useState<Record<number, Attachment[]>>({});

  // Evidence viewer state
  const [showEvidenceViewer, setShowEvidenceViewer] = useState(false);
  const [viewingVerification, setViewingVerification] = useState<Verification | null>(null);

  // Workflow settings state
  const [workflowSettings, setWorkflowSettings] = useState<any>(null);
  const [showApprovalButtons, setShowApprovalButtons] = useState(true);
  const [allowEditVerified, setAllowEditVerified] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    entity_type: 'activity' as EntityType,
    entity_id: 0,
    verification_method: '',
    description: '',
    evidence_type: 'document',
    document_name: '',
    document_path: '',
    document_date: '',
    verification_status: 'pending' as 'pending' | 'verified' | 'rejected' | 'needs-update',
    collection_frequency: 'monthly',
    responsible_person: '',
    notes: ''
  });

  useEffect(() => {
    fetchEntities();
    fetchWorkflowSettings();
  }, []);

  useEffect(() => {
    fetchVerifications();
    if (selectedModuleId > 0) {
      filterEntitiesByModule();
    }
  }, [entityType, entityId, selectedModuleId, subPrograms, components, activities, indicators]);

  const fetchWorkflowSettings = async () => {
    try {
      const response = await authFetch('/api/settings');
      if (!response.ok) {
        console.error('Failed to fetch settings');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setWorkflowSettings(data.data);
        setShowApprovalButtons(data.data.show_verification_approval_on_original_page ?? true);
        setAllowEditVerified(data.data.allow_edit_verified_items ?? false);
      }
    } catch (err) {
      console.error('Error fetching workflow settings:', err);
    }
  };

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      let url = entityType && entityId
        ? `/api/means-of-verification/entity/${entityType}/${entityId}`
        : '/api/means-of-verification';

      const response = await authFetch(url);
      if (!response.ok) throw new Error('Failed to fetch verifications');

      const data = await response.json();
      let verifs = data.data || [];

      // Client-side filtering by module
      if (selectedModuleId > 0 && !entityType) {
        verifs = verifs.filter((verif: Verification) => {
          // Filter based on entity type
          if (verif.entity_type === 'module') {
            return verif.entity_id === selectedModuleId;
          } else if (verif.entity_type === 'sub_program') {
            const subProgram = subPrograms.find((sp: any) => sp.id === verif.entity_id);
            return subProgram && subProgram.module_id === selectedModuleId;
          } else if (verif.entity_type === 'component') {
            const component = components.find((c: any) => c.id === verif.entity_id);
            if (!component) return false;
            const subProgram = subPrograms.find((sp: any) => sp.id === component.sub_program_id);
            return subProgram && subProgram.module_id === selectedModuleId;
          } else if (verif.entity_type === 'activity') {
            const activity = activities.find((a: any) => a.id === verif.entity_id);
            if (!activity) return false;
            const component = components.find((c: any) => c.id === activity.component_id);
            if (!component) return false;
            const subProgram = subPrograms.find((sp: any) => sp.id === component.sub_program_id);
            return subProgram && subProgram.module_id === selectedModuleId;
          } else if (verif.entity_type === 'indicator') {
            const indicator = indicators.find((i: any) => i.id === verif.entity_id);
            return indicator && indicator.module_id === selectedModuleId;
          }
          return false;
        });
      }

      setVerifications(verifs);

      // Fetch attachments for each verification
      for (const verif of verifs) {
        fetchAttachmentsForVerification(verif.id);
      }
    } catch (err) {
      console.error('Error fetching verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttachmentsForVerification = async (verificationId: number) => {
    try {
      const response = await authFetch(`/api/attachments?entity_type=verification&entity_id=${verificationId}`);
      if (!response.ok) return;

      const data = await response.json();
      setAttachments(prev => ({
        ...prev,
        [verificationId]: data.data || []
      }));
    } catch (err) {
      console.error('Error fetching attachments:', err);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async (verificationId: number) => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('entity_type', 'verification');
      formData.append('entity_id', verificationId.toString());
      formData.append('attachment_type', 'document');
      formData.append('description', selectedFile.name);

      const response = await authFetch('/api/attachments/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      alert('File uploaded successfully!');
      setSelectedFile(null);

      // Refresh attachments
      await fetchAttachmentsForVerification(verificationId);
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Failed to upload file: ' + (err as Error).message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: number, verificationId: number) => {
    if (!confirm('Are you sure you want to delete this attachment?')) return;

    try {
      const response = await authFetch(`/api/attachments/${attachmentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete attachment');

      alert('Attachment deleted successfully!');
      await fetchAttachmentsForVerification(verificationId);
    } catch (err) {
      console.error('Error deleting attachment:', err);
      alert('Failed to delete attachment');
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleViewEvidence = (verification: Verification) => {
    setViewingVerification(verification);
    setShowEvidenceViewer(true);
  };

  const filterEntitiesByModule = () => {
    if (selectedModuleId === 0) {
      setFilteredSubPrograms([]);
      setFilteredComponents([]);
      setFilteredActivities([]);
      setFilteredIndicators([]);
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

    // Filter indicators - they can be at any level but linked to module/sub-program/component/activity
    const moduleIndicators = indicators.filter((i: any) => {
      return i.module_id === selectedModuleId ||
        subProgramIds.includes(i.sub_program_id) ||
        componentIds.includes(i.component_id) ||
        moduleActivities.some(a => a.id === i.activity_id);
    });
    setFilteredIndicators(moduleIndicators);
  };

  const fetchEntities = async () => {
    try {
      // Fetch all entity types for dropdowns
      const [modulesRes, subProgramsRes, componentsRes, activitiesRes, indicatorsRes] = await Promise.all([
        authFetch('/api/programs'),
        authFetch('/api/sub-programs'),
        authFetch('/api/components'),
        authFetch('/api/activities'),
        authFetch('/api/indicators')
      ]);

      const [modulesData, subProgramsData, componentsData, activitiesData, indicatorsData] = await Promise.all([
        modulesRes.json(),
        subProgramsRes.json(),
        componentsRes.json(),
        activitiesRes.json(),
        indicatorsRes.json()
      ]);

      // Filter modules based on user's module assignments
      let filteredModules = modulesData.data || [];
      if (user && !user.is_system_admin && user.module_assignments && user.module_assignments.length > 0) {
        const assignedModuleIds = user.module_assignments.map(m => m.module_id);
        filteredModules = (modulesData.data || []).filter((m: Entity) => assignedModuleIds.includes(m.id));
      }

      setModules(filteredModules);
      setSubPrograms(subProgramsData.data || []);
      setComponents(componentsData.data || []);
      setActivities(activitiesData.data || []);
      setIndicators(indicatorsData.data || []);
    } catch (err) {
      console.error('Error fetching entities:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.entity_id === 0) {
      alert('Please select an entity');
      return;
    }

    if (!formData.verification_method.trim()) {
      alert('Please enter a verification method');
      return;
    }

    try {
      const url = editingVerification
        ? `/api/means-of-verification/${editingVerification.id}`
        : '/api/means-of-verification';

      const method = editingVerification ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save verification');
      }

      await fetchVerifications();
      resetForm();
      alert('Verification method saved successfully!');
    } catch (err) {
      console.error('Error saving verification:', err);
      alert('Failed to save verification: ' + (err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this verification method?')) return;

    try {
      const response = await authFetch(`/api/means-of-verification/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete verification');

      await fetchVerifications();
      alert('Verification deleted successfully!');
    } catch (err) {
      console.error('Error deleting verification:', err);
      alert('Failed to delete verification');
    }
  };

  const handleVerify = async (id: number) => {
    const notes = prompt('Add verification notes (optional):');
    if (notes === null) return; // User cancelled

    try {
      const response = await authFetch(`/api/means-of-verification/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verified_by: 1, // TODO: Get from auth context
          verification_notes: notes
        })
      });

      if (!response.ok) throw new Error('Failed to verify evidence');

      await fetchVerifications();
      alert('Evidence verified successfully!');
    } catch (err) {
      console.error('Error verifying evidence:', err);
      alert('Failed to verify evidence');
    }
  };

  const handleReject = async (id: number) => {
    const notes = prompt('Reason for rejection (required):');
    if (!notes || notes.trim() === '') {
      alert('Rejection reason is required');
      return;
    }

    try {
      const response = await authFetch(`/api/means-of-verification/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verified_by: 1, // TODO: Get from auth context
          verification_notes: notes
        })
      });

      if (!response.ok) throw new Error('Failed to reject evidence');

      await fetchVerifications();
      alert('Evidence rejected');
    } catch (err) {
      console.error('Error rejecting evidence:', err);
      alert('Failed to reject evidence');
    }
  };

  const canEditVerification = async (verification: Verification): Promise<boolean> => {
    // If verification is not verified, allow edit
    if (verification.verification_status !== 'verified') {
      return true;
    }

    // Check workflow settings
    if (!allowEditVerified) {
      alert('Cannot edit verified items. This is locked by workflow settings.');
      return false;
    }

    return true;
  };

  const handleEdit = async (verification: Verification) => {
    // Check if edit is allowed
    const canEdit = await canEditVerification(verification);
    if (!canEdit) return;

    setEditingVerification(verification);
    setFormData({
      entity_type: verification.entity_type as EntityType,
      entity_id: verification.entity_id,
      verification_method: verification.verification_method,
      description: verification.description || '',
      evidence_type: verification.evidence_type,
      document_name: verification.document_name || '',
      document_path: verification.document_path || '',
      document_date: formatDateForInput(verification.document_date),
      verification_status: verification.verification_status,
      collection_frequency: verification.collection_frequency || 'monthly',
      responsible_person: verification.responsible_person || '',
      notes: verification.notes || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingVerification(null);
    setFormData({
      entity_type: 'activity',
      entity_id: 0,
      verification_method: '',
      description: '',
      evidence_type: 'document',
      document_name: '',
      document_path: '',
      document_date: '',
      verification_status: 'pending',
      collection_frequency: 'monthly',
      responsible_person: '',
      notes: ''
    });
  };

  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      return dateString.split('T')[0];
    } catch {
      return '';
    }
  };

  const getEntityOptions = (entityType: EntityType): Entity[] => {
    // If module is selected, return filtered entities
    if (selectedModuleId > 0) {
      switch (entityType) {
        case 'module': return modules.filter(m => m.id === selectedModuleId);
        case 'sub_program': return filteredSubPrograms;
        case 'component': return filteredComponents;
        case 'activity': return filteredActivities;
        case 'indicator': return filteredIndicators;
      }
    }

    // Otherwise return all
    switch (entityType) {
      case 'module': return modules;
      case 'sub_program': return subPrograms;
      case 'component': return components;
      case 'activity': return activities;
      case 'indicator': return indicators;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs-update': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'module': 'Module',
      'sub_program': 'Sub-Program',
      'component': 'Component',
      'activity': 'Activity',
      'indicator': 'Indicator'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Means of Verification</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Evidence sources and verification methods</p>
            </div>
            {!entityType && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <span>+</span> Add Verification
              </button>
            )}
          </div>

          {/* Module Filter */}
          {!entityType && (
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
                    {filteredActivities.length} activities, {filteredIndicators.length} indicators
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">📋 About Means of Verification</h3>
          <p className="text-blue-800 text-xs sm:text-sm mb-2">
            Means of Verification (MoV) document how you will prove that indicators have been achieved. They answer the question: "How will we know?"
          </p>
          <div className="text-blue-800 text-xs sm:text-sm pl-4">
            <p>• <strong>Evidence Types:</strong> Documents, photos, surveys, reports, etc.</p>
            <p>• <strong>Verification Status:</strong> Track approval workflow (pending → verified/rejected)</p>
            <p>• <strong>Link to Entities:</strong> Attach verification methods to activities, components, indicators, etc.</p>
          </div>
        </div>

        {/* Workflow Settings Info */}
        {!showApprovalButtons && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-lg">ℹ️</span>
              <div>
                <h3 className="font-semibold text-yellow-900 text-sm sm:text-base">Approval Workflow Notice</h3>
                <p className="text-yellow-800 text-xs sm:text-sm mt-1">
                  Verification approval actions (Verify/Reject) are only available on the Approvals page.
                  This is configured in your workflow settings.
                </p>
              </div>
            </div>
          </div>
        )}
        {!allowEditVerified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-lg">🔒</span>
              <div>
                <h3 className="font-semibold text-yellow-900 text-sm sm:text-base">Edit Protection Notice</h3>
                <p className="text-yellow-800 text-xs sm:text-sm mt-1">
                  Verified items cannot be edited. This is configured in your workflow settings to maintain data integrity.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-auto max-h-[85vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                  {editingVerification ? 'Edit Verification Method' : 'Add Verification Method'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Entity Selection */}
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Link to Entity</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Entity Type *
                        </label>
                        <select
                          required
                          value={formData.entity_type}
                          onChange={(e) => setFormData({ ...formData, entity_type: e.target.value as EntityType, entity_id: 0 })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="activity">Activity</option>
                          <option value="component">Component</option>
                          <option value="sub_program">Sub-Program</option>
                          <option value="module">Module</option>
                          <option value="indicator">Indicator</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select {getEntityTypeLabel(formData.entity_type)} *
                        </label>
                        <select
                          required
                          value={formData.entity_id}
                          onChange={(e) => setFormData({ ...formData, entity_id: parseInt(e.target.value) })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                          <option value="0">Select...</option>
                          {getEntityOptions(formData.entity_type).map((entity) => (
                            <option key={entity.id} value={entity.id}>
                              {entity.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Verification Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Method *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.verification_method}
                      onChange={(e) => setFormData({ ...formData, verification_method: e.target.value })}
                      placeholder="e.g., Monthly progress reports, Field visit observations"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the verification method in detail..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Evidence Type *
                      </label>
                      <select
                        required
                        value={formData.evidence_type}
                        onChange={(e) => setFormData({ ...formData, evidence_type: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="document">Document</option>
                        <option value="photo">Photo</option>
                        <option value="survey">Survey</option>
                        <option value="report">Report</option>
                        <option value="interview">Interview</option>
                        <option value="observation">Observation</option>
                        <option value="database">Database</option>
                        <option value="other">Other</option>
                      </select>
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
                        <option value="once">Once</option>
                      </select>
                    </div>
                  </div>

                  {/* Document Details */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Document Information (Optional)</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Document Name
                        </label>
                        <input
                          type="text"
                          value={formData.document_name}
                          onChange={(e) => setFormData({ ...formData, document_name: e.target.value })}
                          placeholder="e.g., Monthly Report October 2025.pdf"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Document Path/URL
                        </label>
                        <input
                          type="text"
                          value={formData.document_path}
                          onChange={(e) => setFormData({ ...formData, document_path: e.target.value })}
                          placeholder="e.g., /uploads/reports/oct2025.pdf or https://..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Document Date
                        </label>
                        <input
                          type="date"
                          value={formData.document_date}
                          onChange={(e) => setFormData({ ...formData, document_date: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsible Person
                    </label>
                    <input
                      type="text"
                      value={formData.responsible_person}
                      onChange={(e) => setFormData({ ...formData, responsible_person: e.target.value })}
                      placeholder="Name of person responsible for collecting this evidence"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any additional information..."
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
                      {editingVerification ? 'Update' : 'Create'} Verification
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Verifications List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading verifications...</p>
            </div>
          ) : verifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No verification methods found</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add Verification" to create your first verification method</p>
            </div>
          ) : (
            verifications.map((verification) => (
              <div key={verification.id} className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    {/* Status and Evidence Type Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded text-xs sm:text-sm font-medium ${getStatusColor(verification.verification_status)}`}>
                        {verification.verification_status.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {verification.evidence_type.toUpperCase()}
                      </span>
                      {verification.entity_name && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {getEntityTypeLabel(verification.entity_type)}: {verification.entity_name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{verification.verification_method}</h3>
                    {verification.description && (
                      <p className="text-sm sm:text-base text-gray-600 mb-3">{verification.description}</p>
                    )}

                    {verification.document_name && (
                      <div className="p-3 bg-gray-50 rounded mb-3">
                        <p className="text-sm font-medium text-gray-700 break-words">📄 {verification.document_name}</p>
                        {verification.document_date && (
                          <p className="text-xs text-gray-500">Date: {new Date(verification.document_date).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600">
                      {verification.collection_frequency && (
                        <div>
                          <span className="font-medium">Frequency:</span> {verification.collection_frequency}
                        </div>
                      )}
                      {verification.responsible_person && (
                        <div>
                          <span className="font-medium">Responsible:</span> {verification.responsible_person}
                        </div>
                      )}
                    </div>

                    {verification.verification_notes && (
                      <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-gray-700">
                        <span className="font-medium">Notes:</span> {verification.verification_notes}
                      </div>
                    )}

                    {/* Attachments Section */}
                    <div className="mt-4 border-t pt-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">📎 Attachments</h4>

                      {/* Display existing attachments */}
                      {attachments[verification.id] && attachments[verification.id].length > 0 && (
                        <div className="space-y-2 mb-3">
                          {attachments[verification.id].map((attachment) => (
                            <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs sm:text-sm">
                              <div className="flex-1 min-w-0">
                                <a
                                  href={`http://localhost:3000${attachment.file_path || attachment.file_url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline font-medium truncate block"
                                >
                                  {attachment.file_name}
                                </a>
                                <p className="text-gray-500 text-xs">
                                  {formatFileSize(attachment.file_size)} • {new Date(attachment.uploaded_at).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteAttachment(attachment.id, verification.id)}
                                className="ml-2 text-red-600 hover:text-red-800 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* File upload */}
                      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        <input
                          type="file"
                          onChange={handleFileSelect}
                          className="text-xs sm:text-sm file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full sm:w-auto"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.csv"
                        />
                        <button
                          onClick={() => handleFileUpload(verification.id)}
                          disabled={!selectedFile || uploadingFile}
                          className="px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                          {uploadingFile ? 'Uploading...' : 'Upload'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {attachments[verification.id] && attachments[verification.id].length > 0 && (
                      <button
                        onClick={() => handleViewEvidence(verification)}
                        className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 font-medium"
                      >
                        👁️ View Evidence ({attachments[verification.id].length})
                      </button>
                    )}
                    {verification.verification_status === 'pending' && showApprovalButtons && (
                      <>
                        <button
                          onClick={() => handleVerify(verification.id)}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          ✓ Verify
                        </button>
                        <button
                          onClick={() => handleReject(verification.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          ✗ Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleEdit(verification)}
                      className={`px-3 py-1 text-sm rounded ${
                        verification.verification_status === 'verified' && !allowEditVerified
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                      disabled={verification.verification_status === 'verified' && !allowEditVerified}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(verification.id)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
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

      {/* Evidence Viewer Modal */}
      {showEvidenceViewer && viewingVerification && (
        <EvidenceViewer
          attachments={attachments[viewingVerification.id] || []}
          verificationMethod={viewingVerification.verification_method}
          onClose={() => {
            setShowEvidenceViewer(false);
            setViewingVerification(null);
          }}
          onDelete={async (attachmentId) => {
            await handleDeleteAttachment(attachmentId, viewingVerification.id);
            // Refresh attachments after delete
            await fetchAttachmentsForVerification(viewingVerification.id);
          }}
          canDelete={true}
        />
      )}
    </div>
  );
};

export default MeansOfVerificationManagement;
