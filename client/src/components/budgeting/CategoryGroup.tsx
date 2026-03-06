import { useState, useMemo } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import type { ExpenseCategory } from 'shared';
import { computeHomePurchaseMonthly, HOME_PURCHASE_LOCKED_NAMES } from 'shared';
import SubCategoryRow from './SubCategoryRow';
import HomePurchaseDialog from './HomePurchaseDialog';
import HomeEquityChart from './HomeEquityChart';

interface CategoryGroupProps {
  category: ExpenseCategory;
  showMonthly: boolean;
}

export default function CategoryGroup({ category, showMonthly }: CategoryGroupProps) {
  const { updateExpenseCategory, removeExpenseCategory, addExpenseSubCategory, homePurchase } = useHouseholdStore();
  const [addingSub, setAddingSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [showHomeDialog, setShowHomeDialog] = useState(false);

  const isHousing = category.name === 'Housing';
  const hpMonthly = useMemo(
    () => (isHousing && homePurchase ? computeHomePurchaseMonthly(homePurchase) : null),
    [isHousing, homePurchase],
  );

  // Filter out locked subcategories when home purchase is active
  const visibleSubs = isHousing && homePurchase
    ? category.subCategories.filter((s) => !HOME_PURCHASE_LOCKED_NAMES.includes(s.name))
    : category.subCategories;

  const manualMonthly = visibleSubs.reduce((sum, s) => sum + Number(s.amount), 0);
  const monthlyTotal = manualMonthly + (hpMonthly?.total ?? 0);
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

  const lockedItems = hpMonthly
    ? [
        { label: 'Mortgage P&I', amount: hpMonthly.mortgagePI },
        { label: 'Property Tax', amount: hpMonthly.propertyTax },
        { label: 'Home Insurance', amount: hpMonthly.homeInsurance },
        { label: 'Home Maintenance', amount: hpMonthly.repairs },
      ]
    : [];

  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
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
          {isHousing && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowHomeDialog(true); }}
              className="ml-1 px-2 py-0.5 text-[11px] text-blue-600 border border-blue-200 rounded hover:bg-blue-50 font-medium"
            >
              {homePurchase ? 'Edit Home' : 'Home Purchase'}
            </button>
          )}
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
        <div>
          {/* Locked home purchase rows */}
          {lockedItems.length > 0 && (
            <div className="divide-y divide-blue-100 bg-blue-50/40 border-b border-blue-200">
              {lockedItems.map((item) => {
                const display = showMonthly ? item.amount : item.amount * 12;
                return (
                  <div key={item.label} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="flex-1 text-sm text-blue-800">{item.label}</span>
                    <div className="w-36 text-right">
                      <span className="text-sm font-medium text-blue-900">
                        ${display.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <span className="text-[10px] text-blue-400 w-4" title="Computed from Home Purchase">
                      &#128274;
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Regular editable subcategories */}
          <div className="divide-y divide-gray-100">
            {visibleSubs.map((sub) => (
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

          {/* Home equity chart */}
          {isHousing && homePurchase && (
            <div className="px-4 pb-4">
              <HomeEquityChart homePurchase={homePurchase} />
            </div>
          )}
        </div>
      )}

      {/* Home purchase dialog */}
      {isHousing && (
        <HomePurchaseDialog open={showHomeDialog} onClose={() => setShowHomeDialog(false)} />
      )}
    </div>
  );
}
