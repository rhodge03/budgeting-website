import {
  FEDERAL_BRACKETS,
  STANDARD_DEDUCTION,
  FICA,
  STATE_TAX_RATES,
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
