import { useMemo, useState, useCallback } from 'react';
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
import type { HouseholdSnapshot } from 'shared';

type EarnerWithRelations = HouseholdSnapshot['earners'][number];

interface Props {
  earner: EarnerWithRelations;
}

interface ChildProjectionYear {
  age: number;
  balance: number;
  totalContributed: number;
  cumulativeInterest: number;
  annualContribution: number;
  savingsInterest: number;
  savingsGrowth: number;
  balanceReal: number;
  savingsInterestReal: number;
}

interface ChildChartSeries {
  key: keyof ChildProjectionYear;
  label: string;
  color: string;
  fill?: string;
  stackId?: string;
  dashed?: boolean;
}

const AVAILABLE_SERIES: ChildChartSeries[] = [
  { key: 'totalContributed', label: 'Total Contributed', color: '#9ca3af', fill: '#e5e7eb', stackId: 'balance' },
  { key: 'cumulativeInterest', label: 'Cumulative Interest', color: '#10b981', fill: '#6ee7b7', stackId: 'balance' },
  { key: 'balance', label: 'Total Balance', color: '#7c3aed' },
  { key: 'annualContribution', label: 'Annual Contribution', color: '#6366f1' },
  { key: 'savingsInterest', label: 'Savings Interest', color: '#a855f7' },
  { key: 'savingsGrowth', label: 'Total Interest', color: '#7c3aed' },
  { key: 'balanceReal', label: 'Total (Inflation-Adj.)', color: '#f59e0b', dashed: true },
  { key: 'savingsInterestReal', label: 'Interest (Inflation-Adj.)', color: '#fbbf24', dashed: true },
];

const DEFAULT_ENABLED = new Set(['totalContributed', 'cumulativeInterest', 'balance']);

function runChildProjection(earner: EarnerWithRelations, inflationRate: number): ChildProjectionYear[] {
  const savings = earner.savingsBalance;
  const retirement = earner.retirementSettings;
  const ror = earner.rateOfReturn;

  const currentAge = retirement?.currentAge ?? 0;
  const withdrawalAge = retirement?.withdrawalAge ?? 18;
  const monthlyContribution = Number(savings?.monthlyContribution ?? 0);
  const annualRate = Number(ror?.annualRate ?? 10) / 100;
  const startBalance = Number(savings?.generalSavingsBalance ?? 0);
  const inflationMultiplier = 1 + inflationRate / 100;

  // Project until withdrawal age or at least age 30, whichever is greater
  const maxAge = Math.max(withdrawalAge + 5, 30);
  const results: ChildProjectionYear[] = [];

  let balance = startBalance;
  let totalContributed = startBalance;
  let cumulativeGrowth = 0;

  // Starting point
  results.push({
    age: currentAge,
    balance: Math.round(balance),
    totalContributed: Math.round(totalContributed),
    cumulativeInterest: 0,
    annualContribution: 0,
    savingsInterest: 0,
    savingsGrowth: 0,
    balanceReal: Math.round(balance),
    savingsInterestReal: 0,
  });

  for (let age = currentAge + 1; age <= maxAge; age++) {
    const y = age - currentAge;
    let yearContribution = 0;
    // Add contributions if before withdrawal age
    if (age <= withdrawalAge) {
      yearContribution = monthlyContribution * 12;
      balance += yearContribution;
      totalContributed += yearContribution;
    }

    // Grow with rate of return
    const interest = balance * annualRate;
    balance += interest;
    cumulativeGrowth += interest;

    const inflationFactor = Math.pow(inflationMultiplier, y);

    results.push({
      age,
      balance: Math.round(balance),
      totalContributed: Math.round(totalContributed),
      cumulativeInterest: Math.round(balance - totalContributed),
      annualContribution: Math.round(yearContribution),
      savingsInterest: Math.round(interest),
      savingsGrowth: Math.round(cumulativeGrowth),
      balanceReal: Math.round(balance / inflationFactor),
      savingsInterestReal: Math.round(interest / inflationFactor),
    });
  }

  return results;
}

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

const tooltipFormatter = (value: number | undefined) =>
  value != null ? `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '';

export default function ChildSavingsChart({ earner }: Props) {
  const [inflationRate, setInflationRate] = useState(3);
  const data = useMemo(() => runChildProjection(earner, inflationRate), [earner, inflationRate]);
  const withdrawalAge = earner.retirementSettings?.withdrawalAge ?? 18;
  const [showTable, setShowTable] = useState(false);
  const [enabledSeries, setEnabledSeries] = useState(() => new Set(DEFAULT_ENABLED));

  const handleToggle = useCallback((key: string) => {
    setEnabledSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500">Set age and savings details to see projections.</p>
      </div>
    );
  }

  const atWithdrawal = data.find((d) => d.age === withdrawalAge);
  const finalYear = data[data.length - 1];
  const activeSeries = AVAILABLE_SERIES.filter((s) => enabledSeries.has(s.key));

  return (
    <div className="space-y-4">
      {/* Controls row */}
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
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-16 px-1.5 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-500">%</span>
          </div>
        </div>

        {/* Series toggles */}
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_SERIES.map((s) => {
            const active = enabledSeries.has(s.key);
            return (
              <button
                key={s.key}
                onClick={() => handleToggle(s.key)}
                className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors ${
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {atWithdrawal && (
          <div className="bg-white rounded-lg border border-purple-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">At Withdrawal (Age {withdrawalAge})</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">
              ${atWithdrawal.balance.toLocaleString('en-US')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ${atWithdrawal.totalContributed.toLocaleString('en-US')} contributed
              {' | '}
              ${atWithdrawal.balanceReal.toLocaleString('en-US')} inflation-adj.
            </p>
          </div>
        )}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Contributed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${(atWithdrawal ?? finalYear).totalContributed.toLocaleString('en-US')}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Cumulative Interest</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            ${(atWithdrawal ?? finalYear).cumulativeInterest.toLocaleString('en-US')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            at {Number(earner.rateOfReturn?.annualRate ?? 10)}% annual return
          </p>
        </div>
      </div>

      {/* Chart */}
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

            <ReferenceLine
              x={withdrawalAge}
              stroke="#7c3aed"
              strokeDasharray="4 4"
              label={{ value: 'Withdraw', position: 'top', fontSize: 12, fill: '#7c3aed' }}
            />

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
      </div>

      {/* Year-by-year table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Year-by-Year Breakdown</h3>
          <button
            onClick={() => setShowTable(!showTable)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {showTable ? 'Hide' : 'Show'}
          </button>
        </div>
        {showTable && (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Age</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Contributed</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Interest</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Cumul. Interest</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Balance</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Balance (Real)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row) => (
                  <tr
                    key={row.age}
                    className={row.age === withdrawalAge ? 'bg-purple-50 font-medium' : ''}
                  >
                    <td className="px-3 py-1.5">{row.age}</td>
                    <td className="px-3 py-1.5 text-right">${row.totalContributed.toLocaleString('en-US')}</td>
                    <td className="px-3 py-1.5 text-right text-purple-600">${row.savingsInterest.toLocaleString('en-US')}</td>
                    <td className="px-3 py-1.5 text-right text-green-600">${row.cumulativeInterest.toLocaleString('en-US')}</td>
                    <td className="px-3 py-1.5 text-right font-medium">${row.balance.toLocaleString('en-US')}</td>
                    <td className="px-3 py-1.5 text-right text-amber-600">${row.balanceReal.toLocaleString('en-US')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
