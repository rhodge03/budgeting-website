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
import type { ProjectionYear } from '../../utils/projectionEngine';

interface Props {
  data: ProjectionYear[];
  showInflationAdjusted: boolean;
  retirementAge?: number;
  retirementGoal?: number;
}

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

const tooltipFormatter = (value: number | undefined) =>
  value != null ? `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '';

export default function ProjectionChart({ data, showInflationAdjusted, retirementAge, retirementGoal }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500">
          Add earner details (income, savings, retirement age) to see projections.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="age"
            label={{ value: 'Age', position: 'insideBottom', offset: -2 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
            width={65}
          />
          <Tooltip
            formatter={tooltipFormatter}
            labelFormatter={(age) => `Age ${age}`}
            contentStyle={{ fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />

          {retirementGoal && retirementGoal > 0 && (
            <ReferenceLine
              y={retirementGoal}
              stroke="#f59e0b"
              strokeDasharray="6 4"
              label={{ value: 'Goal', position: 'right', fontSize: 12, fill: '#f59e0b' }}
            />
          )}

          {retirementAge && (
            <ReferenceLine
              x={retirementAge}
              stroke="#6b7280"
              strokeDasharray="4 4"
              label={{ value: 'Retire', position: 'top', fontSize: 12, fill: '#6b7280' }}
            />
          )}

          <Area
            type="monotone"
            dataKey="fourOneK"
            name="401(k)"
            stackId="1"
            stroke="#3b82f6"
            fill="#93c5fd"
            fillOpacity={0.6}
          />
          <Area
            type="monotone"
            dataKey="generalSavings"
            name="General Savings"
            stackId="1"
            stroke="#10b981"
            fill="#6ee7b7"
            fillOpacity={0.6}
          />

          <Area
            type="monotone"
            dataKey="investmentGrowth"
            name="Interest Earned"
            stroke="#8b5cf6"
            fill="none"
            strokeWidth={2}
          />

          {showInflationAdjusted && (
            <>
              <Area
                type="monotone"
                dataKey="totalSavingsReal"
                name="Total (Inflation-Adjusted)"
                stroke="#f59e0b"
                fill="none"
                strokeDasharray="5 3"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="investmentGrowthReal"
                name="Interest (Inflation-Adjusted)"
                stroke="#a78bfa"
                fill="none"
                strokeDasharray="5 3"
                strokeWidth={2}
              />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
