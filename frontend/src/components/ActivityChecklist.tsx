import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

interface ChecklistItem {
  id: number;
  activity_id: number;
  item_name: string;
  orderindex: number;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: number | null;
}

interface ChecklistStatus {
  total: number;
  completed: number;
  percentage: number;
  all_completed: boolean;
}

interface ActivityChecklistProps {
  activityId: number;
  activityApprovalStatus: string;
  readOnly?: boolean;
  onChecklistChange?: () => void;
}

const ActivityChecklist: React.FC<ActivityChecklistProps> = ({
  activityId,
  activityApprovalStatus,
  readOnly = false,
  onChecklistChange
}) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [status, setStatus] = useState<ChecklistStatus>({ total: 0, completed: 0, percentage: 0, all_completed: false });
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [canEdit, setCanEdit] = useState(true);

  useEffect(() => {
    fetchChecklist();
    checkIfCanEdit();
  }, [activityId]);

  const fetchChecklist = async () => {
    try {
      setLoading(true);

      // Fetch items
      const itemsRes = await authFetch(`/api/checklists/activity/${activityId}`);
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setItems(itemsData.data || []);
      }

      // Fetch status
      const statusRes = await authFetch(`/api/checklists/activity/${activityId}/status`);
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setStatus(statusData.data);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch checklist:', err);
      setLoading(false);
    }
  };

  const checkIfCanEdit = async () => {
    try {
      const response = await authFetch('/api/settings');
      if (response.ok) {
        const settingsData = await response.json();
        const settings = settingsData.data;

        // Check if checklist can be edited after approval
        if (!settings.allow_checklist_edit_after_approval && activityApprovalStatus === 'approved') {
          setCanEdit(false);
        }
      }
    } catch (err) {
      console.error('Failed to check edit permissions:', err);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;

    try {
      const response = await authFetch('/api/checklists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_id: activityId,
          item_name: newItemName.trim(),
          orderindex: items.length
        })
      });

      if (response.ok) {
        setNewItemName('');
        await fetchChecklist();
        onChecklistChange?.();
      }
    } catch (err) {
      console.error('Failed to add item:', err);
      alert('Failed to add checklist item');
    }
  };

  const handleToggleComplete = async (itemId: number) => {
    try {
      const response = await authFetch(`/api/checklists/${itemId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1 }) // TODO: Get actual user ID
      });

      if (response.ok) {
        await fetchChecklist();
        onChecklistChange?.();
      }
    } catch (err) {
      console.error('Failed to toggle item:', err);
      alert('Failed to update checklist item');
    }
  };

  const handleStartEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditingName(item.item_name);
  };

  const handleSaveEdit = async (itemId: number) => {
    if (!editingName.trim()) return;

    try {
      const response = await authFetch(`/api/checklists/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name: editingName.trim() })
      });

      if (response.ok) {
        setEditingId(null);
        setEditingName('');
        await fetchChecklist();
        onChecklistChange?.();
      }
    } catch (err) {
      console.error('Failed to update item:', err);
      alert('Failed to update checklist item');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('Delete this checklist item?')) return;

    try {
      const response = await authFetch(`/api/checklists/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchChecklist();
        onChecklistChange?.();
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
      alert('Failed to delete checklist item');
    }
  };

  const getProgressColor = () => {
    if (status.percentage === 100) return 'bg-green-500';
    if (status.percentage >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const shouldShowEditing = !readOnly && canEdit;

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Implementation Checklist</h3>
        {status.total > 0 && (
          <span className="text-sm font-medium text-gray-600">
            {status.completed}/{status.total} completed ({status.percentage}%)
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {status.total > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${getProgressColor()} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${status.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Cannot Edit Message */}
      {!canEdit && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          ⚠️ Checklist is locked after approval
        </div>
      )}

      {/* Checklist Items */}
      {loading && items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">No checklist items yet</p>
          {shouldShowEditing && (
            <p className="text-sm">Add implementation steps below</p>
          )}
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-gray-300 transition-colors"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={item.is_completed}
                onChange={() => !readOnly && canEdit && handleToggleComplete(item.id)}
                disabled={readOnly || !canEdit}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
              />

              {/* Item Name */}
              {editingId === item.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(item.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(item.id)}
                    className="px-2 py-1 text-green-600 hover:bg-green-50 rounded text-sm"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 ${
                      item.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {item.item_name}
                  </span>

                  {/* Actions */}
                  {shouldShowEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        title="Edit item"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        title="Delete item"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Item */}
      {shouldShowEditing && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="Add a new checklist item..."
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleAddItem}
            disabled={!newItemName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityChecklist;
