interface Props {
  inflationRate: number;
  onInflationRateChange: (rate: number) => void;
  showInflationAdjusted: boolean;
  onToggleInflation: () => void;
}

export default function ChartControls({
  inflationRate,
  onInflationRateChange,
  showInflationAdjusted,
  onToggleInflation,
}: Props) {
  return (
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
          className="w-16 px-1.5 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-500">%</span>
      </div>

      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={showInflationAdjusted}
          onChange={onToggleInflation}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-600">Show inflation-adjusted line</span>
      </label>
    </div>
  );
}
