import { useMemo, useState } from 'react';
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
  interestEarned: number;
}

function runChildProjection(earner: EarnerWithRelations): ChildProjectionYear[] {
  const savings = earner.savingsBalance;
  const retirement = earner.retirementSettings;
  const ror = earner.rateOfReturn;

  const currentAge = retirement?.currentAge ?? 0;
  const withdrawalAge = retirement?.withdrawalAge ?? 18;
  const monthlyContribution = Number(savings?.monthlyContribution ?? 0);
  const annualRate = Number(ror?.annualRate ?? 10) / 100;
  const startBalance = Number(savings?.generalSavingsBalance ?? 0);

  // Project until withdrawal age or at least age 30, whichever is greater
  const maxAge = Math.max(withdrawalAge + 5, 30);
  const results: ChildProjectionYear[] = [];

  let balance = startBalance;
  let totalContributed = startBalance;

  // Starting point
  results.push({
    age: currentAge,
    balance: Math.round(balance),
    totalContributed: Math.round(totalContributed),
    interestEarned: 0,
  });

  for (let age = currentAge + 1; age <= maxAge; age++) {
    // Add contributions if before withdrawal age
    if (age <= withdrawalAge) {
      const annualContribution = monthlyContribution * 12;
      balance += annualContribution;
      totalContributed += annualContribution;
    }

    // Grow with rate of return
    balance = balance * (1 + annualRate);

    results.push({
      age,
      balance: Math.round(balance),
      totalContributed: Math.round(totalContributed),
      interestEarned: Math.round(balance - totalContributed),
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
  const data = useMemo(() => runChildProjection(earner), [earner]);
  const withdrawalAge = earner.retirementSettings?.withdrawalAge ?? 18;
  const [showTable, setShowTable] = useState(false);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500">Set age and savings details to see projections.</p>
      </div>
    );
  }

  const atWithdrawal = data.find((d) => d.age === withdrawalAge);
  const finalYear = data[data.length - 1];

  return (
    <div className="space-y-4">
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
          <p className="text-xs text-gray-500 uppercase tracking-wide">Interest Earned</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            ${(atWithdrawal ?? finalYear).interestEarned.toLocaleString('en-US')}
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

            <Area
              type="monotone"
              dataKey="totalContributed"
              name="Total Contributed"
              stackId="savings"
              stroke="#9ca3af"
              fill="#e5e7eb"
              fillOpacity={0.8}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="interestEarned"
              name="Interest Earned"
              stackId="savings"
              stroke="#10b981"
              fill="#6ee7b7"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="balance"
              name="Total Balance"
              stroke="#7c3aed"
              fill="none"
              strokeWidth={2}
            />
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Age</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Contributed</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Interest</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row) => (
                  <tr
                    key={row.age}
                    className={row.age === withdrawalAge ? 'bg-purple-50 font-medium' : ''}
                  >
                    <td className="px-4 py-1.5">{row.age}</td>
                    <td className="px-4 py-1.5 text-right">${row.totalContributed.toLocaleString('en-US')}</td>
                    <td className="px-4 py-1.5 text-right text-green-600">${row.interestEarned.toLocaleString('en-US')}</td>
                    <td className="px-4 py-1.5 text-right font-medium">${row.balance.toLocaleString('en-US')}</td>
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
