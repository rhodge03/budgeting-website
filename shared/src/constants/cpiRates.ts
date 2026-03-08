import type { InflationPreset } from '../types/index.js';

export interface CpiRate {
  label: string;
  rate20yr: number;
  rate40yr: number;
}

export const CPI_RATES: Record<string, CpiRate> = {
  shelter:         { label: 'Shelter / Rent',           rate20yr: 3.2, rate40yr: 3.5 },
  foodAtHome:      { label: 'Food at Home',             rate20yr: 2.5, rate40yr: 3.0 },
  foodAway:        { label: 'Food Away from Home',      rate20yr: 3.0, rate40yr: 3.5 },
  medicalCare:     { label: 'Medical Care',             rate20yr: 3.5, rate40yr: 4.5 },
  healthInsurance: { label: 'Health Insurance',         rate20yr: 5.0, rate40yr: 5.0 },
  education:       { label: 'Education',                rate20yr: 4.0, rate40yr: 5.5 },
  transportation:  { label: 'Transportation',           rate20yr: 2.0, rate40yr: 2.5 },
  apparel:         { label: 'Apparel',                  rate20yr: 0.5, rate40yr: 1.5 },
  household:       { label: 'Furniture / Household',    rate20yr: 1.5, rate40yr: 2.0 },
  recreation:      { label: 'Recreation/Entertainment', rate20yr: 1.5, rate40yr: 2.0 },
  utilities:       { label: 'Utilities',                rate20yr: 3.0, rate40yr: 3.5 },
  headline:        { label: 'All Items (headline)',     rate20yr: 2.5, rate40yr: 3.0 },
};

/** Maps default expense category names to CPI rate keys. Unmapped → 'headline'. */
export const CATEGORY_TO_CPI: Record<string, string> = {
  'Housing':                   'shelter',
  'Utilities':                 'utilities',
  'Transportation':            'transportation',
  'Food':                      'foodAtHome',
  'Insurance':                 'healthInsurance',
  'Healthcare':                'medicalCare',
  'Personal & Family':         'headline',
  'Entertainment & Lifestyle': 'recreation',
  'Miscellaneous':             'headline',
};

/** Categories that default to 0% inflation (fixed obligations). */
export const ZERO_INFLATION_CATEGORIES = ['Debt Payments', 'Savings & Investments'];

/** Get the effective inflation rate for a category. */
export function getCategoryInflationRate(
  categoryName: string,
  inflationPreset: InflationPreset,
  customInflationRate: number,
): number {
  if (ZERO_INFLATION_CATEGORIES.includes(categoryName)) return 0;
  if (inflationPreset === 'custom') return customInflationRate;
  const cpiKey = CATEGORY_TO_CPI[categoryName] ?? 'headline';
  const cpi = CPI_RATES[cpiKey] ?? CPI_RATES['headline'];
  return inflationPreset === '20yr' ? cpi.rate20yr : cpi.rate40yr;
}
