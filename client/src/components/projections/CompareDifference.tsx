import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { ScenarioProjection } from './ScenarioCompare';

interface Props {
  scenarios: ScenarioProjection[];
  baselineId: string;
  retirementAge?: number;
}

const fmt = (n: number) => {
  const sign = n >= 0 ? '+' : '-';
  return `${sign}$${Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

export default function CompareDifference({ scenarios, baselineId, retirementAge }: Props) {
  const baseline = scenarios.find((s) => s.id === baselineId);
  const others = scenarios.filter((s) => s.id !== baselineId);

  if (!baseline || others.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">Select at least 2 scenarios to compare differences</p>;
  }

  // Build merged delta data
  const maxLen = Math.max(baseline.data.length, ...others.map((s) => s.data.length));
  const merged: Record<string, number>[] = [];

  for (let i = 0; i < maxLen; i++) {
    const baseVal = baseline.data[i]?.netWorth ?? 0;
    const point: Record<string, number> = {
      age: baseline.data[i]?.age ?? i,
    };
    for (const s of others) {
      const val = s.data[i]?.netWorth ?? 0;
      point[`${s.id}_delta`] = val - baseVal;
    }
    merged.push(point);
  }

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">
        Difference from baseline: <span className="font-medium text-gray-700">{baseline.name}</span>
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={merged} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="age" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={60} />
          <Tooltip
            formatter={(value: number | undefined) => value != null ? fmt(value) : ''}
            labelFormatter={(age) => `Age ${age}`}
          />
          <Legend />
          <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />
          {retirementAge && (
            <ReferenceLine
              x={retirementAge}
              stroke="#d97706"
              strokeDasharray="4 4"
              label={{ value: 'Retire', position: 'top', fontSize: 10, fill: '#d97706' }}
            />
          )}
          {others.map((s) => (
            <Area
              key={s.id}
              type="monotone"
              dataKey={`${s.id}_delta`}
              name={`${s.name} vs ${baseline.name}`}
              stroke={s.color}
              fill={s.color}
              fillOpacity={0.15}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
