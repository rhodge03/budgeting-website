import { useHouseholdStore } from '../../stores/householdStore';
import CurrencyInput from '../shared/CurrencyInput';
import type { ExpenseSubCategory } from 'shared';

interface SubCategoryRowProps {
  sub: ExpenseSubCategory;
  categoryId: string;
  showMonthly: boolean;
}

export default function SubCategoryRow({ sub, categoryId, showMonthly }: SubCategoryRowProps) {
  const { updateExpenseSubCategory, removeExpenseSubCategory } = useHouseholdStore();

  // Amount is stored as monthly; convert for display
  const monthlyAmount = Number(sub.amount);
  const displayAmount = showMonthly ? monthlyAmount : monthlyAmount * 12;

  const handleAmountChange = (value: number) => {
    // Convert back to monthly if displaying annual
    const monthlyValue = showMonthly ? value : value / 12;
    updateExpenseSubCategory(sub.id, categoryId, { amount: Math.round(monthlyValue * 100) / 100 });
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
      <span className="flex-1 text-sm text-gray-700">{sub.name}</span>
      <CurrencyInput
        value={displayAmount}
        onChange={handleAmountChange}
        className="w-36"
      />
      <button
        onClick={() => removeExpenseSubCategory(sub.id, categoryId)}
        className="text-gray-400 hover:text-red-500 text-lg leading-none"
        title="Remove"
      >
        &times;
      </button>
    </div>
  );
}
