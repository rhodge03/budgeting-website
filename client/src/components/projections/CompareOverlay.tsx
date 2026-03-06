import {
  LineChart,
  Line,
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
  retirementAge?: number;
}

const fmt = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export default function CompareOverlay({ scenarios, retirementAge }: Props) {
  // Merge scenario data by age index
  const merged = useMergedData(scenarios);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={merged} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="age" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={60} />
        <Tooltip
          formatter={(value: number | undefined) => value != null ? fmt(value) : ''}
          labelFormatter={(age) => `Age ${age}`}
        />
        <Legend />
        {retirementAge && (
          <ReferenceLine
            x={retirementAge}
            stroke="#d97706"
            strokeDasharray="4 4"
            label={{ value: 'Retire', position: 'top', fontSize: 10, fill: '#d97706' }}
          />
        )}
        {scenarios.map((s) => (
          <Line
            key={s.id}
            type="monotone"
            dataKey={`${s.id}_netWorth`}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function useMergedData(scenarios: ScenarioProjection[]) {
  // Find the max length across all scenarios
  const maxLen = Math.max(...scenarios.map((s) => s.data.length), 0);
  const merged: Record<string, number>[] = [];

  for (let i = 0; i < maxLen; i++) {
    const point: Record<string, number> = {};
    // Use age from the first scenario that has this index
    for (const s of scenarios) {
      if (s.data[i]) {
        point.age = s.data[i].age;
        break;
      }
    }
    for (const s of scenarios) {
      if (s.data[i]) {
        point[`${s.id}_netWorth`] = s.data[i].netWorth;
      }
    }
    merged.push(point);
  }

  return merged;
}
