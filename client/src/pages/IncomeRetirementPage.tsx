import { useEffect } from 'react';
import { useHouseholdStore } from '../stores/householdStore';
import { useEarnerSelectionStore } from '../stores/earnerSelectionStore';
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
    <div
      className="space-y-6 min-h-full rounded-lg p-6 -m-2"
      style={{
        backgroundImage: 'url(/money_background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <h2 className="text-xl font-semibold text-gray-900 drop-shadow-sm">
        {CATEGORY_TITLES[selectedCategory]}
      </h2>
      <EarnerManager />

      <div className="space-y-6">
        {visibleEarners.map((earner) => (
          <div key={earner.id} className="space-y-4">
            {showBadge && (
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {earner.name}
                </h3>
                {earner.isPrimary && (
                  <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Primary
                  </span>
                )}
              </div>
            )}
            {(selectedCategory === 'all' || selectedCategory === 'income') && (
              <IncomePanel earnerId={earner.id} />
            )}
            {(selectedCategory === 'all' || selectedCategory === 'savings') && (
              <ContributionSettings earnerId={earner.id} />
            )}
            {(selectedCategory === 'all' || selectedCategory === 'retirement') && (
              <>
                <RetirementSettingsPanel earnerId={earner.id} />
                <RateOfReturnPanel earnerId={earner.id} />
              </>
            )}
            {(selectedCategory === 'all' || selectedCategory === 'tax') && (
              <>
                <EarnerTaxSettings earnerId={earner.id} />
                <TaxSummaryPanel earnerId={earner.id} />
              </>
            )}
          </div>
        ))}
      </div>

      {earners.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">Add an earner to get started.</p>
        </div>
      )}
    </div>
  );
}
