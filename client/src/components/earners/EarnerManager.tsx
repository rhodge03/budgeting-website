import { useState } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import ConfirmDialog from '../shared/ConfirmDialog';

export default function EarnerManager() {
  const { earners, addEarner, removeEarner, archiveEarner, setPrimaryEarner } =
    useHouseholdStore();
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await addEarner(newName.trim());
    setNewName('');
    setIsAdding(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removeEarner(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Earners
        </h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Earner
          </button>
        )}
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Earner name"
            autoFocus
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => { setIsAdding(false); setNewName(''); }}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="space-y-2">
        {earners.map((earner) => (
          <div
            key={earner.id}
            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {earner.name}
              </span>
              {earner.isPrimary && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Primary
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {!earner.isPrimary && (
                <button
                  onClick={() => setPrimaryEarner(earner.id)}
                  className="text-xs text-gray-500 hover:text-blue-600 px-2 py-1"
                  title="Set as primary earner"
                >
                  Set Primary
                </button>
              )}
              <button
                onClick={() => archiveEarner(earner.id)}
                className="text-xs text-gray-500 hover:text-amber-600 px-2 py-1"
                title="Archive earner"
              >
                Archive
              </button>
              <button
                onClick={() => setDeleteTarget({ id: earner.id, name: earner.name })}
                className="text-xs text-gray-500 hover:text-red-600 px-2 py-1"
                title="Delete earner"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {earners.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No earners yet. Add one to get started.
          </p>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Earner"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will remove all their income, savings, and retirement data. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
