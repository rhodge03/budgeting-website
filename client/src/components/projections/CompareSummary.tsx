import type { ScenarioProjection } from './ScenarioCompare';

interface Props {
  scenarios: ScenarioProjection[];
  retirementAge?: number;
}

const fmt = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

interface MilestoneRow {
  label: string;
  values: number[];
  highlight: 'high' | 'low'; // high = green for max, low = green for min
}

export default function CompareSummary({ scenarios, retirementAge }: Props) {
  const rows: MilestoneRow[] = [];

  // Monthly expenses (from first year's totalExpenses / 12)
  rows.push({
    label: 'Monthly Expenses',
    values: scenarios.map((s) => {
      const first = s.data[0];
      return first ? first.totalExpenses / 12 : 0;
    }),
    highlight: 'low',
  });

  // Annual expenses
  rows.push({
    label: 'Annual Expenses',
    values: scenarios.map((s) => {
      const first = s.data[0];
      return first ? first.totalExpenses : 0;
    }),
    highlight: 'low',
  });

  // At retirement
  if (retirementAge) {
    rows.push({
      label: `At Retirement (Age ${retirementAge})`,
      values: scenarios.map((s) => {
        const row = s.data.find((d) => d.age === retirementAge);
        return row ? row.netWorth : 0;
      }),
      highlight: 'high',
    });
  }

  // At age 80
  rows.push({
    label: 'At Age 80',
    values: scenarios.map((s) => {
      const row = s.data.find((d) => d.age === 80);
      return row ? row.netWorth : 0;
    }),
    highlight: 'high',
  });

  // At age 90
  rows.push({
    label: 'At Age 90',
    values: scenarios.map((s) => {
      const row = s.data.find((d) => d.age === 90);
      return row ? row.netWorth : 0;
    }),
    highlight: 'high',
  });

  // At end
  rows.push({
    label: 'At End',
    values: scenarios.map((s) => {
      const last = s.data[s.data.length - 1];
      return last ? last.netWorth : 0;
    }),
    highlight: 'high',
  });

  // Total lifetime expenses
  rows.push({
    label: 'Total Lifetime Expenses',
    values: scenarios.map((s) => s.data.reduce((sum, d) => sum + d.totalExpenses, 0)),
    highlight: 'low',
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 text-gray-500">
            <th className="px-3 py-2 text-left font-medium">Milestone</th>
            {scenarios.map((s) => (
              <th key={s.id} className="px-3 py-2 text-right font-medium">
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: s.color }} />
                {s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const best = row.highlight === 'high'
              ? Math.max(...row.values)
              : Math.min(...row.values);
            const worst = row.highlight === 'high'
              ? Math.min(...row.values)
              : Math.max(...row.values);
            const allSame = row.values.every((v) => v === row.values[0]);

            return (
              <tr key={row.label} className="border-t border-gray-100">
                <td className="px-3 py-2 text-gray-700 font-medium">{row.label}</td>
                {row.values.map((val, i) => {
                  let colorClass = 'text-gray-700';
                  if (!allSame && scenarios.length > 1) {
                    if (val === best) colorClass = 'text-green-600 font-semibold';
                    else if (val === worst) colorClass = 'text-red-600';
                  }
                  return (
                    <td key={scenarios[i].id} className={`px-3 py-2 text-right ${colorClass}`}>
                      {fmt(val)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
