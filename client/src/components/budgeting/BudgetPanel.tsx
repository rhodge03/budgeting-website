import { useState, useEffect } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import CategoryGroup from './CategoryGroup';
import ScenarioSelector from './ScenarioSelector';

const BUFFER_STORAGE_KEY = 'expense-buffer';

export default function BudgetPanel() {
  const { household, earners, expenseCategories, addExpenseCategory, updateHousehold } = useHouseholdStore();
  const [showMonthly, setShowMonthly] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const serverBuffer = Number(household?.expenseBuffer ?? 0);

  // On mount, restore from localStorage if server value is 0
  useEffect(() => {
    if (serverBuffer === 0) {
      try {
        const stored = localStorage.getItem(BUFFER_STORAGE_KEY);
        if (stored && Number(stored) > 0) {
          updateHousehold({ expenseBuffer: Number(stored) });
        }
      } catch { /* ignore */ }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const bufferPct = serverBuffer || (() => {
    try {
      return Number(localStorage.getItem(BUFFER_STORAGE_KEY) ?? 0);
    } catch { return 0; }
  })();

  const totalMonthly = expenseCategories.reduce(
    (sum, cat) => sum + cat.subCategories.reduce((s, sub) => s + Number(sub.amount), 0),
    0,
  );
  const childSavingsMonthly = earners
    .filter((e) => e.memberType === 'child')
    .reduce((s, e) => s + Number(e.savingsBalance?.monthlyContribution ?? 0), 0);
  const bufferedMonthly = totalMonthly * (1 + bufferPct / 100) + childSavingsMonthly;
  const displayTotal = showMonthly ? bufferedMonthly : bufferedMonthly * 12;

  const handleBufferChange = (value: number) => {
    const clamped = Math.max(0, value);
    localStorage.setItem(BUFFER_STORAGE_KEY, String(clamped));
    updateHousehold({ expenseBuffer: clamped });
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

      {/* Expense Scenarios */}
      <ScenarioSelector />

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

      {/* Child Savings contributions */}
      {(() => {
        const children = earners.filter((e) => e.memberType === 'child');
        const childContributions = children
          .filter((c) => Number(c.savingsBalance?.monthlyContribution ?? 0) > 0)
          .map((c) => ({
            id: c.id,
            name: c.name,
            monthly: Number(c.savingsBalance?.monthlyContribution ?? 0),
          }));
        if (childContributions.length === 0) return null;
        const totalChildMonthly = childContributions.reduce((s, c) => s + c.monthly, 0);
        const displayChildTotal = showMonthly ? totalChildMonthly : totalChildMonthly * 12;
        return (
          <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-purple-50">
              <h3 className="text-sm font-semibold text-purple-900">Child Savings</h3>
              <span className="text-sm font-medium text-purple-700">
                ${displayChildTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-purple-500 font-normal"> / {showMonthly ? 'mo' : 'yr'}</span>
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {childContributions.map((c) => {
                const display = showMonthly ? c.monthly : c.monthly * 12;
                return (
                  <div key={c.id} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-sm text-gray-700">{c.name}</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${display.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {expenseCategories.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">No expense categories yet. Add one to start budgeting.</p>
        </div>
      )}
    </div>
  );
}
