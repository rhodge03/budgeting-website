import type {
  HouseholdSnapshot,
  Earner,
  IncomeEntry,
  SavingsBalance,
  RetirementSettings,
  RateOfReturn,
  ExpenseCategory,
  ExpenseSubCategory,
  MemberType,
} from 'shared';
import { DEFAULT_EXPENSE_CATEGORIES } from 'shared';

const STORAGE_KEY = 'guest_household';

type EarnerWithRelations = HouseholdSnapshot['earners'][number];

// ── Core read/write ──────────────────────────────────

export function getSnapshot(): HouseholdSnapshot {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initializeGuest();
  return JSON.parse(raw);
}

function saveSnapshot(snapshot: HouseholdSnapshot): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function initializeGuest(): HouseholdSnapshot {
  const householdId = crypto.randomUUID();
  const now = new Date().toISOString();

  const expenseCategories: ExpenseCategory[] = DEFAULT_EXPENSE_CATEGORIES.map((cat, i) => {
    const catId = crypto.randomUUID();
    return {
      id: catId,
      householdId,
      name: cat.name,
      isDefault: true,
      isCollapsed: false,
      sortOrder: i,
      subCategories: cat.subCategories.map((subName, j) => ({
        id: crypto.randomUUID(),
        categoryId: catId,
        name: subName,
        amount: 0,
        isDefault: true,
        sortOrder: j,
      })),
    };
  });

  const snapshot: HouseholdSnapshot = {
    household: {
      id: householdId,
      name: 'My Household',
      expenseBuffer: 0,
      createdAt: now,
      updatedAt: now,
    },
    earners: [],
    expenseCategories,
  };

  saveSnapshot(snapshot);
  return snapshot;
}

export function clearGuestData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasGuestData(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

// ── Household ────────────────────────────────────────

export function updateHousehold(data: Partial<HouseholdSnapshot['household']>): HouseholdSnapshot['household'] {
  const snapshot = getSnapshot();
  snapshot.household = { ...snapshot.household, ...data, updatedAt: new Date().toISOString() };
  saveSnapshot(snapshot);
  return snapshot.household;
}

// ── Earners ──────────────────────────────────────────

export function createEarner(name: string, memberType: MemberType = 'adult'): EarnerWithRelations {
  const snapshot = getSnapshot();
  const earnerId = crypto.randomUUID();
  const isChild = memberType === 'child';
  const isPrimary = isChild ? false : snapshot.earners.length === 0;
  const now = new Date().toISOString();

  const earner: EarnerWithRelations = {
    id: earnerId,
    householdId: snapshot.household.id,
    name,
    memberType,
    avatarIcon: null,
    dateOfBirth: null,
    state: 'CA',
    filingStatus: 'single',
    deductionType: 'standard',
    isArchived: false,
    isPrimary,
    sortOrder: snapshot.earners.length,
    createdAt: now,
    updatedAt: now,
    incomeEntries: [],
    savingsBalance: {
      id: crypto.randomUUID(),
      earnerId,
      generalSavingsBalance: 0,
      fourOneKBalance: 0,
      contributionPercent: 0,
      employerMatchPercent: 0,
      salaryGrowthRate: 0,
    },
    retirementSettings: {
      id: crypto.randomUUID(),
      earnerId,
      currentAge: isChild ? 0 : 18,
      targetRetirementAge: 65,
      withdrawalAge: 59,
      retirementGoal: 0,
    },
    rateOfReturn: {
      id: crypto.randomUUID(),
      earnerId,
      annualRate: 10.0,
      benchmarkType: null,
    },
    itemizedDeductions: [],
  };

  snapshot.earners.push(earner);
  saveSnapshot(snapshot);
  return earner;
}

export function updateEarner(id: string, data: Partial<Earner>): Earner {
  const snapshot = getSnapshot();
  const earner = snapshot.earners.find((e) => e.id === id);
  if (!earner) throw new Error('Earner not found');
  Object.assign(earner, data, { updatedAt: new Date().toISOString() });
  saveSnapshot(snapshot);
  return earner;
}

export function archiveEarner(id: string): void {
  const snapshot = getSnapshot();
  snapshot.earners = snapshot.earners.filter((e) => e.id !== id);
  saveSnapshot(snapshot);
}

export function removeEarner(id: string): void {
  const snapshot = getSnapshot();
  const removed = snapshot.earners.find((e) => e.id === id);
  snapshot.earners = snapshot.earners.filter((e) => e.id !== id);
  // Reassign primary if needed
  if (removed?.isPrimary && snapshot.earners.length > 0) {
    snapshot.earners[0].isPrimary = true;
  }
  saveSnapshot(snapshot);
}

export function setPrimaryEarner(id: string): void {
  const snapshot = getSnapshot();
  snapshot.earners.forEach((e) => { e.isPrimary = e.id === id; });
  saveSnapshot(snapshot);
}

// ── Income ───────────────────────────────────────────

export function createIncome(earnerId: string, data: { label: string; amount: number; isTaxable?: boolean }): IncomeEntry {
  const snapshot = getSnapshot();
  const earner = snapshot.earners.find((e) => e.id === earnerId);
  if (!earner) throw new Error('Earner not found');

  const entry: IncomeEntry = {
    id: crypto.randomUUID(),
    earnerId,
    label: data.label,
    amount: data.amount,
    isTaxable: data.isTaxable ?? true,
    durationYears: null,
    growthRate: null,
    sortOrder: earner.incomeEntries.length,
  };

  earner.incomeEntries.push(entry);
  saveSnapshot(snapshot);
  return entry;
}

export function updateIncome(id: string, data: Partial<IncomeEntry>): IncomeEntry {
  const snapshot = getSnapshot();
  for (const earner of snapshot.earners) {
    const entry = earner.incomeEntries.find((ie) => ie.id === id);
    if (entry) {
      Object.assign(entry, data);
      saveSnapshot(snapshot);
      return entry;
    }
  }
  throw new Error('Income entry not found');
}

export function removeIncome(id: string): void {
  const snapshot = getSnapshot();
  for (const earner of snapshot.earners) {
    const idx = earner.incomeEntries.findIndex((ie) => ie.id === id);
    if (idx !== -1) {
      earner.incomeEntries.splice(idx, 1);
      saveSnapshot(snapshot);
      return;
    }
  }
}

// ── Savings / Retirement / Rate of Return ────────────

export function updateSavings(earnerId: string, data: Partial<SavingsBalance>): SavingsBalance {
  const snapshot = getSnapshot();
  const earner = snapshot.earners.find((e) => e.id === earnerId);
  if (!earner) throw new Error('Earner not found');

  if (!earner.savingsBalance) {
    earner.savingsBalance = {
      id: crypto.randomUUID(),
      earnerId,
      generalSavingsBalance: 0,
      fourOneKBalance: 0,
      contributionPercent: 0,
      employerMatchPercent: 0,
      salaryGrowthRate: 0,
    };
  }
  Object.assign(earner.savingsBalance, data);
  saveSnapshot(snapshot);
  return earner.savingsBalance;
}

export function updateRetirement(earnerId: string, data: Partial<RetirementSettings>): RetirementSettings {
  const snapshot = getSnapshot();
  const earner = snapshot.earners.find((e) => e.id === earnerId);
  if (!earner) throw new Error('Earner not found');

  if (!earner.retirementSettings) {
    earner.retirementSettings = {
      id: crypto.randomUUID(),
      earnerId,
      currentAge: 18,
      targetRetirementAge: 65,
      withdrawalAge: 59,
      retirementGoal: 0,
    };
  }
  Object.assign(earner.retirementSettings, data);
  saveSnapshot(snapshot);
  return earner.retirementSettings;
}

export function updateRateOfReturn(earnerId: string, data: Partial<RateOfReturn>): RateOfReturn {
  const snapshot = getSnapshot();
  const earner = snapshot.earners.find((e) => e.id === earnerId);
  if (!earner) throw new Error('Earner not found');

  if (!earner.rateOfReturn) {
    earner.rateOfReturn = {
      id: crypto.randomUUID(),
      earnerId,
      annualRate: 10.0,
      benchmarkType: null,
    };
  }
  Object.assign(earner.rateOfReturn, data);
  saveSnapshot(snapshot);
  return earner.rateOfReturn;
}

// ── Expenses ─────────────────────────────────────────

export function createCategory(data: { name: string }): ExpenseCategory {
  const snapshot = getSnapshot();
  const category: ExpenseCategory = {
    id: crypto.randomUUID(),
    householdId: snapshot.household.id,
    name: data.name,
    isDefault: false,
    isCollapsed: false,
    sortOrder: snapshot.expenseCategories.length,
    subCategories: [],
  };
  snapshot.expenseCategories.push(category);
  saveSnapshot(snapshot);
  return category;
}

export function updateCategory(id: string, data: Partial<ExpenseCategory>): ExpenseCategory {
  const snapshot = getSnapshot();
  const cat = snapshot.expenseCategories.find((c) => c.id === id);
  if (!cat) throw new Error('Category not found');
  Object.assign(cat, data);
  saveSnapshot(snapshot);
  return cat;
}

export function removeCategory(id: string): void {
  const snapshot = getSnapshot();
  snapshot.expenseCategories = snapshot.expenseCategories.filter((c) => c.id !== id);
  saveSnapshot(snapshot);
}

export function createSubCategory(categoryId: string, data: { name: string }): ExpenseSubCategory {
  const snapshot = getSnapshot();
  const cat = snapshot.expenseCategories.find((c) => c.id === categoryId);
  if (!cat) throw new Error('Category not found');

  const sub: ExpenseSubCategory = {
    id: crypto.randomUUID(),
    categoryId,
    name: data.name,
    amount: 0,
    isDefault: false,
    sortOrder: cat.subCategories.length,
  };
  cat.subCategories.push(sub);
  saveSnapshot(snapshot);
  return sub;
}

export function updateSubCategory(id: string, data: Partial<ExpenseSubCategory>): ExpenseSubCategory {
  const snapshot = getSnapshot();
  for (const cat of snapshot.expenseCategories) {
    const sub = cat.subCategories.find((s) => s.id === id);
    if (sub) {
      Object.assign(sub, data);
      saveSnapshot(snapshot);
      return sub;
    }
  }
  throw new Error('SubCategory not found');
}

export function removeSubCategory(id: string): void {
  const snapshot = getSnapshot();
  for (const cat of snapshot.expenseCategories) {
    const idx = cat.subCategories.findIndex((s) => s.id === id);
    if (idx !== -1) {
      cat.subCategories.splice(idx, 1);
      saveSnapshot(snapshot);
      return;
    }
  }
}
