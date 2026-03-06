import type {
  HouseholdSnapshot,
  Earner,
  IncomeEntry,
  SavingsBalance,
  RetirementSettings,
  RateOfReturn,
  ExpenseCategory,
  ExpenseSubCategory,
  ExpenseScenario,
  HomePurchase,
  MemberType,
} from 'shared';
import { DEFAULT_EXPENSE_CATEGORIES } from 'shared';

const STORAGE_KEY = 'guest_household';

type EarnerWithRelations = HouseholdSnapshot['earners'][number];

// ── Core read/write ──────────────────────────────────

export function getSnapshot(): HouseholdSnapshot {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initializeGuest();
  const snapshot = JSON.parse(raw) as HouseholdSnapshot;
  // Migrate older guest data that lacks scenario fields
  if (!snapshot.expenseScenarios) snapshot.expenseScenarios = [];
  if (snapshot.household.activeExpenseScenarioId === undefined) {
    snapshot.household.activeExpenseScenarioId = null;
  }
  // Migrate older guest data that lacks homePurchase
  if ((snapshot as any).homePurchase === undefined) snapshot.homePurchase = null;
  return snapshot;
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
      activeExpenseScenarioId: null,
      createdAt: now,
      updatedAt: now,
    },
    earners: [],
    expenseCategories,
    expenseScenarios: [],
    homePurchase: null,
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
      monthlyContribution: 0,
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
      monthlyContribution: 0,
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

// ── Expense Scenarios ───────────────────────────────

export function createScenario(name: string): ExpenseScenario {
  const snapshot = getSnapshot();
  const scenario: ExpenseScenario = {
    id: crypto.randomUUID(),
    householdId: snapshot.household.id,
    name,
    expenseData: JSON.parse(JSON.stringify(snapshot.expenseCategories)),
    expenseBuffer: snapshot.household.expenseBuffer,
    homePurchase: snapshot.homePurchase ? JSON.parse(JSON.stringify(snapshot.homePurchase)) : null,
    sortOrder: snapshot.expenseScenarios.length,
  };
  snapshot.expenseScenarios.push(scenario);
  saveSnapshot(snapshot);
  return scenario;
}

export function renameScenario(id: string, name: string): ExpenseScenario {
  const snapshot = getSnapshot();
  const scenario = snapshot.expenseScenarios.find((s) => s.id === id);
  if (!scenario) throw new Error('Scenario not found');
  scenario.name = name;
  saveSnapshot(snapshot);
  return scenario;
}

export function removeScenario(id: string): void {
  const snapshot = getSnapshot();
  snapshot.expenseScenarios = snapshot.expenseScenarios.filter((s) => s.id !== id);
  if (snapshot.household.activeExpenseScenarioId === id) {
    snapshot.household.activeExpenseScenarioId = null;
  }
  saveSnapshot(snapshot);
}

export function switchScenario(id: string): {
  household: HouseholdSnapshot['household'];
  expenseCategories: ExpenseCategory[];
  expenseScenarios: ExpenseScenario[];
  homePurchase: HouseholdSnapshot['homePurchase'];
} {
  const snapshot = getSnapshot();
  const target = snapshot.expenseScenarios.find((s) => s.id === id);
  if (!target) throw new Error('Scenario not found');

  // Auto-save current expenses + home purchase into the previously active scenario
  if (snapshot.household.activeExpenseScenarioId && snapshot.household.activeExpenseScenarioId !== id) {
    const prev = snapshot.expenseScenarios.find((s) => s.id === snapshot.household.activeExpenseScenarioId);
    if (prev) {
      prev.expenseData = JSON.parse(JSON.stringify(snapshot.expenseCategories));
      prev.expenseBuffer = snapshot.household.expenseBuffer;
      prev.homePurchase = snapshot.homePurchase ? JSON.parse(JSON.stringify(snapshot.homePurchase)) : null;
    }
  }

  // Load target scenario's expenses + home purchase
  snapshot.expenseCategories = JSON.parse(JSON.stringify(target.expenseData));
  snapshot.household.expenseBuffer = target.expenseBuffer;
  snapshot.homePurchase = target.homePurchase ? JSON.parse(JSON.stringify(target.homePurchase)) : null;
  snapshot.household.activeExpenseScenarioId = id;
  snapshot.household.updatedAt = new Date().toISOString();

  saveSnapshot(snapshot);
  return {
    household: snapshot.household,
    expenseCategories: snapshot.expenseCategories,
    expenseScenarios: snapshot.expenseScenarios,
    homePurchase: snapshot.homePurchase,
  };
}

export function saveCurrentScenario(): void {
  const snapshot = getSnapshot();
  if (!snapshot.household.activeExpenseScenarioId) return;
  const active = snapshot.expenseScenarios.find((s) => s.id === snapshot.household.activeExpenseScenarioId);
  if (active) {
    active.expenseData = JSON.parse(JSON.stringify(snapshot.expenseCategories));
    active.expenseBuffer = snapshot.household.expenseBuffer;
    active.homePurchase = snapshot.homePurchase ? JSON.parse(JSON.stringify(snapshot.homePurchase)) : null;
    saveSnapshot(snapshot);
  }
}

// ── Home Purchase ───────────────────────────────────

export function upsertHomePurchase(data: Omit<HomePurchase, 'id' | 'householdId'>): HomePurchase {
  const snapshot = getSnapshot();
  const hp: HomePurchase = {
    id: snapshot.homePurchase?.id ?? crypto.randomUUID(),
    householdId: snapshot.household.id,
    ...data,
  };
  snapshot.homePurchase = hp;
  saveSnapshot(snapshot);
  return hp;
}

export function removeHomePurchase(): void {
  const snapshot = getSnapshot();
  snapshot.homePurchase = null;
  saveSnapshot(snapshot);
}
