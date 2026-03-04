import { useHouseholdStore } from '../../stores/householdStore';
import * as savingsApi from '../../api/savings';
import CurrencyInput from '../shared/CurrencyInput';
import PercentageInput from '../shared/PercentageInput';

interface Props {
  earnerId: string;
}

export default function ContributionSettings({ earnerId }: Props) {
  const earner = useHouseholdStore((s) => s.earners.find((e) => e.id === earnerId));
  const patchEarnerData = useHouseholdStore((s) => s.patchEarnerData);
  const savings = earner?.savingsBalance;

  if (!earner || !savings) return null;

  const handleChange = async (field: string, value: number) => {
    // Optimistically update the store
    patchEarnerData(earner.id, {
      savingsBalance: { ...savings, [field]: value },
    });
    // Persist to API
    await savingsApi.update(earner.id, { [field]: value });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
        Savings & 401(k)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CurrencyInput
          label="General Savings Balance"
          value={Number(savings.generalSavingsBalance)}
          onChange={(v) => handleChange('generalSavingsBalance', v)}
        />
        <CurrencyInput
          label="401(k) Balance"
          value={Number(savings.fourOneKBalance)}
          onChange={(v) => handleChange('fourOneKBalance', v)}
        />
        <PercentageInput
          label="401(k) Contribution %"
          value={Number(savings.contributionPercent)}
          onChange={(v) => handleChange('contributionPercent', v)}
        />
        <PercentageInput
          label="Employer Match %"
          value={Number(savings.employerMatchPercent)}
          onChange={(v) => handleChange('employerMatchPercent', v)}
        />
        <PercentageInput
          label="Expected Salary Growth %"
          value={Number(savings.salaryGrowthRate)}
          onChange={(v) => handleChange('salaryGrowthRate', v)}
        />
      </div>
    </div>
  );
}
