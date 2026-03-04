/**
 * Simplified Social Security benefit estimator.
 *
 * Uses AIME/PIA formula with 2025 bend points.
 * Assumes current income represents career-average earnings for simplicity.
 * Adjusts for early/delayed claiming relative to full retirement age (67).
 */

const FULL_RETIREMENT_AGE = 67;

// 2025 PIA bend points
const BEND_POINT_1 = 1_226;  // first $1,226 of AIME
const BEND_POINT_2 = 7_391;  // next portion up to $7,391

// SS wage cap for 2025
const SS_WAGE_CAP = 176_100;

export interface SocialSecurityEstimate {
  monthlyBenefit: number;
  annualBenefit: number;
  claimingAge: number;
  fullRetirementAge: number;
  aime: number;
  pia: number;
  adjustmentFactor: number;
  assumptions: string[];
}

export function estimateSocialSecurity({
  currentAnnualIncome,
  claimingAge = FULL_RETIREMENT_AGE,
}: {
  currentAnnualIncome: number;
  claimingAge?: number;
}): SocialSecurityEstimate {
  const assumptions: string[] = [
    'Uses 2025 PIA bend points ($1,226 / $7,391)',
    'Assumes current income approximates career-average indexed earnings',
    `Full retirement age: ${FULL_RETIREMENT_AGE}`,
    `Social Security wage cap: $${SS_WAGE_CAP.toLocaleString()}`,
  ];

  // Cap at SS wage cap
  const cappedIncome = Math.min(currentAnnualIncome, SS_WAGE_CAP);

  // AIME = Average Indexed Monthly Earnings
  // Simplified: use current income as proxy for 35-year average
  const aime = Math.round(cappedIncome / 12);

  // PIA = Primary Insurance Amount (monthly benefit at FRA)
  let pia = 0;
  if (aime <= BEND_POINT_1) {
    pia = aime * 0.90;
  } else if (aime <= BEND_POINT_2) {
    pia = BEND_POINT_1 * 0.90 + (aime - BEND_POINT_1) * 0.32;
  } else {
    pia = BEND_POINT_1 * 0.90 + (BEND_POINT_2 - BEND_POINT_1) * 0.32 + (aime - BEND_POINT_2) * 0.15;
  }

  // Claiming age adjustment
  const monthsFromFRA = (claimingAge - FULL_RETIREMENT_AGE) * 12;
  let adjustmentFactor = 1;

  if (monthsFromFRA < 0) {
    // Early claiming: reduce by 5/9 of 1% for first 36 months, 5/12 of 1% after
    const earlyMonths = Math.abs(monthsFromFRA);
    if (earlyMonths <= 36) {
      adjustmentFactor = 1 - earlyMonths * (5 / 9 / 100);
    } else {
      adjustmentFactor = 1 - 36 * (5 / 9 / 100) - (earlyMonths - 36) * (5 / 12 / 100);
    }
    assumptions.push(`Early claiming at ${claimingAge}: ${((1 - adjustmentFactor) * 100).toFixed(1)}% reduction`);
  } else if (monthsFromFRA > 0) {
    // Delayed claiming: increase by 8% per year (2/3 of 1% per month)
    adjustmentFactor = 1 + monthsFromFRA * (2 / 3 / 100);
    assumptions.push(`Delayed claiming at ${claimingAge}: ${((adjustmentFactor - 1) * 100).toFixed(1)}% increase`);
  }

  const monthlyBenefit = Math.round(pia * adjustmentFactor);
  const annualBenefit = monthlyBenefit * 12;

  return {
    monthlyBenefit,
    annualBenefit,
    claimingAge,
    fullRetirementAge: FULL_RETIREMENT_AGE,
    aime,
    pia: Math.round(pia),
    adjustmentFactor,
    assumptions,
  };
}
