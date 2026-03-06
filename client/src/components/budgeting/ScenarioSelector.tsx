import { useState } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';

export default function ScenarioSelector() {
  const { household, expenseScenarios, createScenario, renameScenario, removeScenario, switchScenario } = useHouseholdStore();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const activeId = household?.activeExpenseScenarioId;

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    await createScenario(name);
    setNewName('');
    setCreating(false);
  };

  const handleRename = async (id: string) => {
    const name = editName.trim();
    if (!name) return;
    await renameScenario(id, name);
    setEditingId(null);
    setEditName('');
  };

  const handleSwitch = async (id: string) => {
    if (id === activeId) return;
    await switchScenario(id);
  };

  const handleDelete = async (id: string) => {
    await removeScenario(id);
  };

  if (expenseScenarios.length === 0 && !creating) {
    return (
      <button
        onClick={() => setCreating(true)}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
      >
        Save as Scenario
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500 font-medium">Scenario:</span>

      {expenseScenarios.map((s) => (
        <div key={s.id} className="flex items-center gap-0.5">
          {editingId === s.id ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(s.id);
                if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
              }}
              onBlur={() => handleRename(s.id)}
              autoFocus
              className="px-2 py-0.5 text-xs border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-24"
            />
          ) : (
            <button
              onClick={() => handleSwitch(s.id)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                activeId === s.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s.name}
            </button>
          )}
          {activeId === s.id && editingId !== s.id && (
            <button
              onClick={() => { setEditingId(s.id); setEditName(s.name); }}
              className="text-gray-400 hover:text-gray-600 p-0.5"
              title="Rename"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
          <button
            onClick={() => handleDelete(s.id)}
            className="text-gray-400 hover:text-red-500 p-0.5"
            title="Delete scenario"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {creating ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') { setCreating(false); setNewName(''); }
            }}
            placeholder="Scenario name"
            autoFocus
            className="px-2 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-28"
          />
          <button
            onClick={handleCreate}
            className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={() => { setCreating(false); setNewName(''); }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          + New
        </button>
      )}
    </div>
  );
}
