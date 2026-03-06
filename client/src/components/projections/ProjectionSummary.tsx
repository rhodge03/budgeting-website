import type { ProjectionYear } from '../../utils/projectionEngine';
import type { SocialSecurityEstimate } from '../../utils/socialSecurityEstimator';

interface Props {
  data: ProjectionYear[];
  retirementAge?: number;
  retirementGoal?: number;
  ssEstimate: SocialSecurityEstimate | null;
}

const fmt = (n: number) =>
  `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export default function ProjectionSummary({ data, retirementAge, retirementGoal, ssEstimate }: Props) {
  if (data.length === 0) return null;

  const atRetirement = retirementAge
    ? data.find((d) => d.age === retirementAge) || data[data.length - 1]
    : data[data.length - 1];

  const finalYear = data[data.length - 1];
  const goalPct = retirementGoal && retirementGoal > 0
    ? Math.min((atRetirement.totalSavings / retirementGoal) * 100, 999)
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* At Retirement */}
      <div className="bg-white rounded border border-gray-200 p-4">
        <p className="text-xs text-gray-500 mb-1">At Retirement (Age {atRetirement.age})</p>
        <p className="text-lg font-semibold text-gray-900">{fmt(atRetirement.totalSavings)}</p>
        <div className="text-xs text-gray-500 mt-1">
          <span>401(k): {fmt(atRetirement.fourOneK)}</span>
          <span className="mx-1">|</span>
          <span>Savings: {fmt(atRetirement.generalSavings)}</span>
        </div>
      </div>

      {/* At End of Projection */}
      <div className="bg-white rounded border border-gray-200 p-4">
        <p className="text-xs text-gray-500 mb-1">At Age {finalYear.age}</p>
        <p className="text-lg font-semibold text-gray-900">{fmt(finalYear.totalSavings)}</p>
        <p className="text-xs text-gray-500 mt-1">
          Real value: {fmt(finalYear.totalSavingsReal)}
        </p>
      </div>

      {/* Goal Progress */}
      <div className="bg-white rounded border border-gray-200 p-4">
        <p className="text-xs text-gray-500 mb-1">Retirement Goal</p>
        {retirementGoal && retirementGoal > 0 ? (
          <>
            <p className="text-lg font-semibold text-gray-900">{fmt(retirementGoal)}</p>
            <div className="mt-1.5">
              <div className="w-full bg-gray-200 rounded-sm h-2">
                <div
                  className={`h-2 rounded-sm transition-all ${
                    (goalPct ?? 0) >= 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(goalPct ?? 0, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{goalPct?.toFixed(0)}% at retirement</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">Not set</p>
        )}
      </div>

      {/* Social Security */}
      <div className="bg-white rounded border border-gray-200 p-4">
        <p className="text-xs text-gray-500 mb-1">Est. Social Security</p>
        {ssEstimate ? (
          <>
            <p className="text-lg font-semibold text-gray-900">
              {fmt(ssEstimate.monthlyBenefit)}<span className="text-sm text-gray-500 font-normal">/mo</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {fmt(ssEstimate.annualBenefit)}/yr at age {ssEstimate.claimingAge}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-400">Add income to estimate</p>
        )}
      </div>
    </div>
  );
}
