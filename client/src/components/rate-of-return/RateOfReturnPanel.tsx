import { useHouseholdStore } from '../../stores/householdStore';
import * as rateOfReturnApi from '../../api/rateOfReturn';
import PercentageInput from '../shared/PercentageInput';

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
  const patchEarnerData = useHouseholdStore((s) => s.patchEarnerData);
  const ror = earner?.rateOfReturn;

  if (!earner) return null;

  const annualRate = ror ? Number(ror.annualRate) : 10.0;
  const benchmarkType = ror?.benchmarkType || null;

  const handleRateChange = async (value: number) => {
    const updated = { ...ror, annualRate: value, benchmarkType: null } as any;
    patchEarnerData(earner.id, { rateOfReturn: updated });
    await rateOfReturnApi.update(earner.id, { annualRate: value, benchmarkType: null });
  };

  const handleBenchmarkClick = async (benchmark: typeof BENCHMARKS[number]) => {
    // If already selected, deselect and keep the rate
    if (benchmarkType === benchmark.key) {
      const updated = { ...ror, benchmarkType: null } as any;
      patchEarnerData(earner.id, { rateOfReturn: updated });
      await rateOfReturnApi.update(earner.id, { benchmarkType: null });
      return;
    }

    const updated = { ...ror, annualRate: benchmark.rate, benchmarkType: benchmark.key } as any;
    patchEarnerData(earner.id, { rateOfReturn: updated });
    await rateOfReturnApi.update(earner.id, {
      annualRate: benchmark.rate,
      benchmarkType: benchmark.key as 'sp500' | 'dow' | 'gold',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
        Expected Rate of Return
      </h3>

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
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
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
    </div>
  );
}
