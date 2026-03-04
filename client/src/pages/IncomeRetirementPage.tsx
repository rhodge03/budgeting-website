import { useHouseholdStore } from '../stores/householdStore';
import EarnerManager from '../components/earners/EarnerManager';
import IncomePanel from '../components/income/IncomePanel';
import ContributionSettings from '../components/income/ContributionSettings';
import RetirementSettingsPanel from '../components/retirement/RetirementSettingsPanel';
import RateOfReturnPanel from '../components/rate-of-return/RateOfReturnPanel';
import EarnerTaxSettings from '../components/tax/EarnerTaxSettings';
import TaxSummaryPanel from '../components/tax/TaxSummaryPanel';

export default function IncomeRetirementPage() {
  const earners = useHouseholdStore((s) => s.earners);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Income & Retirement
      </h2>
      <EarnerManager />

      <div
        className={`grid gap-6 ${
          earners.length > 1 ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {earners.map((earner) => (
          <div key={earner.id} className="space-y-4">
            {earners.length > 1 && (
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                {earner.name}
                {earner.isPrimary && (
                  <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Primary
                  </span>
                )}
              </h3>
            )}
            <IncomePanel earnerId={earner.id} />
            <ContributionSettings earnerId={earner.id} />
            <RetirementSettingsPanel earnerId={earner.id} />
            <RateOfReturnPanel earnerId={earner.id} />
            <EarnerTaxSettings earnerId={earner.id} />
            <TaxSummaryPanel earnerId={earner.id} />
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
