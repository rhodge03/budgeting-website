import { useState, useMemo, useEffect } from 'react';
import { useHouseholdStore } from '../../stores/householdStore';
import { runProjection, type ProjectionInputs, type ProjectionYear } from '../../utils/projectionEngine';
import CompareOverlay from './CompareOverlay';
import CompareSummary from './CompareSummary';
import CompareSideBySide from './CompareSideBySide';
import CompareDifference from './CompareDifference';

export interface ScenarioProjection {
  name: string;
  id: string;
  color: string;
  data: ProjectionYear[];
}

const SCENARIO_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const STORAGE_KEY = 'scenario-compare-settings';

type ViewMode = 'overlay' | 'summary' | 'sideBySide' | 'difference';

const VIEW_LABELS: Record<ViewMode, string> = {
  overlay: 'Overlay',
  summary: 'Summary Table',
  sideBySide: 'Side by Side',
  difference: 'Difference',
};

interface SavedSettings {
  viewMode: ViewMode;
  selectedIds: string[];
}

function loadSettings(): SavedSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedSettings;
  } catch {
    return null;
  }
}

interface Props {
  earners: ProjectionInputs['earners'];
  homePurchase: ProjectionInputs['homePurchase'];
  inflationRate: number;
  maxAge: number;
  retirementAge?: number;
}

export default function ScenarioCompare({ earners, homePurchase, inflationRate, maxAge, retirementAge }: Props) {
  const { expenseCategories, expenseScenarios, household } = useHouseholdStore();

  const [viewMode, setViewMode] = useState<ViewMode>(() => loadSettings()?.viewMode ?? 'overlay');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const saved = loadSettings()?.selectedIds;
    return saved ? new Set(saved) : new Set(['current']);
  });
  const [baselineId, setBaselineId] = useState('current');

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      viewMode,
      selectedIds: Array.from(selectedIds),
    }));
  }, [viewMode, selectedIds]);

  // Don't render if no saved scenarios
  if (expenseScenarios.length === 0) return null;

  const currentBuffer = Number(household?.expenseBuffer ?? 0) || Number(localStorage.getItem('expense-buffer') ?? 0);

  // Build scenario projections
  const scenarios: ScenarioProjection[] = useMemo(() => {
    const results: ScenarioProjection[] = [];
    let colorIdx = 0;

    if (selectedIds.has('current')) {
      results.push({
        id: 'current',
        name: 'Current',
        color: SCENARIO_COLORS[colorIdx++ % SCENARIO_COLORS.length],
        data: runProjection({ earners, expenseCategories, expenseBuffer: currentBuffer, inflationRate, maxAge, homePurchase }),
      });
    }

    for (const scenario of expenseScenarios) {
      if (!selectedIds.has(scenario.id)) continue;
      results.push({
        id: scenario.id,
        name: scenario.name,
        color: SCENARIO_COLORS[colorIdx++ % SCENARIO_COLORS.length],
        data: runProjection({
          earners,
          expenseCategories: scenario.expenseData,
          expenseBuffer: scenario.expenseBuffer,
          inflationRate,
          maxAge,
          homePurchase,
        }),
      });
    }

    return results;
  }, [selectedIds, earners, expenseCategories, currentBuffer, expenseScenarios, inflationRate, maxAge, homePurchase]);

  const toggleScenario = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Ensure baseline is valid
  const effectiveBaseline = selectedIds.has(baselineId)
    ? baselineId
    : scenarios[0]?.id ?? 'current';

  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-semibold text-gray-900">Compare Scenarios</h3>
        <div className="flex items-center gap-3">
          {/* View mode dropdown */}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
          >
            {(Object.keys(VIEW_LABELS) as ViewMode[]).map((mode) => (
              <option key={mode} value={mode}>{VIEW_LABELS[mode]}</option>
            ))}
          </select>

          {/* Baseline selector (difference view only) */}
          {viewMode === 'difference' && scenarios.length > 1 && (
            <select
              value={effectiveBaseline}
              onChange={(e) => setBaselineId(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>Baseline: {s.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Scenario checkboxes */}
      <div className="px-4 py-2 border-b border-gray-50 flex flex-wrap gap-3">
        {/* Current */}
        <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedIds.has('current')}
            onChange={() => toggleScenario('current')}
            className="rounded border-gray-300"
          />
          Current
        </label>
        {/* Saved scenarios */}
        {expenseScenarios.map((s) => (
          <label key={s.id} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedIds.has(s.id)}
              onChange={() => toggleScenario(s.id)}
              className="rounded border-gray-300"
            />
            {s.name}
          </label>
        ))}
      </div>

      {/* View content */}
      <div className="p-4">
        {scenarios.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Select at least one scenario to compare</p>
        ) : viewMode === 'overlay' ? (
          <CompareOverlay scenarios={scenarios} retirementAge={retirementAge} />
        ) : viewMode === 'summary' ? (
          <CompareSummary scenarios={scenarios} retirementAge={retirementAge} />
        ) : viewMode === 'sideBySide' ? (
          <CompareSideBySide scenarios={scenarios} retirementAge={retirementAge} />
        ) : (
          <CompareDifference scenarios={scenarios} baselineId={effectiveBaseline} retirementAge={retirementAge} />
        )}
      </div>
    </div>
  );
}
