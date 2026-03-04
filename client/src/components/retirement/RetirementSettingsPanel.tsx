import { useHouseholdStore } from '../../stores/householdStore';
import * as retirementApi from '../../api/retirement';
import CurrencyInput from '../shared/CurrencyInput';

interface Props {
  earnerId: string;
}

export default function RetirementSettingsPanel({ earnerId }: Props) {
  const earner = useHouseholdStore((s) => s.earners.find((e) => e.id === earnerId));
  const patchEarnerData = useHouseholdStore((s) => s.patchEarnerData);
  const settings = earner?.retirementSettings;

  if (!earner) return null;

  // Use defaults if no settings exist yet
  const currentAge = settings ? Number(settings.currentAge) : 30;
  const targetRetirementAge = settings ? Number(settings.targetRetirementAge) : 65;
  const withdrawalAge = settings ? Number(settings.withdrawalAge) : 59;
  const retirementGoal = settings ? Number(settings.retirementGoal) : 0;

  const handleChange = async (field: string, value: number) => {
    const updated = { ...settings, [field]: value } as any;
    patchEarnerData(earner.id, { retirementSettings: updated });
    await retirementApi.update(earner.id, { [field]: value });
  };

  const yearsUntilRetirement = Math.max(0, targetRetirementAge - currentAge);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
        Retirement Settings
      </h3>

      <div className="space-y-4">
        {/* Age Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AgeSlider
            label="Current Age"
            value={currentAge}
            min={18}
            max={80}
            onChange={(v) => handleChange('currentAge', v)}
          />
          <AgeSlider
            label="Target Retirement Age"
            value={targetRetirementAge}
            min={30}
            max={80}
            onChange={(v) => handleChange('targetRetirementAge', v)}
          />
          <AgeSlider
            label="401(k) Withdrawal Age"
            value={withdrawalAge}
            min={55}
            max={75}
            onChange={(v) => handleChange('withdrawalAge', v)}
          />
        </div>

        {/* Years until retirement */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">{yearsUntilRetirement}</span> years until retirement
        </div>

        {/* Retirement Goal */}
        <CurrencyInput
          label="Retirement Savings Goal"
          value={retirementGoal}
          onChange={(v) => handleChange('retirementGoal', v)}
        />

        {/* Progress bar (only if goal > 0) */}
        {retirementGoal > 0 && earner.savingsBalance && (
          <RetirementProgress
            current={Number(earner.savingsBalance.generalSavingsBalance) + Number(earner.savingsBalance.fourOneKBalance)}
            goal={retirementGoal}
          />
        )}
      </div>
    </div>
  );
}

function AgeSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v >= min && v <= max) onChange(v);
          }}
          className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function RetirementProgress({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(100, (current / goal) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>
          ${current.toLocaleString('en-US', { maximumFractionDigits: 0 })} saved
        </span>
        <span>{pct.toFixed(1)}% of goal</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${pct >= 100 ? 'bg-green-500' : 'bg-blue-600'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
