import { useState, useEffect } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import * as savingsApi from '../../api/savings';
import CurrencyInput from '../shared/CurrencyInput';
import PercentageInput from '../shared/PercentageInput';
import { useAutoSave } from '../../hooks/useAutoSave';

export default function ContributionSettings() {
  const { earners, selectedEarnerId } = useHouseholdStore();
  const earner = earners.find((e) => e.id === selectedEarnerId);
  const savings = earner?.savingsBalance;

  const [formData, setFormData] = useState({
    generalSavingsBalance: 0,
    fourOneKBalance: 0,
    contributionPercent: 0,
    employerMatchPercent: 0,
    salaryGrowthRate: 0,
  });

  // Sync form data from snapshot
  useEffect(() => {
    if (savings) {
      setFormData({
        generalSavingsBalance: Number(savings.generalSavingsBalance),
        fourOneKBalance: Number(savings.fourOneKBalance),
        contributionPercent: Number(savings.contributionPercent),
        employerMatchPercent: Number(savings.employerMatchPercent),
        salaryGrowthRate: Number(savings.salaryGrowthRate),
      });
    }
  }, [savings]);

  useAutoSave({
    data: formData,
    enabled: !!earner,
    onSave: async (data) => {
      if (!earner) return;
      await savingsApi.update(earner.id, data);
    },
  });

  if (!earner) return null;

  const updateField = (field: keyof typeof formData) => (value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
        Savings & 401(k)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CurrencyInput
          label="General Savings Balance"
          value={formData.generalSavingsBalance}
          onChange={updateField('generalSavingsBalance')}
        />
        <CurrencyInput
          label="401(k) Balance"
          value={formData.fourOneKBalance}
          onChange={updateField('fourOneKBalance')}
        />
        <PercentageInput
          label="401(k) Contribution %"
          value={formData.contributionPercent}
          onChange={updateField('contributionPercent')}
        />
        <PercentageInput
          label="Employer Match %"
          value={formData.employerMatchPercent}
          onChange={updateField('employerMatchPercent')}
        />
        <PercentageInput
          label="Expected Salary Growth %"
          value={formData.salaryGrowthRate}
          onChange={updateField('salaryGrowthRate')}
        />
      </div>
    </div>
  );
}
