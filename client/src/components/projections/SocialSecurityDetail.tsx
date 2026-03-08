import Card from '../shared/Card';
import SectionHeader from '../shared/SectionHeader';
import type { SocialSecurityEstimate } from '../../utils/socialSecurityEstimator';

interface Props {
  estimate: SocialSecurityEstimate;
}

const fmt = (n: number) =>
  `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export default function SocialSecurityDetail({ estimate }: Props) {
  return (
    <Card>
      <SectionHeader className="mb-3">Social Security Estimate</SectionHeader>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
        <div>
          <span className="text-gray-500">Monthly Benefit:</span>
          <span className="ml-2 font-medium">{fmt(estimate.monthlyBenefit)}</span>
        </div>
        <div>
          <span className="text-gray-500">Annual Benefit:</span>
          <span className="ml-2 font-medium">{fmt(estimate.annualBenefit)}</span>
        </div>
        <div>
          <span className="text-gray-500">AIME:</span>
          <span className="ml-2 font-medium">{fmt(estimate.aime)}</span>
        </div>
        <div>
          <span className="text-gray-500">PIA (at FRA):</span>
          <span className="ml-2 font-medium">{fmt(estimate.pia)}</span>
        </div>
        <div>
          <span className="text-gray-500">Claiming Age:</span>
          <span className="ml-2 font-medium">{estimate.claimingAge}</span>
        </div>
        <div>
          <span className="text-gray-500">Adjustment:</span>
          <span className="ml-2 font-medium">{(estimate.adjustmentFactor * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-medium text-gray-500 mb-1">Assumptions</p>
        <ul className="text-xs text-gray-500 space-y-0.5">
          {estimate.assumptions.map((a, i) => (
            <li key={i}>• {a}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
