import BudgetPanel from '../components/budgeting/BudgetPanel';

export default function BudgetingPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Budgeting</h2>
      <BudgetPanel />
    </div>
  );
}
