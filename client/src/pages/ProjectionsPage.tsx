import { useState, useMemo, useCallback } from 'react';
import { useHouseholdStore } from '../stores/householdStore';
import { runProjection } from '../utils/projectionEngine';
import { estimateSocialSecurity } from '../utils/socialSecurityEstimator';
import ProjectionChart, { DEFAULT_SERIES } from '../components/projections/ProjectionChart';
import ChartControls from '../components/projections/ChartControls';
import ProjectionSummary from '../components/projections/ProjectionSummary';
import ProjectionTable from '../components/projections/ProjectionTable';
import SocialSecurityDetail from '../components/projections/SocialSecurityDetail';

export default function ProjectionsPage() {
  const { earners, expenseCategories, household } = useHouseholdStore();
  const [inflationRate, setInflationRate] = useState(3);
  const [ssClaimingAge, setSsClaimingAge] = useState(67);
  const [maxAge, setMaxAge] = useState(100);
  const [enabledSeries, setEnabledSeries] = useState(() => new Set(DEFAULT_SERIES));

  const handleToggleSeries = useCallback((key: string) => {
    setEnabledSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const primary = earners.find((e) => e.isPrimary) || earners[0];
  const retirementAge = primary?.retirementSettings?.targetRetirementAge;
  const retirementGoal = primary?.retirementSettings?.retirementGoal;

  const projectionData = useMemo(
    () =>
      runProjection({
        earners,
        expenseCategories,
        expenseBuffer: Number(household?.expenseBuffer ?? 0),
        inflationRate,
        maxAge,
      }),
    [earners, expenseCategories, household?.expenseBuffer, inflationRate, maxAge],
  );

  const ssEstimate = useMemo(() => {
    if (!primary) return null;
    const totalIncome = primary.incomeEntries.reduce((s, ie) => s + Number(ie.amount), 0);
    if (totalIncome === 0) return null;
    return estimateSocialSecurity({
      currentAnnualIncome: totalIncome,
      claimingAge: ssClaimingAge,
    });
  }, [primary, ssClaimingAge]);

  return (
    <div className="space-y-4">
      {/* Header + Controls */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Retirement Projections</h2>
        <ChartControls
          inflationRate={inflationRate}
          onInflationRateChange={setInflationRate}
          ssClaimingAge={ssClaimingAge}
          onSsClaimingAgeChange={setSsClaimingAge}
          maxAge={maxAge}
          onMaxAgeChange={setMaxAge}
          enabledSeries={enabledSeries}
          onToggleSeries={handleToggleSeries}
        />
      </div>

      {/* Summary Cards */}
      <ProjectionSummary
        data={projectionData}
        retirementAge={retirementAge}
        retirementGoal={retirementGoal ? Number(retirementGoal) : undefined}
        ssEstimate={ssEstimate}
      />

      {/* Chart */}
      <ProjectionChart
        data={projectionData}
        enabledSeries={enabledSeries}
        retirementAge={retirementAge}
        retirementGoal={retirementGoal ? Number(retirementGoal) : undefined}
      />

      {/* Social Security Detail */}
      {ssEstimate && <SocialSecurityDetail estimate={ssEstimate} />}

      {/* Year-by-Year Table */}
      <ProjectionTable data={projectionData} retirementAge={retirementAge} />
    </div>
  );
}
