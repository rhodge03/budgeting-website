import {
  FEDERAL_BRACKETS,
  STANDARD_DEDUCTION,
  FICA,
  STATE_TAX_RATES,
  CAPITAL_GAINS_BRACKETS,
} from 'shared/constants/taxBrackets';
import type { FilingStatus } from 'shared';

export interface TaxBreakdown {
  grossIncome: number;
  taxableIncome: number;
  preTax401k: number;
  deduction: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  totalTax: number;
  effectiveRate: number;
  takeHomePay: number;
  federalBrackets: { rate: number; taxableAmount: number; tax: number }[];
}

export function calculateTax({
  grossIncome,
  filingStatus,
  state,
  deductionType,
  itemizedDeductionTotal,
  preTax401k,
}: {
  grossIncome: number;
  filingStatus: FilingStatus;
  state: string;
  deductionType: 'standard' | 'itemized';
  itemizedDeductionTotal: number;
  preTax401k: number;
}): TaxBreakdown {
  // 1. Subtract pre-tax 401k contributions from taxable income
  const afterPreTax = Math.max(0, grossIncome - preTax401k);

  // 2. Apply deduction
  const deduction =
    deductionType === 'standard'
      ? STANDARD_DEDUCTION[filingStatus]
      : itemizedDeductionTotal;
  const taxableIncome = Math.max(0, afterPreTax - deduction);

  // 3. Federal tax (marginal brackets)
  const brackets = FEDERAL_BRACKETS[filingStatus];
  const federalBrackets: TaxBreakdown['federalBrackets'] = [];
  let federalTax = 0;

  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break;
    const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    const tax = taxableInBracket * bracket.rate;
    federalBrackets.push({
      rate: bracket.rate,
      taxableAmount: taxableInBracket,
      tax,
    });
    federalTax += tax;
  }

  // 4. State tax (simplified flat rate on taxable income)
  const stateRate = STATE_TAX_RATES[state]?.rate ?? 0;
  const stateTax = taxableIncome * stateRate;

  // 5. FICA (on gross income, not reduced by 401k or deductions)
  const ssWages = Math.min(grossIncome, FICA.socialSecurityWageCap);
  const socialSecurity = ssWages * FICA.socialSecurityRate;

  let medicare = grossIncome * FICA.medicareRate;
  const medicareThreshold = FICA.additionalMedicareThreshold[filingStatus];
  if (grossIncome > medicareThreshold) {
    medicare += (grossIncome - medicareThreshold) * FICA.additionalMedicareRate;
  }

  // 6. Totals
  const totalTax = federalTax + stateTax + socialSecurity + medicare;
  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;
  const takeHomePay = grossIncome - totalTax - preTax401k;

  return {
    grossIncome,
    taxableIncome,
    preTax401k,
    deduction,
    federalTax,
    stateTax,
    socialSecurity,
    medicare,
    totalTax,
    effectiveRate,
    takeHomePay,
    federalBrackets,
  };
}

/**
 * Calculate capital gains tax on realized gains from selling investments.
 * Gains "stack" on top of ordinary taxable income in the LTCG bracket table.
 * Also includes state tax on the gains (most states tax as ordinary income).
 */
export function calculateCapitalGainsTax({
  capitalGains,
  ordinaryTaxableIncome,
  filingStatus,
  state,
}: {
  capitalGains: number;
  ordinaryTaxableIncome: number;
  filingStatus: FilingStatus;
  state: string;
}): number {
  if (capitalGains <= 0) return 0;

  const brackets = CAPITAL_GAINS_BRACKETS[filingStatus];
  let federalTax = 0;

  // Cap gains stack on top of ordinary income in the bracket table.
  // Start from ordinaryTaxableIncome and fill upward with gains.
  const incomeFloor = Math.max(0, ordinaryTaxableIncome);
  const incomeCeiling = incomeFloor + capitalGains;

  for (const bracket of brackets) {
    if (incomeCeiling <= bracket.min) break;
    if (incomeFloor >= bracket.max) continue;

    // Portion of gains that falls in this bracket
    const lower = Math.max(incomeFloor, bracket.min);
    const upper = Math.min(incomeCeiling, bracket.max);
    const gainsInBracket = upper - lower;

    federalTax += gainsInBracket * bracket.rate;
  }

  // State tax: most states tax capital gains as ordinary income
  const stateRate = STATE_TAX_RATES[state]?.rate ?? 0;
  const stateTax = capitalGains * stateRate;

  return federalTax + stateTax;
}
