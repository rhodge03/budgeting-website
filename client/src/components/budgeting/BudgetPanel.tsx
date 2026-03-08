import { useState, useEffect, useMemo } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import Card from '../shared/Card';
import EmptyState from '../shared/EmptyState';
import SegmentedControl from '../shared/SegmentedControl';
import { computeHomePurchaseMonthly, HOME_PURCHASE_LOCKED_NAMES } from 'shared';
import CategoryGroup from './CategoryGroup';
import ScenarioSelector from './ScenarioSelector';

const BUFFER_STORAGE_KEY = 'expense-buffer';

export default function BudgetPanel() {
  const { household, earners, expenseCategories, homePurchase, addExpenseCategory, updateHousehold } = useHouseholdStore();
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

  const hpMonthly = useMemo(
    () => (homePurchase ? computeHomePurchaseMonthly(homePurchase) : null),
    [homePurchase],
  );

  const totalMonthly = expenseCategories.reduce(
    (sum, cat) => {
      const subs = cat.name === 'Housing' && homePurchase
        ? cat.subCategories.filter((s) => !HOME_PURCHASE_LOCKED_NAMES.includes(s.name))
        : cat.subCategories;
      return sum + subs.reduce((s, sub) => s + Number(sub.amount), 0);
    },
    0,
  ) + (hpMonthly?.total ?? 0);
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
          <SegmentedControl
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'annual', label: 'Annual' },
            ]}
            value={showMonthly ? 'monthly' : 'annual'}
            onChange={(v) => setShowMonthly(v === 'monthly')}
            size="sm"
          />
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-500">Buffer</label>
            <input
              type="number"
              min={0}
              max={100}
              value={bufferPct}
              onChange={(e) => handleBufferChange(Number(e.target.value))}
              className="w-14 px-1.5 py-1 text-xs text-center border border-gray-300 rounded-lg"
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
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleAddCategory}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
          <Card accent="purple" padding={false} className="overflow-hidden">
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
          </Card>
        );
      })()}

      {expenseCategories.length === 0 && (
        <Card>
          <EmptyState
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            }
            message="No expense categories yet. Add one to start budgeting."
          />
        </Card>
      )}
    </div>
  );
}
