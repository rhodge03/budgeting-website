import { useHouseholdStore } from '../../stores/householdStore';
import Card from '../shared/Card';
import SectionHeader from '../shared/SectionHeader';
import { STATE_TAX_RATES } from 'shared/constants/taxBrackets';
import type { FilingStatus } from 'shared';

const FILING_STATUSES: { value: FilingStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'married_jointly', label: 'Married Filing Jointly' },
  { value: 'married_separately', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
];

const STATES = Object.entries(STATE_TAX_RATES)
  .sort((a, b) => a[1].name.localeCompare(b[1].name))
  .map(([code, { name, rate }]) => ({
    code,
    name,
    rate,
  }));

interface Props {
  earnerId: string;
}

export default function EarnerTaxSettings({ earnerId }: Props) {
  const earner = useHouseholdStore((s) => s.earners.find((e) => e.id === earnerId));
  const updateEarner = useHouseholdStore((s) => s.updateEarner);

  if (!earner) return null;

  const handleChange = async (field: string, value: string) => {
    await updateEarner(earner.id, { [field]: value } as any);
  };

  return (
    <Card>
      <SectionHeader className="mb-4">Tax Settings</SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* State selector */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            State
          </label>
          <select
            value={earner.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
          >
            {STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} {s.rate > 0 ? `(${(s.rate * 100).toFixed(1)}%)` : '(No income tax)'}
              </option>
            ))}
          </select>
        </div>

        {/* Filing status */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Filing Status
          </label>
          <select
            value={earner.filingStatus}
            onChange={(e) => handleChange('filingStatus', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
          >
            {FILING_STATUSES.map((fs) => (
              <option key={fs.value} value={fs.value}>
                {fs.label}
              </option>
            ))}
          </select>
        </div>

        {/* Deduction type toggle */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Deduction Type
          </label>
          <div className="flex rounded border border-gray-300 overflow-hidden">
            <button
              onClick={() => handleChange('deductionType', 'standard')}
              className={`flex-1 px-3 py-2 text-sm transition-colors ${
                earner.deductionType === 'standard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => handleChange('deductionType', 'itemized')}
              className={`flex-1 px-3 py-2 text-sm transition-colors ${
                earner.deductionType === 'itemized'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Itemized
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
