import { useState } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import type { ExpenseCategory } from 'shared';
import SubCategoryRow from './SubCategoryRow';

interface CategoryGroupProps {
  category: ExpenseCategory;
  showMonthly: boolean;
}

export default function CategoryGroup({ category, showMonthly }: CategoryGroupProps) {
  const { updateExpenseCategory, removeExpenseCategory, addExpenseSubCategory } = useHouseholdStore();
  const [addingSub, setAddingSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');

  const monthlyTotal = category.subCategories.reduce((sum, s) => sum + Number(s.amount), 0);
  const displayTotal = showMonthly ? monthlyTotal : monthlyTotal * 12;

  const toggleCollapse = () => {
    updateExpenseCategory(category.id, { isCollapsed: !category.isCollapsed });
  };

  const handleAddSub = async () => {
    if (!newSubName.trim()) return;
    await addExpenseSubCategory(category.id, newSubName.trim());
    setNewSubName('');
    setAddingSub(false);
  };

  const handleRemoveCategory = () => {
    if (confirm(`Delete "${category.name}" and all its subcategories?`)) {
      removeExpenseCategory(category.id);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Category header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer select-none"
        onClick={toggleCollapse}
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs text-gray-400 transition-transform ${category.isCollapsed ? '' : 'rotate-90'}`}>
            &#9654;
          </span>
          <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
          <span className="text-xs text-gray-500">
            ({category.subCategories.length})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            ${displayTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-gray-400 font-normal text-xs"> /{showMonthly ? 'mo' : 'yr'}</span>
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); handleRemoveCategory(); }}
            className="text-gray-400 hover:text-red-500 text-sm"
            title="Delete category"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Subcategories (collapsible) */}
      {!category.isCollapsed && (
        <div className="divide-y divide-gray-100">
          {category.subCategories.map((sub) => (
            <SubCategoryRow
              key={sub.id}
              sub={sub}
              categoryId={category.id}
              showMonthly={showMonthly}
            />
          ))}

          {/* Add sub-category */}
          <div className="px-4 py-2">
            {addingSub ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSub()}
                  placeholder="Subcategory name"
                  autoFocus
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddSub}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add
                </button>
                <button
                  onClick={() => { setAddingSub(false); setNewSubName(''); }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAddingSub(true)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                + Add item
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
