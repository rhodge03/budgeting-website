import type { TooltipContentProps } from 'recharts';

const defaultFormat = (n: number) =>
  `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

interface ChartTooltipExtraProps {
  labelPrefix?: string;
  formatValue?: (value: number) => string;
}

export default function ChartTooltip({
  active,
  payload,
  label,
  labelPrefix = 'Age',
  formatValue = defaultFormat,
}: Partial<TooltipContentProps<number, string>> & ChartTooltipExtraProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-100 px-3 py-2">
      <p className="text-xs font-medium text-gray-500 mb-1">
        {labelPrefix} {label}
      </p>
      <div className="space-y-0.5">
        {payload.map((entry) => (
          <div key={String(entry.dataKey)} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}</span>
            </span>
            <span className="font-medium text-gray-900 tabular-nums">
              {formatValue(entry.value as number)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
