import { useState } from 'react';
import type { ProjectionYear } from '../../utils/projectionEngine';

interface Props {
  data: ProjectionYear[];
  retirementAge?: number;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0 });

export default function ProjectionTable({ data, retirementAge }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (data.length === 0) return null;

  const displayed = expanded ? data : data.filter((_, i) => i % 5 === 0 || i === data.length - 1);

  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Year-by-Year Breakdown</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          {expanded ? 'Show Summary' : 'Show All Years'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="px-3 py-2 text-left font-medium">Age</th>
              <th className="px-3 py-2 text-right font-medium">Income</th>
              <th className="px-3 py-2 text-right font-medium">Taxes</th>
              <th className="px-3 py-2 text-right font-medium">Expenses</th>
              <th className="px-3 py-2 text-right font-medium">401(k) Contrib.</th>
              <th className="px-3 py-2 text-right font-medium">401(k) Interest</th>
              <th className="px-3 py-2 text-right font-medium">Savings Interest</th>
              <th className="px-3 py-2 text-right font-medium">Net Cash</th>
              <th className="px-3 py-2 text-right font-medium">401(k)</th>
              <th className="px-3 py-2 text-right font-medium">Savings</th>
              <th className="px-3 py-2 text-right font-medium">Home Equity</th>
              <th className="px-3 py-2 text-right font-medium">Net Worth</th>
              <th className="px-3 py-2 text-right font-medium">Real Value</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((row) => {
              const isRetirement = row.age === retirementAge;
              return (
                <tr
                  key={row.age}
                  className={`border-t border-gray-50 ${
                    isRetirement ? 'bg-amber-50 font-medium' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-3 py-1.5 text-gray-700">
                    {row.age}
                    {isRetirement && <span className="ml-1 text-amber-600 text-[10px]">RETIRE</span>}
                  </td>
                  <td className="px-3 py-1.5 text-right text-gray-700">${fmt(row.totalIncome)}</td>
                  <td className="px-3 py-1.5 text-right text-red-600">${fmt(row.totalTax)}</td>
                  <td className="px-3 py-1.5 text-right text-gray-700">${fmt(row.totalExpenses)}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">${fmt(row.totalContributions401k + row.totalEmployerMatch)}</td>
                  <td className="px-3 py-1.5 text-right text-emerald-600">${fmt(row.fourOneKGrowth)}</td>
                  <td className="px-3 py-1.5 text-right text-emerald-600">${fmt(row.savingsGrowth)}</td>
                  <td className={`px-3 py-1.5 text-right ${row.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.netCashFlow < 0 ? '-' : ''}${fmt(Math.abs(row.netCashFlow))}
                  </td>
                  <td className="px-3 py-1.5 text-right text-blue-600">${fmt(row.fourOneK)}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">${fmt(row.generalSavings)}</td>
                  <td className="px-3 py-1.5 text-right text-amber-600">{row.homeEquity > 0 ? `$${fmt(row.homeEquity)}` : '—'}</td>
                  <td className="px-3 py-1.5 text-right font-medium text-gray-900">${fmt(row.netWorth)}</td>
                  <td className="px-3 py-1.5 text-right text-gray-500">${fmt(row.netWorthReal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
