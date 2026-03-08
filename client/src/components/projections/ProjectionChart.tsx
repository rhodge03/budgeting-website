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
import Card from '../shared/Card';
import type { ProjectionYear } from '../../utils/projectionEngine';
import ChartTooltip from '../shared/ChartTooltip';

export interface ChartSeries {
  key: keyof ProjectionYear;
  label: string;
  color: string;
  fill?: string;       // if set, renders as filled area
  stackId?: string;    // if set, stacks with others of same id
  dashed?: boolean;
}

export const AVAILABLE_SERIES: ChartSeries[] = [
  { key: 'fourOneK',              label: '401(k) Balance',             color: '#3b82f6', fill: '#93c5fd', stackId: 'balance' },
  { key: 'generalSavings',       label: 'Savings Balance',            color: '#10b981', fill: '#6ee7b7', stackId: 'balance' },
  { key: 'homeEquity',           label: 'Home Equity',                color: '#f59e0b', fill: '#fde68a', stackId: 'balance' },
  { key: 'netWorth',             label: 'Net Worth',                  color: '#0f172a' },
  { key: 'totalIncome',          label: 'Income',                     color: '#6366f1' },
  { key: 'totalTax',             label: 'Taxes',                      color: '#ef4444' },
  { key: 'totalExpenses',        label: 'Expenses',                   color: '#f97316' },
  { key: 'totalContributions401k', label: '401(k) Contrib.',          color: '#0ea5e9' },
  { key: 'totalEmployerMatch',   label: 'Employer Match',             color: '#14b8a6' },
  { key: 'fourOneKGrowth',       label: '401(k) Interest',            color: '#8b5cf6' },
  { key: 'savingsGrowth',        label: 'Savings Interest',           color: '#a855f7' },
  { key: 'investmentGrowth',     label: 'Total Interest',             color: '#7c3aed' },
  { key: 'netCashFlow',          label: 'Net Cash Flow',              color: '#22c55e' },
  { key: 'netWorthReal',         label: 'Net Worth (Infl-Adj.)',      color: '#78350f', dashed: true },
  { key: 'investmentGrowthReal', label: 'Interest (Inflation-Adj.)',  color: '#fbbf24', dashed: true },
  { key: 'savingsGrowthReal',   label: 'Sav. Interest (Infl-Adj.)', color: '#92400e', dashed: true },
];

export const DEFAULT_SERIES: string[] = [
  'fourOneK', 'generalSavings', 'investmentGrowth',
];

interface Props {
  data: ProjectionYear[];
  enabledSeries: Set<string>;
  retirementAge?: number;
  retirementGoal?: number;
}

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};



export default function ProjectionChart({ data, enabledSeries, retirementAge, retirementGoal }: Props) {
  if (data.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-sm text-gray-500">
          Add earner details (income, savings, retirement age) to see projections.
        </p>
      </Card>
    );
  }

  const activeSeries = AVAILABLE_SERIES.filter((s) => enabledSeries.has(s.key));

  return (
    <Card>
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
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 13 }} />

          {retirementGoal && retirementGoal > 0 && enabledSeries.has('netWorth') && (
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

          {activeSeries.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stackId={s.stackId}
              stroke={s.color}
              fill={s.fill || 'none'}
              fillOpacity={s.fill ? 0.6 : 0}
              strokeWidth={2}
              strokeDasharray={s.dashed ? '5 3' : undefined}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
