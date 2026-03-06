import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { ScenarioProjection } from './ScenarioCompare';

interface Props {
  scenarios: ScenarioProjection[];
  baselineId: string;
  retirementAge?: number;
}

const fmtAxis = (v: number) => `$${(Math.abs(v) / 1000).toFixed(0)}k`;
const fmtTooltip = (n: number) =>
  `$${Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export default function CompareDifference({ scenarios, baselineId, retirementAge }: Props) {
  if (scenarios.length < 2) {
    return <p className="text-sm text-gray-400 text-center py-8">Select at least 2 scenarios to compare</p>;
  }

  // Use baseline (top) vs first other scenario (bottom)
  const top = scenarios.find((s) => s.id === baselineId) ?? scenarios[0];
  const bottom = scenarios.find((s) => s.id !== top.id)!;

  const maxLen = Math.max(top.data.length, bottom.data.length);
  const data: Record<string, number>[] = [];

  for (let i = 0; i < maxLen; i++) {
    const age = top.data[i]?.age ?? bottom.data[i]?.age ?? i;
    const topVal = top.data[i]?.netWorth ?? 0;
    const bottomVal = bottom.data[i]?.netWorth ?? 0;
    data.push({
      age,
      top: topVal,
      bottom: -bottomVal, // negate so it renders below zero
    });
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-6 text-xs mb-2">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: top.color }} />
          <span className="font-medium">{top.name}</span>
          <span className="text-gray-400">(top)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bottom.color }} />
          <span className="font-medium">{bottom.name}</span>
          <span className="text-gray-400">(bottom)</span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="age" tick={{ fontSize: 11 }} />
          <YAxis
            tickFormatter={fmtAxis}
            tick={{ fontSize: 11 }}
            width={60}
          />
          <Tooltip
            formatter={(value: number | undefined, name: string | undefined) => {
              if (value == null) return '';
              const label = name === 'top' ? top.name : bottom.name;
              return [fmtTooltip(value), label];
            }}
            labelFormatter={(age) => `Age ${age}`}
          />
          <ReferenceLine y={0} stroke="#6b7280" strokeWidth={1.5} />
          {retirementAge && (
            <ReferenceLine
              x={retirementAge}
              stroke="#d97706"
              strokeDasharray="4 4"
              label={{ value: 'Retire', position: 'top', fontSize: 10, fill: '#d97706' }}
            />
          )}
          {/* Top scenario: positive values above zero */}
          <Area
            type="monotone"
            dataKey="top"
            name="top"
            stroke={top.color}
            fill={top.color}
            fillOpacity={0.25}
            strokeWidth={2}
          />
          {/* Bottom scenario: negative values below zero */}
          <Area
            type="monotone"
            dataKey="bottom"
            name="bottom"
            stroke={bottom.color}
            fill={bottom.color}
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
