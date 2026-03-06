import type { HomePurchase, HomePurchaseMonthly, HomeEquityYear } from '../types/index.js';

/**
 * Subcategory names that get replaced by computed home purchase values.
 */
export const HOME_PURCHASE_LOCKED_NAMES = [
  'Mortgage / Rent',
  'Property Tax',
  "Homeowner's Insurance",
  'Home Maintenance',
];

/**
 * Standard mortgage amortization:
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function computeMonthlyMortgage(
  principal: number,
  annualRate: number,
  termYears: number,
): number {
  if (principal <= 0) return 0;
  if (annualRate <= 0) return principal / (termYears * 12);
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * Compute the four monthly line items from a home purchase config.
 */
export function computeHomePurchaseMonthly(hp: HomePurchase): HomePurchaseMonthly {
  const principal = hp.homePrice - hp.downPayment;
  const mortgagePI = computeMonthlyMortgage(principal, hp.interestRate, hp.loanTermYears);

  const propertyTax =
    hp.propertyTaxMode === 'percent'
      ? (hp.homePrice * hp.propertyTax / 100) / 12
      : hp.propertyTax;

  const homeInsurance =
    hp.homeInsuranceMode === 'percent'
      ? (hp.homePrice * hp.homeInsurance / 100) / 12
      : hp.homeInsurance;

  const repairs = (hp.homePrice * hp.repairsPct / 100) / 12;

  const total = mortgagePI + propertyTax + homeInsurance + repairs;

  return {
    mortgagePI: Math.round(mortgagePI * 100) / 100,
    propertyTax: Math.round(propertyTax * 100) / 100,
    homeInsurance: Math.round(homeInsurance * 100) / 100,
    repairs: Math.round(repairs * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Compute one-time costs (closing costs + down payment).
 */
export function computeClosingCosts(hp: HomePurchase): number {
  return hp.closingCostMode === 'percent'
    ? Math.round(hp.homePrice * hp.closingCosts / 100 * 100) / 100
    : hp.closingCosts;
}

/**
 * Year-by-year equity schedule over the loan term.
 * Tracks home value appreciation, loan paydown, and equity.
 */
export function computeHomeEquitySchedule(hp: HomePurchase): HomeEquityYear[] {
  const principal = hp.homePrice - hp.downPayment;
  const monthlyRate = hp.interestRate / 100 / 12;
  const monthlyPayment = computeMonthlyMortgage(principal, hp.interestRate, hp.loanTermYears);
  const appreciationMul = 1 + hp.appreciationRate / 100;

  const results: HomeEquityYear[] = [];
  let loanBalance = principal;
  let totalPaid = hp.downPayment;
  let totalInterest = 0;

  // Year 0: purchase
  results.push({
    year: 0,
    homeValue: Math.round(hp.homePrice),
    loanBalance: Math.round(principal),
    equity: Math.round(hp.downPayment),
    totalPaid: Math.round(hp.downPayment),
    totalInterest: 0,
  });

  for (let y = 1; y <= hp.loanTermYears; y++) {
    // Process 12 monthly payments
    for (let m = 0; m < 12; m++) {
      if (loanBalance <= 0) break;
      const interestPayment = loanBalance * monthlyRate;
      const principalPayment = Math.min(monthlyPayment - interestPayment, loanBalance);
      loanBalance -= principalPayment;
      totalPaid += monthlyPayment;
      totalInterest += interestPayment;
    }

    const homeValue = hp.homePrice * Math.pow(appreciationMul, y);
    if (loanBalance < 0.01) loanBalance = 0;

    results.push({
      year: y,
      homeValue: Math.round(homeValue),
      loanBalance: Math.round(loanBalance),
      equity: Math.round(homeValue - loanBalance),
      totalPaid: Math.round(totalPaid),
      totalInterest: Math.round(totalInterest),
    });
  }

  return results;
}
