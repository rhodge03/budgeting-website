// Shared types between client and server

export interface Household {
  id: string;
  name: string;
  expenseBuffer: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  householdId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Earner {
  id: string;
  householdId: string;
  name: string;
  dateOfBirth: string | null;
  state: string;
  filingStatus: FilingStatus;
  deductionType: DeductionType;
  isArchived: boolean;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type FilingStatus = 'single' | 'married_jointly' | 'married_separately' | 'head_of_household';
export type DeductionType = 'standard' | 'itemized';

export interface IncomeEntry {
  id: string;
  earnerId: string;
  label: string;
  amount: number;
  isTaxable: boolean;
  durationYears: number | null;
  sortOrder: number;
}

export interface SavingsBalance {
  id: string;
  earnerId: string;
  generalSavingsBalance: number;
  fourOneKBalance: number;
  contributionPercent: number;
  employerMatchPercent: number;
  salaryGrowthRate: number;
}

export interface RetirementSettings {
  id: string;
  earnerId: string;
  currentAge: number;
  targetRetirementAge: number;
  withdrawalAge: number;
  retirementGoal: number;
}

export interface RateOfReturn {
  id: string;
  earnerId: string;
  annualRate: number;
  benchmarkType: 'sp500' | 'dow' | 'gold' | null;
}

export interface ItemizedDeduction {
  id: string;
  earnerId: string;
  label: string;
  amount: number;
  sortOrder: number;
}

export interface ExpenseCategory {
  id: string;
  householdId: string;
  name: string;
  isDefault: boolean;
  isCollapsed: boolean;
  sortOrder: number;
  subCategories: ExpenseSubCategory[];
}

export interface ExpenseSubCategory {
  id: string;
  categoryId: string;
  name: string;
  amount: number;
  isDefault: boolean;
  sortOrder: number;
}

export interface HouseholdSnapshot {
  household: Household;
  earners: (Earner & {
    incomeEntries: IncomeEntry[];
    savingsBalance: SavingsBalance | null;
    retirementSettings: RetirementSettings | null;
    rateOfReturn: RateOfReturn | null;
    itemizedDeductions: ItemizedDeduction[];
  })[];
  expenseCategories: ExpenseCategory[];
}
