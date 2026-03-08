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
} from 'recharts';
import Card from '../shared/Card';
import type { HomePurchase } from 'shared';
import { computeHomeEquitySchedule } from 'shared';
import ChartTooltip from '../shared/ChartTooltip';

interface Props {
  homePurchase: HomePurchase;
}

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};



const fmt = (n: number) =>
  `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export default function HomeEquityChart({ homePurchase }: Props) {
  const data = useMemo(() => computeHomeEquitySchedule(homePurchase), [homePurchase]);
  const [showTable, setShowTable] = useState(false);

  if (data.length === 0) return null;

  const finalYear = data[data.length - 1];
  const at5 = data.find((d) => d.year === 5);
  const at10 = data.find((d) => d.year === 10);
  const at15 = data.find((d) => d.year === 15);

  return (
    <div className="space-y-3 mt-3">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {at5 && (
          <Card accent="blue">
            <p className="text-[11px] text-gray-500">Year 5</p>
            <p className="text-lg font-bold text-blue-700">{fmt(at5.equity)}</p>
            <p className="text-[11px] text-gray-400">Home: {fmt(at5.homeValue)}</p>
          </Card>
        )}
        {at10 && (
          <Card accent="blue">
            <p className="text-[11px] text-gray-500">Year 10</p>
            <p className="text-lg font-bold text-blue-700">{fmt(at10.equity)}</p>
            <p className="text-[11px] text-gray-400">Home: {fmt(at10.homeValue)}</p>
          </Card>
        )}
        {at15 && (
          <Card accent="blue">
            <p className="text-[11px] text-gray-500">Year 15</p>
            <p className="text-lg font-bold text-blue-700">{fmt(at15.equity)}</p>
            <p className="text-[11px] text-gray-400">Home: {fmt(at15.homeValue)}</p>
          </Card>
        )}
        <Card accent="green">
          <p className="text-[11px] text-gray-500">Year {finalYear.year}</p>
          <p className="text-lg font-bold text-green-700">{fmt(finalYear.equity)}</p>
          <p className="text-[11px] text-gray-400">Interest: {fmt(finalYear.totalInterest)}</p>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              label={{ value: 'Year', position: 'insideBottom', offset: -2 }}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 11 }}
              width={60}
            />
            <Tooltip content={<ChartTooltip labelPrefix="Year" />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="homeValue"
              name="Home Value"
              stroke="#10b981"
              fill="#d1fae5"
              fillOpacity={0.5}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="loanBalance"
              name="Loan Balance"
              stroke="#ef4444"
              fill="#fecaca"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="equity"
              name="Equity"
              stroke="#3b82f6"
              fill="#bfdbfe"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Year-by-year table */}
      <Card padding={false} className="overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
          <h4 className="text-xs font-semibold text-gray-900">Year-by-Year Breakdown</h4>
          <button
            onClick={() => setShowTable(!showTable)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {showTable ? 'Hide' : 'Show'}
          </button>
        </div>
        {showTable && (
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500">Year</th>
                  <th className="px-2 py-1.5 text-right text-xs font-medium text-gray-500">Home Value</th>
                  <th className="px-2 py-1.5 text-right text-xs font-medium text-gray-500">Loan Balance</th>
                  <th className="px-2 py-1.5 text-right text-xs font-medium text-gray-500">Equity</th>
                  <th className="px-2 py-1.5 text-right text-xs font-medium text-gray-500">Total Paid</th>
                  <th className="px-2 py-1.5 text-right text-xs font-medium text-gray-500">Total Interest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row) => (
                  <tr key={row.year}>
                    <td className="px-2 py-1">{row.year}</td>
                    <td className="px-2 py-1 text-right text-green-600">{fmt(row.homeValue)}</td>
                    <td className="px-2 py-1 text-right text-red-600">{fmt(row.loanBalance)}</td>
                    <td className="px-2 py-1 text-right text-blue-600 font-medium">{fmt(row.equity)}</td>
                    <td className="px-2 py-1 text-right">{fmt(row.totalPaid)}</td>
                    <td className="px-2 py-1 text-right text-gray-500">{fmt(row.totalInterest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
