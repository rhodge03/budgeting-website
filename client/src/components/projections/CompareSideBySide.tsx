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
  retirementAge?: number;
}

const fmt = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export default function CompareSideBySide({ scenarios, retirementAge }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {scenarios.map((s) => (
        <div key={s.id}>
          <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={s.data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="age" tick={{ fontSize: 9 }} />
              <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 9 }} width={50} />
              <Tooltip
                formatter={(value: number | undefined) => value != null ? fmt(value) : ''}
                labelFormatter={(age) => `Age ${age}`}
              />
              {retirementAge && (
                <ReferenceLine x={retirementAge} stroke="#d97706" strokeDasharray="4 4" />
              )}
              <Area
                type="monotone"
                dataKey="fourOneK"
                name="401(k)"
                stackId="balance"
                stroke="#3b82f6"
                fill="#93c5fd"
              />
              <Area
                type="monotone"
                dataKey="generalSavings"
                name="Savings"
                stackId="balance"
                stroke="#10b981"
                fill="#6ee7b7"
              />
              <Area
                type="monotone"
                dataKey="homeEquity"
                name="Home Equity"
                stackId="balance"
                stroke="#f59e0b"
                fill="#fde68a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
