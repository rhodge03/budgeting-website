import { useState, useMemo, useCallback, useEffect } from 'react';
import { useHouseholdStore } from '../stores/householdStore';
import { useEarnerSelectionStore } from '../stores/earnerSelectionStore';
import { runProjection } from '../utils/projectionEngine';
import { estimateSocialSecurity } from '../utils/socialSecurityEstimator';
import ProjectionChart, { DEFAULT_SERIES } from '../components/projections/ProjectionChart';
import ChartControls from '../components/projections/ChartControls';
import ProjectionSummary from '../components/projections/ProjectionSummary';
import ProjectionTable from '../components/projections/ProjectionTable';
import SocialSecurityDetail from '../components/projections/SocialSecurityDetail';
import ChildSavingsChart from '../components/projections/ChildSavingsChart';

const STORAGE_KEY = 'projection-chart-settings';

interface ChartSettings {
  inflationRate: number;
  ssClaimingAge: number;
  maxAge: number;
  enabledSeries: string[];
}

function loadSettings(): ChartSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ChartSettings;
  } catch {
    return null;
  }
}

function saveSettings(settings: ChartSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export default function ProjectionsPage() {
  const { earners, expenseCategories, household, homePurchase } = useHouseholdStore();
  const selectedEarnerId = useEarnerSelectionStore((s) => s.selectedEarnerId);

  const [inflationRate, setInflationRate] = useState(() => loadSettings()?.inflationRate ?? 3);
  const [ssClaimingAge, setSsClaimingAge] = useState(() => loadSettings()?.ssClaimingAge ?? 67);
  const [maxAge, setMaxAge] = useState(() => loadSettings()?.maxAge ?? 100);
  const [enabledSeries, setEnabledSeries] = useState(() => {
    const saved = loadSettings()?.enabledSeries;
    return saved ? new Set(saved) : new Set(DEFAULT_SERIES);
  });

  useEffect(() => {
    saveSettings({
      inflationRate,
      ssClaimingAge,
      maxAge,
      enabledSeries: Array.from(enabledSeries),
    });
  }, [inflationRate, ssClaimingAge, maxAge, enabledSeries]);

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
        expenseBuffer: Number(household?.expenseBuffer ?? 0) || Number(localStorage.getItem('expense-buffer') ?? 0),
        inflationRate,
        maxAge,
        homePurchase,
      }),
    [earners, expenseCategories, household?.expenseBuffer, inflationRate, maxAge, homePurchase],
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

  // Check if a child is selected
  const selectedChild = selectedEarnerId !== 'all'
    ? earners.find((e) => e.id === selectedEarnerId && e.memberType === 'child')
    : undefined;

  if (selectedChild) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedChild.name}'s Savings Projection
        </h2>
        <ChildSavingsChart earner={selectedChild} />
      </div>
    );
  }

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
