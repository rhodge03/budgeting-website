import { useHouseholdStore } from '../../stores/householdStore';
import Card from '../shared/Card';
import PercentageInput from '../shared/PercentageInput';
import SectionHeader from '../shared/SectionHeader';

const BENCHMARKS: { key: string; label: string; rate: number }[] = [
  { key: 'sp500', label: 'S&P 500', rate: 10.0 },
  { key: 'dow', label: 'Dow Jones', rate: 7.0 },
  { key: 'gold', label: 'Gold', rate: 4.5 },
];

interface Props {
  earnerId: string;
}

export default function RateOfReturnPanel({ earnerId }: Props) {
  const earner = useHouseholdStore((s) => s.earners.find((e) => e.id === earnerId));
  const updateRateOfReturn = useHouseholdStore((s) => s.updateRateOfReturn);
  const ror = earner?.rateOfReturn;

  if (!earner) return null;

  const annualRate = ror ? Number(ror.annualRate) : 10.0;
  const benchmarkType = ror?.benchmarkType || null;

  const handleRateChange = async (value: number) => {
    await updateRateOfReturn(earner.id, { annualRate: value, benchmarkType: null });
  };

  const handleBenchmarkClick = async (benchmark: typeof BENCHMARKS[number]) => {
    if (benchmarkType === benchmark.key) {
      await updateRateOfReturn(earner.id, { benchmarkType: null });
      return;
    }
    await updateRateOfReturn(earner.id, {
      annualRate: benchmark.rate,
      benchmarkType: benchmark.key as 'sp500' | 'dow' | 'gold',
    });
  };

  return (
    <Card>
      <SectionHeader className="mb-4">Expected Rate of Return</SectionHeader>

      <div className="space-y-4">
        {/* Benchmark buttons */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Benchmark Presets
          </label>
          <div className="flex gap-2">
            {BENCHMARKS.map((b) => (
              <button
                key={b.key}
                onClick={() => handleBenchmarkClick(b)}
                className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                  benchmarkType === b.key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {b.label} ({b.rate}%)
              </button>
            ))}
          </div>
        </div>

        {/* Custom rate input */}
        <PercentageInput
          label="Annual Rate of Return"
          value={annualRate}
          onChange={handleRateChange}
        />

        <p className="text-xs text-gray-500">
          Historical average: S&P 500 ~10%, Dow Jones ~7%, Gold ~4.5% (nominal, pre-inflation).
        </p>
      </div>
    </Card>
  );
}
