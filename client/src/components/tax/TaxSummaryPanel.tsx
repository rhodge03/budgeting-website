import { useMemo } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import { calculateTax } from '../../utils/taxCalculator';
import { STATE_TAX_RATES } from 'shared/constants/taxBrackets';
import type { FilingStatus } from 'shared';

export default function TaxSummaryPanel() {
  const { earners, selectedEarnerId } = useHouseholdStore();
  const earner = earners.find((e) => e.id === selectedEarnerId);

  const isJoint = earner?.filingStatus === 'married_jointly';

  const breakdown = useMemo(() => {
    if (!earner) return null;

    // For MFJ, combine all earners' income on one joint return
    const earnersToInclude = isJoint ? earners : [earner];

    let grossIncome = 0;
    let totalIncome = 0;
    let preTax401k = 0;
    let itemizedTotal = 0;

    for (const e of earnersToInclude) {
      const taxable = (e.incomeEntries || [])
        .filter((ie) => ie.isTaxable)
        .reduce((sum, ie) => sum + Number(ie.amount), 0);
      const all = (e.incomeEntries || [])
        .reduce((sum, ie) => sum + Number(ie.amount), 0);
      const contributionPct = e.savingsBalance
        ? Number(e.savingsBalance.contributionPercent) / 100
        : 0;

      grossIncome += taxable;
      totalIncome += all;
      preTax401k += taxable * contributionPct;
      itemizedTotal += (e.itemizedDeductions || [])
        .reduce((sum, d) => sum + Number(d.amount), 0);
    }

    return {
      ...calculateTax({
        grossIncome,
        filingStatus: earner.filingStatus as FilingStatus,
        state: earner.state,
        deductionType: earner.deductionType as 'standard' | 'itemized',
        itemizedDeductionTotal: itemizedTotal,
        preTax401k,
      }),
      totalIncome,
    };
  }, [earner, earners, isJoint]);

  if (!earner || !breakdown) return null;

  const stateName = STATE_TAX_RATES[earner.state]?.name ?? earner.state;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
        Tax Breakdown {isJoint && '(Joint)'}
      </h3>

      <div className="space-y-3">
        <TaxRow label="Gross Taxable Income" value={breakdown.grossIncome} />
        <TaxRow label="401(k) Pre-Tax Contribution" value={-breakdown.preTax401k} />
        <TaxRow
          label={`Deduction (${earner.deductionType})`}
          value={-breakdown.deduction}
        />
        <TaxRow label="Taxable Income" value={breakdown.taxableIncome} bold />

        <div className="border-t border-gray-200 pt-3 mt-3" />

        <TaxRow label="Federal Income Tax" value={breakdown.federalTax} negative />
        <TaxRow label={`State Tax (${stateName})`} value={breakdown.stateTax} negative />
        <TaxRow label="Social Security" value={breakdown.socialSecurity} negative />
        <TaxRow label="Medicare" value={breakdown.medicare} negative />
        <TaxRow label="Total Tax" value={breakdown.totalTax} negative bold />

        <div className="border-t border-gray-200 pt-3 mt-3" />

        <TaxRow
          label="Effective Tax Rate"
          value={breakdown.effectiveRate}
          isPercentage
        />
        <TaxRow label="Take-Home Pay (Annual)" value={breakdown.takeHomePay} bold highlight />
        <TaxRow
          label="Take-Home Pay (Monthly)"
          value={breakdown.takeHomePay / 12}
          highlight
        />

        {/* Federal bracket breakdown */}
        {breakdown.federalBrackets.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Federal Bracket Breakdown</p>
            {breakdown.federalBrackets.map((b, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-600 py-0.5">
                <span>{(b.rate * 100).toFixed(0)}% on ${b.taxableAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                <span>${b.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TaxRow({
  label,
  value,
  negative = false,
  bold = false,
  highlight = false,
  isPercentage = false,
}: {
  label: string;
  value: number;
  negative?: boolean;
  bold?: boolean;
  highlight?: boolean;
  isPercentage?: boolean;
}) {
  const formatted = isPercentage
    ? `${(value * 100).toFixed(1)}%`
    : `${value < 0 ? '-' : ''}$${Math.abs(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

  return (
    <div className={`flex justify-between items-center ${highlight ? 'bg-blue-50 -mx-2 px-2 py-1 rounded' : ''}`}>
      <span className={`text-sm ${bold ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
        {label}
      </span>
      <span
        className={`text-sm ${bold ? 'font-semibold' : ''} ${
          negative && value > 0 ? 'text-red-600' : highlight ? 'text-blue-700' : 'text-gray-900'
        }`}
      >
        {negative && value > 0 ? `-${formatted.replace('-', '')}` : formatted}
      </span>
    </div>
  );
}
