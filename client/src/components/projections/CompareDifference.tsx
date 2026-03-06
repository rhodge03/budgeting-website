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

const fmtAxis = (v: number) => {
  const sign = v >= 0 ? '' : '-';
  return `${sign}$${(Math.abs(v) / 1000).toFixed(0)}k`;
};
const fmtTooltip = (n: number) => {
  const sign = n >= 0 ? '+' : '-';
  return `${sign}$${Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

export default function CompareDifference({ scenarios, baselineId, retirementAge }: Props) {
  if (scenarios.length < 2) {
    return <p className="text-sm text-gray-400 text-center py-8">Select at least 2 scenarios to compare</p>;
  }

  const scenarioA = scenarios.find((s) => s.id === baselineId) ?? scenarios[0];
  const scenarioB = scenarios.find((s) => s.id !== scenarioA.id)!;

  const maxLen = Math.max(scenarioA.data.length, scenarioB.data.length);
  const data: { age: number; delta: number }[] = [];

  for (let i = 0; i < maxLen; i++) {
    const age = scenarioA.data[i]?.age ?? scenarioB.data[i]?.age ?? i;
    const aVal = scenarioA.data[i]?.netWorth ?? 0;
    const bVal = scenarioB.data[i]?.netWorth ?? 0;
    // Positive = scenario A is ahead, negative = scenario B is ahead
    data.push({ age, delta: aVal - bVal });
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-4 text-xs mb-2">
        <span className="flex items-center gap-1.5">
          <span className="text-green-600 font-medium">+ Above zero</span>
          <span className="text-gray-400">=</span>
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: scenarioA.color }} />
          <span className="font-medium">{scenarioA.name}</span>
          <span className="text-gray-400">is ahead</span>
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1.5">
          <span className="text-red-500 font-medium">- Below zero</span>
          <span className="text-gray-400">=</span>
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: scenarioB.color }} />
          <span className="font-medium">{scenarioB.name}</span>
          <span className="text-gray-400">is ahead</span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#16a34a" stopOpacity={0.05} />
              <stop offset="50%" stopColor="#dc2626" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="age" tick={{ fontSize: 11 }} />
          <YAxis
            tickFormatter={fmtAxis}
            tick={{ fontSize: 11 }}
            width={70}
          />
          <Tooltip
            formatter={(value: number | undefined) => {
              if (value == null) return '';
              const label = value >= 0
                ? `${scenarioA.name} ahead by`
                : `${scenarioB.name} ahead by`;
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
          <Area
            type="monotone"
            dataKey="delta"
            name="Difference"
            stroke="#6b7280"
            fill="url(#splitColor)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
