import { AVAILABLE_SERIES } from './ProjectionChart';

interface Props {
  inflationRate: number;
  onInflationRateChange: (rate: number) => void;
  ssClaimingAge: number;
  onSsClaimingAgeChange: (age: number) => void;
  maxAge: number;
  onMaxAgeChange: (age: number) => void;
  enabledSeries: Set<string>;
  onToggleSeries: (key: string) => void;
}

export default function ChartControls({
  inflationRate,
  onInflationRateChange,
  ssClaimingAge,
  onSsClaimingAgeChange,
  maxAge,
  onMaxAgeChange,
  enabledSeries,
  onToggleSeries,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500">Inflation Rate</label>
          <input
            type="number"
            min={0}
            max={20}
            step={0.5}
            value={inflationRate}
            onChange={(e) => onInflationRateChange(Number(e.target.value))}
            className="w-16 px-1.5 py-1 text-xs text-center border border-gray-300 rounded-lg"
          />
          <span className="text-xs text-gray-500">%</span>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500">Max Age</label>
          <input
            type="number"
            min={50}
            max={120}
            value={maxAge}
            onChange={(e) => onMaxAgeChange(Math.min(120, Math.max(50, Number(e.target.value))))}
            className="w-14 px-1.5 py-1 text-xs text-center border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-500">SS Claiming Age</label>
          <input
            type="number"
            min={62}
            max={70}
            value={ssClaimingAge}
            onChange={(e) => onSsClaimingAgeChange(Math.min(70, Math.max(62, Number(e.target.value))))}
            className="w-14 px-1.5 py-1 text-xs text-center border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {AVAILABLE_SERIES.map((s) => {
          const active = enabledSeries.has(s.key);
          return (
            <button
              key={s.key}
              onClick={() => onToggleSeries(s.key)}
              className={`px-2 py-0.5 text-[11px] rounded-lg border transition-colors ${
                active
                  ? 'text-white border-transparent'
                  : 'text-gray-500 border-gray-300 bg-white hover:bg-gray-50'
              }`}
              style={active ? { backgroundColor: s.color, borderColor: s.color } : undefined}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
