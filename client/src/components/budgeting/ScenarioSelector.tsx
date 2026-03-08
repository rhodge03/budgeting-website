import { useState } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import Modal from '../shared/Modal';

export default function ScenarioSelector() {
  const { household, expenseScenarios, createScenario, renameScenario, removeScenario, switchScenario } = useHouseholdStore();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const activeId = household?.activeExpenseScenarioId;
  const activeScenario = expenseScenarios.find((s) => s.id === activeId);

  const handleClose = () => {
    setOpen(false);
    setCreating(false);
    setNewName('');
    setEditingId(null);
    setEditName('');
  };

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
    handleClose();
  };

  const handleDelete = async (id: string) => {
    await removeScenario(id);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {activeScenario ? `Scenario: ${activeScenario.name}` : 'Expense Scenarios'}
      </button>

      {open && (
        <Modal open={open} onClose={handleClose} maxWidth="max-w-md">
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Expense Scenarios</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scenario list */}
            {expenseScenarios.length > 0 ? (
              <div className="space-y-2 mb-4">
                {expenseScenarios.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => editingId !== s.id && handleSwitch(s.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded border transition-colors ${
                      activeId === s.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {activeId === s.id && (
                        <span className="w-2 h-2 rounded-sm bg-blue-600 shrink-0" />
                      )}
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
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                          className="px-2 py-0.5 text-sm border border-blue-400 rounded flex-1"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {s.name}
                        </span>
                      )}
                    </div>

                    {editingId !== s.id && (
                      <div className="flex items-center gap-1.5 ml-3 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingId(s.id); setEditName(s.name); }}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                          title="Rename"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                          className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">
                No scenarios saved yet. Save your current expenses as a scenario to compare different spending patterns.
              </p>
            )}

            {/* Create new */}
            {creating ? (
              <div className="flex items-center gap-2">
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
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded"
                />
                <button
                  onClick={handleCreate}
                  className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => { setCreating(false); setNewName(''); }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="w-full px-3 py-2 text-sm font-medium text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 transition-colors"
              >
                + Save Current Expenses as Scenario
              </button>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
