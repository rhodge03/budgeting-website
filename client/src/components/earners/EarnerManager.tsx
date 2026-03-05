import { useState } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import * as earnersApi from '../../api/earners';
import ConfirmDialog from '../shared/ConfirmDialog';
import { ANIMAL_ICONS, ANIMAL_KEYS } from '../shared/Icons';

function IconPicker({ selectedIcon, onSelect }: { selectedIcon: string | null; onSelect: (key: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ANIMAL_KEYS.map((key) => {
        const Icon = ANIMAL_ICONS[key];
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              selectedIcon === key
                ? 'bg-blue-100 ring-2 ring-blue-500 scale-110'
                : 'bg-gray-50 hover:bg-gray-100 hover:scale-105'
            }`}
          >
            <Icon width={22} height={22} />
          </button>
        );
      })}
    </div>
  );
}

function renderAvatarIcon(avatarIcon: string | null | undefined, name: string, size = 20) {
  const AnimalIcon = avatarIcon ? ANIMAL_ICONS[avatarIcon] : null;
  if (AnimalIcon) {
    return <AnimalIcon width={size} height={size} />;
  }
  return <span>{name.charAt(0).toUpperCase()}</span>;
}

export default function EarnerManager() {
  const { earners, addEarner, removeEarner, archiveEarner, setPrimaryEarner, patchEarnerData, updateEarner } =
    useHouseholdStore();
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await addEarner(newName.trim());
    const latest = useHouseholdStore.getState().earners;
    const newEarner = latest[latest.length - 1];
    if (newEarner && newIcon) {
      patchEarnerData(newEarner.id, { avatarIcon: newIcon });
      await earnersApi.update(newEarner.id, { avatarIcon: newIcon });
    }
    setNewName('');
    setNewIcon(null);
    setIsAdding(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removeEarner(deleteTarget.id);
    setDeleteTarget(null);
  };

  const startEditing = (earner: typeof earners[number]) => {
    setEditingId(earner.id);
    setEditName(earner.name);
    setEditIcon(earner.avatarIcon || null);
    setIsAdding(false);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditIcon(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) return;
    const updates: { name?: string; avatarIcon?: string | null } = {};
    const earner = earners.find((e) => e.id === editingId);
    if (!earner) return;

    if (editName.trim() !== earner.name) updates.name = editName.trim();
    if (editIcon !== (earner.avatarIcon || null)) updates.avatarIcon = editIcon;

    if (Object.keys(updates).length > 0) {
      patchEarnerData(editingId, updates);
      await updateEarner(editingId, updates);
    }
    cancelEditing();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Earners
        </h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Earner
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-4 space-y-3">
          <div className="flex gap-2">
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
              onClick={() => { setIsAdding(false); setNewName(''); setNewIcon(null); }}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Choose an icon
            </label>
            <IconPicker selectedIcon={newIcon} onSelect={setNewIcon} />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {earners.map((earner) => (
          <div key={earner.id}>
            {editingId === earner.id ? (
              /* ── Edit mode ── */
              <div className="py-2 px-3 rounded-md bg-blue-50 border border-blue-200 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    autoFocus
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Choose an icon
                  </label>
                  <IconPicker selectedIcon={editIcon} onSelect={setEditIcon} />
                </div>
              </div>
            ) : (
              /* ── Display mode ── */
              <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                    {renderAvatarIcon(earner.avatarIcon, earner.name, 20)}
                  </div>
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
                  <button
                    onClick={() => startEditing(earner)}
                    className="text-xs text-gray-500 hover:text-blue-600 px-2 py-1"
                    title="Edit earner"
                  >
                    Edit
                  </button>
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
            )}
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
