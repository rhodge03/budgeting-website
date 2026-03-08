import { useEffect } from 'react';
import { useHouseholdStore } from '../stores/householdStore';
import { useEarnerSelectionStore } from '../stores/earnerSelectionStore';
import Card from '../components/shared/Card';
import EmptyState from '../components/shared/EmptyState';
import EarnerManager from '../components/earners/EarnerManager';
import IncomePanel from '../components/income/IncomePanel';
import ContributionSettings from '../components/income/ContributionSettings';
import RetirementSettingsPanel from '../components/retirement/RetirementSettingsPanel';
import RateOfReturnPanel from '../components/rate-of-return/RateOfReturnPanel';
import EarnerTaxSettings from '../components/tax/EarnerTaxSettings';
import TaxSummaryPanel from '../components/tax/TaxSummaryPanel';

const CATEGORY_TITLES = {
  all: 'Income & Retirement',
  income: 'Income',
  savings: 'Savings & Contributions',
  retirement: 'Retirement',
  tax: 'Tax',
} as const;

export default function IncomeRetirementPage() {
  const earners = useHouseholdStore((s) => s.earners);
  const selectedEarnerId = useEarnerSelectionStore((s) => s.selectedEarnerId);
  const setSelectedEarnerId = useEarnerSelectionStore((s) => s.setSelectedEarnerId);
  const selectedCategory = useEarnerSelectionStore((s) => s.selectedCategory);

  // Reset to 'all' if selected earner was deleted
  useEffect(() => {
    if (
      selectedEarnerId !== 'all' &&
      !earners.find((e) => e.id === selectedEarnerId)
    ) {
      setSelectedEarnerId('all');
    }
  }, [earners, selectedEarnerId, setSelectedEarnerId]);

  const visibleEarners =
    selectedEarnerId === 'all'
      ? earners
      : earners.filter((e) => e.id === selectedEarnerId);

  const showBadge = selectedEarnerId === 'all' && earners.length > 1;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {CATEGORY_TITLES[selectedCategory]}
      </h2>
      <EarnerManager />

      <div className="space-y-6">
        {visibleEarners.map((earner) => {
          const isChild = earner.memberType === 'child';
          return (
            <div key={earner.id} className="space-y-4">
              {showBadge && (
                <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                  <div className="w-2 h-2 rounded-sm bg-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {earner.name}
                  </h3>
                  {earner.isPrimary && (
                    <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm">
                      Primary
                    </span>
                  )}
                  {isChild && (
                    <span className="text-xs font-normal text-purple-600 bg-purple-50 px-2 py-0.5 rounded-sm">
                      Child
                    </span>
                  )}
                </div>
              )}
              {!isChild && (selectedCategory === 'all' || selectedCategory === 'income') && (
                <IncomePanel earnerId={earner.id} />
              )}
              {(selectedCategory === 'all' || selectedCategory === 'savings') && (
                <ContributionSettings earnerId={earner.id} />
              )}
              {(selectedCategory === 'all' || selectedCategory === 'retirement') && (
                <RetirementSettingsPanel earnerId={earner.id} />
              )}
              {(selectedCategory === 'all' || selectedCategory === 'retirement') && (
                <RateOfReturnPanel earnerId={earner.id} />
              )}
              {!isChild && (selectedCategory === 'all' || selectedCategory === 'tax') && (
                <>
                  <EarnerTaxSettings earnerId={earner.id} />
                  <TaxSummaryPanel earnerId={earner.id} />
                </>
              )}
            </div>
          );
        })}
      </div>

      {earners.length === 0 && (
        <Card>
          <EmptyState
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            }
            message="Add a member to get started."
          />
        </Card>
      )}
    </div>
  );
}
