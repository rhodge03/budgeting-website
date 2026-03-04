import { useState } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import CategoryGroup from './CategoryGroup';

export default function BudgetPanel() {
  const { household, expenseCategories, addExpenseCategory, updateHousehold } = useHouseholdStore();
  const [showMonthly, setShowMonthly] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const bufferPct = Number(household?.expenseBuffer ?? 0);

  const totalMonthly = expenseCategories.reduce(
    (sum, cat) => sum + cat.subCategories.reduce((s, sub) => s + Number(sub.amount), 0),
    0,
  );
  const bufferedMonthly = totalMonthly * (1 + bufferPct / 100);
  const displayTotal = showMonthly ? bufferedMonthly : bufferedMonthly * 12;

  const handleBufferChange = (value: number) => {
    updateHousehold({ expenseBuffer: Math.max(0, value) });
  };

  const handleAddCategory = async () => {
    if (!newName.trim()) return;
    await addExpenseCategory(newName.trim());
    setNewName('');
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      {/* Header with toggle and total */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-gray-300 overflow-hidden text-sm">
            <button
              onClick={() => setShowMonthly(true)}
              className={`px-3 py-1.5 transition-colors ${
                showMonthly ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setShowMonthly(false)}
              className={`px-3 py-1.5 transition-colors ${
                !showMonthly ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Annual
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-500">Buffer</label>
            <input
              type="number"
              min={0}
              max={100}
              value={bufferPct}
              onChange={(e) => handleBufferChange(Number(e.target.value))}
              className="w-14 px-1.5 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-500">%</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            Total: ${displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-gray-500 font-normal"> / {showMonthly ? 'mo' : 'yr'}</span>
            {bufferPct > 0 && (
              <span className="text-xs text-amber-600 font-normal ml-1">(+{bufferPct}% buffer)</span>
            )}
          </span>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add Category
        </button>
      </div>

      {/* Add category input */}
      {adding && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="Category name"
            autoFocus
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCategory}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => { setAdding(false); setNewName(''); }}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Category groups */}
      {expenseCategories.map((category) => (
        <CategoryGroup
          key={category.id}
          category={category}
          showMonthly={showMonthly}
        />
      ))}

      {expenseCategories.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">No expense categories yet. Add one to start budgeting.</p>
        </div>
      )}
    </div>
  );
}
