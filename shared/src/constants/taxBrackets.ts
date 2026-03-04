// 2025 Federal Income Tax Brackets
export const FEDERAL_BRACKETS = {
  single: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
  married_jointly: [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: Infinity, rate: 0.37 },
  ],
  married_separately: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 375800, rate: 0.35 },
    { min: 375800, max: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, max: 17000, rate: 0.10 },
    { min: 17000, max: 64850, rate: 0.12 },
    { min: 64850, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250500, rate: 0.32 },
    { min: 250500, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
} as const;

// 2025 Standard Deductions
export const STANDARD_DEDUCTION = {
  single: 15000,
  married_jointly: 30000,
  married_separately: 15000,
  head_of_household: 22500,
} as const;

// 2025 FICA rates
export const FICA = {
  socialSecurityRate: 0.062,
  socialSecurityWageCap: 176100,
  medicareRate: 0.0145,
  additionalMedicareRate: 0.009,
  additionalMedicareThreshold: {
    single: 200000,
    married_jointly: 250000,
    married_separately: 125000,
    head_of_household: 200000,
  },
} as const;

// State income tax rates (simplified flat/top marginal rates for all 50 states + DC)
// States with progressive brackets use the top marginal rate for simplicity;
// states with no income tax are 0.
export const STATE_TAX_RATES: Record<string, { rate: number; name: string }> = {
  AL: { rate: 0.05, name: 'Alabama' },
  AK: { rate: 0, name: 'Alaska' },
  AZ: { rate: 0.025, name: 'Arizona' },
  AR: { rate: 0.044, name: 'Arkansas' },
  CA: { rate: 0.133, name: 'California' },
  CO: { rate: 0.044, name: 'Colorado' },
  CT: { rate: 0.0699, name: 'Connecticut' },
  DE: { rate: 0.066, name: 'Delaware' },
  DC: { rate: 0.1075, name: 'District of Columbia' },
  FL: { rate: 0, name: 'Florida' },
  GA: { rate: 0.0549, name: 'Georgia' },
  HI: { rate: 0.11, name: 'Hawaii' },
  ID: { rate: 0.058, name: 'Idaho' },
  IL: { rate: 0.0495, name: 'Illinois' },
  IN: { rate: 0.0305, name: 'Indiana' },
  IA: { rate: 0.06, name: 'Iowa' },
  KS: { rate: 0.057, name: 'Kansas' },
  KY: { rate: 0.04, name: 'Kentucky' },
  LA: { rate: 0.0425, name: 'Louisiana' },
  ME: { rate: 0.0715, name: 'Maine' },
  MD: { rate: 0.0575, name: 'Maryland' },
  MA: { rate: 0.09, name: 'Massachusetts' },
  MI: { rate: 0.0425, name: 'Michigan' },
  MN: { rate: 0.0985, name: 'Minnesota' },
  MS: { rate: 0.05, name: 'Mississippi' },
  MO: { rate: 0.048, name: 'Missouri' },
  MT: { rate: 0.059, name: 'Montana' },
  NE: { rate: 0.0584, name: 'Nebraska' },
  NV: { rate: 0, name: 'Nevada' },
  NH: { rate: 0, name: 'New Hampshire' },
  NJ: { rate: 0.1075, name: 'New Jersey' },
  NM: { rate: 0.059, name: 'New Mexico' },
  NY: { rate: 0.109, name: 'New York' },
  NC: { rate: 0.045, name: 'North Carolina' },
  ND: { rate: 0.025, name: 'North Dakota' },
  OH: { rate: 0.0357, name: 'Ohio' },
  OK: { rate: 0.0475, name: 'Oklahoma' },
  OR: { rate: 0.099, name: 'Oregon' },
  PA: { rate: 0.0307, name: 'Pennsylvania' },
  RI: { rate: 0.0599, name: 'Rhode Island' },
  SC: { rate: 0.064, name: 'South Carolina' },
  SD: { rate: 0, name: 'South Dakota' },
  TN: { rate: 0, name: 'Tennessee' },
  TX: { rate: 0, name: 'Texas' },
  UT: { rate: 0.0465, name: 'Utah' },
  VT: { rate: 0.0875, name: 'Vermont' },
  VA: { rate: 0.0575, name: 'Virginia' },
  WA: { rate: 0, name: 'Washington' },
  WV: { rate: 0.0512, name: 'West Virginia' },
  WI: { rate: 0.0765, name: 'Wisconsin' },
  WY: { rate: 0, name: 'Wyoming' },
};

// 2025 Long-Term Capital Gains Brackets
// Rates depend on total taxable income (ordinary + cap gains), with gains stacking on top.
export const CAPITAL_GAINS_BRACKETS = {
  single: [
    { min: 0, max: 48350, rate: 0 },
    { min: 48350, max: 533400, rate: 0.15 },
    { min: 533400, max: Infinity, rate: 0.20 },
  ],
  married_jointly: [
    { min: 0, max: 96700, rate: 0 },
    { min: 96700, max: 600050, rate: 0.15 },
    { min: 600050, max: Infinity, rate: 0.20 },
  ],
  married_separately: [
    { min: 0, max: 48350, rate: 0 },
    { min: 48350, max: 300000, rate: 0.15 },
    { min: 300000, max: Infinity, rate: 0.20 },
  ],
  head_of_household: [
    { min: 0, max: 64750, rate: 0 },
    { min: 64750, max: 566700, rate: 0.15 },
    { min: 566700, max: Infinity, rate: 0.20 },
  ],
} as const;

// FilingStatus type is exported from shared/types/index.ts
