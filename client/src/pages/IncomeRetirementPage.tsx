import EarnerSelector from '../components/earners/EarnerSelector';
import EarnerManager from '../components/earners/EarnerManager';
import IncomePanel from '../components/income/IncomePanel';
import ContributionSettings from '../components/income/ContributionSettings';
import RetirementSettingsPanel from '../components/retirement/RetirementSettingsPanel';
import RateOfReturnPanel from '../components/rate-of-return/RateOfReturnPanel';
import EarnerTaxSettings from '../components/tax/EarnerTaxSettings';
import TaxSummaryPanel from '../components/tax/TaxSummaryPanel';

export default function IncomeRetirementPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Income & Retirement
      </h2>
      <EarnerSelector />
      <EarnerManager />
      <IncomePanel />
      <ContributionSettings />
      <RetirementSettingsPanel />
      <RateOfReturnPanel />
      <EarnerTaxSettings />
      <TaxSummaryPanel />
    </div>
  );
}
