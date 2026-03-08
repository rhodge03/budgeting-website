import { useHouseholdStore } from '../../stores/householdStore';
import Card from '../shared/Card';
import CurrencyInput from '../shared/CurrencyInput';
import PercentageInput from '../shared/PercentageInput';
import SectionHeader from '../shared/SectionHeader';

interface Props {
  earnerId: string;
}

export default function ContributionSettings({ earnerId }: Props) {
  const earner = useHouseholdStore((s) => s.earners.find((e) => e.id === earnerId));
  const updateSavings = useHouseholdStore((s) => s.updateSavings);
  const savings = earner?.savingsBalance;

  if (!earner || !savings) return null;

  const isChild = earner.memberType === 'child';

  const handleChange = async (field: string, value: number) => {
    await updateSavings(earner.id, { [field]: value });
  };

  return (
    <Card>
      <SectionHeader className="mb-4">
        {isChild ? 'Savings' : 'Savings & 401(k)'}
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CurrencyInput
          label="Savings Balance"
          value={Number(savings.generalSavingsBalance)}
          onChange={(v) => handleChange('generalSavingsBalance', v)}
        />
        {isChild && (
          <CurrencyInput
            label="Monthly Contribution"
            value={Number(savings.monthlyContribution)}
            onChange={(v) => handleChange('monthlyContribution', v)}
          />
        )}
        {!isChild && (
          <>
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
          </>
        )}
      </div>
    </Card>
  );
}
