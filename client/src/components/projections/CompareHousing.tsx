import { useMemo } from 'react';
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
import { computeHomePurchaseMonthly, HOME_PURCHASE_LOCKED_NAMES } from 'shared';
import type { ScenarioProjection } from './ScenarioCompare';

interface Props {
  scenarios: ScenarioProjection[];
  inflationRate: number;
  retirementAge?: number;
  includeUtilities: boolean;
}

const fmt = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export default function CompareHousing({ scenarios, inflationRate, retirementAge, includeUtilities }: Props) {
  const merged = useMemo(() => {
    if (scenarios.length === 0) return [];

    const maxLen = Math.max(...scenarios.map((s) => s.data.length), 0);
    const inflationMul = 1 + inflationRate / 100;

    // Pre-compute per-scenario monthly cost breakdowns
    const scenarioCosts = scenarios.map((s) => {
      const hp = s.homePurchase;
      const hpMonthly = hp ? computeHomePurchaseMonthly(hp) : null;

      // Fixed mortgage PI (no inflation, stops after loan term)
      const mortgagePI = hpMonthly?.mortgagePI ?? 0;
      const loanTermYears = hp?.loanTermYears ?? 30;

      // Other housing costs from home purchase (inflate normally)
      const hpOtherMonthly = hpMonthly
        ? hpMonthly.propertyTax + hpMonthly.homeInsurance + hpMonthly.repairs
        : 0;

      // Non-locked housing subcategories (e.g., HOA Fees)
      const housingCat = s.expenseCategories.find((c) => c.name === 'Housing');
      const nonLockedHousing = housingCat
        ? housingCat.subCategories
            .filter((sub) => !hp || !HOME_PURCHASE_LOCKED_NAMES.includes(sub.name))
            .reduce((sum, sub) => sum + Number(sub.amount), 0)
        : 0;

      // If no home purchase, include all housing subs
      const allHousing = housingCat
        ? housingCat.subCategories.reduce((sum, sub) => sum + Number(sub.amount), 0)
        : 0;

      // Utilities
      const utilitiesCat = s.expenseCategories.find((c) => c.name === 'Utilities');
      const utilitiesMonthly = utilitiesCat
        ? utilitiesCat.subCategories.reduce((sum, sub) => sum + Number(sub.amount), 0)
        : 0;

      // Base inflatable monthly (everything except fixed mortgage PI)
      const inflatableBase = hp
        ? hpOtherMonthly + nonLockedHousing
        : allHousing;

      const bufferMul = 1 + s.expenseBuffer / 100;

      return {
        mortgagePI: mortgagePI * bufferMul,
        inflatableBase: (inflatableBase + (includeUtilities ? utilitiesMonthly : 0)) * bufferMul,
        loanTermYears,
      };
    });

    const data: Record<string, number>[] = [];
    for (let i = 0; i < maxLen; i++) {
      const point: Record<string, number> = {};

      // Get age from first scenario with data at this index
      for (const s of scenarios) {
        if (s.data[i]) {
          point.age = s.data[i].age;
          break;
        }
      }

      for (let si = 0; si < scenarios.length; si++) {
        const s = scenarios[si];
        if (!s.data[i]) continue;
        const costs = scenarioCosts[si];
        // i=0 is baseline row (no year elapsed), i=1 is first year, etc.
        const yearIndex = Math.max(0, i - 1);
        const inflationFactor = Math.pow(inflationMul, yearIndex);

        // Mortgage PI is fixed and stops after loan term
        const mortgage = yearIndex < costs.loanTermYears ? costs.mortgagePI : 0;
        // Everything else inflates
        const inflatable = costs.inflatableBase * inflationFactor;

        point[`${s.id}_cost`] = Math.round(mortgage + inflatable);
      }

      data.push(point);
    }

    return data;
  }, [scenarios, inflationRate, includeUtilities]);

  if (scenarios.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">Select at least one scenario to compare</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={merged} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="age" tick={{ fontSize: 11 }} />
        <YAxis
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
          tick={{ fontSize: 11 }}
          width={65}
        />
        <Tooltip
          formatter={(value: number | undefined) => value != null ? [fmt(value), 'Monthly'] : ''}
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
            dataKey={`${s.id}_cost`}
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
