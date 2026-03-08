import { LineChart, Line, ResponsiveContainer } from 'recharts';
import Card from '../shared/Card';
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

function Sparkline({ data, dataKey, color }: { data: ProjectionYear[]; dataKey: keyof ProjectionYear; color: string }) {
  if (data.length < 2) return null;
  return (
    <ResponsiveContainer width={80} height={30}>
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ProgressRing({ percent, size = 44, strokeWidth = 4 }: { percent: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(percent, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;
  const color = clamped >= 100 ? '#22c55e' : '#3b82f6';

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" className="text-[10px] font-semibold fill-gray-700">
        {clamped >= 999 ? '999' : `${Math.round(clamped)}%`}
      </text>
    </svg>
  );
}

export default function ProjectionSummary({ data, retirementAge, retirementGoal, ssEstimate }: Props) {
  if (data.length === 0) return null;

  const atRetirement = retirementAge
    ? data.find((d) => d.age === retirementAge) || data[data.length - 1]
    : data[data.length - 1];

  const finalYear = data[data.length - 1];
  const goalPct = retirementGoal && retirementGoal > 0
    ? Math.min((atRetirement.netWorth / retirementGoal) * 100, 999)
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* At Retirement */}
      <Card elevation="md">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-gray-500 mb-1">At Retirement (Age {atRetirement.age})</p>
            <p className="text-lg font-semibold text-gray-900 tabular-nums">{fmt(atRetirement.netWorth)}</p>
          </div>
          <Sparkline data={data} dataKey="netWorth" color="#3b82f6" />
        </div>
        <div className="text-xs text-gray-500 mt-1 tabular-nums">
          <span>401(k): {fmt(atRetirement.fourOneK)}</span>
          <span className="mx-1">|</span>
          <span>Savings: {fmt(atRetirement.generalSavings)}</span>
          {atRetirement.homeEquity > 0 && (
            <>
              <span className="mx-1">|</span>
              <span>Equity: {fmt(atRetirement.homeEquity)}</span>
            </>
          )}
        </div>
      </Card>

      {/* At End of Projection */}
      <Card elevation="md">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-gray-500 mb-1">At Age {finalYear.age}</p>
            <p className="text-lg font-semibold text-gray-900 tabular-nums">{fmt(finalYear.netWorth)}</p>
          </div>
          <Sparkline data={data} dataKey="netWorthReal" color="#f59e0b" />
        </div>
        <p className="text-xs text-gray-500 mt-1 tabular-nums">
          Real value: {fmt(finalYear.netWorthReal)}
        </p>
      </Card>

      {/* Goal Progress */}
      <Card elevation="md">
        <p className="text-xs text-gray-500 mb-1">Retirement Goal</p>
        {retirementGoal && retirementGoal > 0 ? (
          <div className="flex items-center gap-3">
            <ProgressRing percent={goalPct ?? 0} />
            <div>
              <p className="text-lg font-semibold text-gray-900 tabular-nums">{fmt(retirementGoal)}</p>
              <p className="text-xs text-gray-500">{goalPct?.toFixed(0)}% at retirement</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Not set</p>
        )}
      </Card>

      {/* Social Security */}
      <Card elevation="md">
        <p className="text-xs text-gray-500 mb-1">Est. Social Security</p>
        {ssEstimate ? (
          <>
            <p className="text-lg font-semibold text-gray-900 tabular-nums">
              {fmt(ssEstimate.monthlyBenefit)}<span className="text-sm text-gray-500 font-normal">/mo</span>
            </p>
            <p className="text-xs text-gray-500 mt-1 tabular-nums">
              {fmt(ssEstimate.annualBenefit)}/yr at age {ssEstimate.claimingAge}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-400">Add income to estimate</p>
        )}
      </Card>
    </div>
  );
}
