import { create } from 'zustand';
import type { HouseholdSnapshot, Earner, IncomeEntry, SavingsBalance, RetirementSettings, RateOfReturn, ExpenseCategory, ExpenseSubCategory, ExpenseScenario, MemberType } from 'shared';
import * as householdApi from '../api/household';
import * as earnersApi from '../api/earners';
import * as incomeApi from '../api/income';
import * as savingsApi from '../api/savings';
import * as retirementApi from '../api/retirement';
import * as rateOfReturnApi from '../api/rateOfReturn';
import * as expensesApi from '../api/expenses';
import * as scenariosApi from '../api/expenseScenarios';
import * as guestStorage from '../services/guestStorage';
import { useAuthStore } from './authStore';

type EarnerWithRelations = HouseholdSnapshot['earners'][number];

function isGuestMode(): boolean {
  return useAuthStore.getState().isGuest;
}

interface HouseholdState {
  // Data
  household: HouseholdSnapshot['household'] | null;
  earners: EarnerWithRelations[];
  expenseCategories: ExpenseCategory[];
  expenseScenarios: ExpenseScenario[];

  // Status
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSnapshot: () => Promise<void>;
  reset: () => void;
  updateHousehold: (data: Partial<HouseholdSnapshot['household']>) => Promise<void>;

  // Earner actions
  addEarner: (name: string, memberType?: MemberType) => Promise<void>;
  updateEarner: (id: string, data: Partial<Earner>) => Promise<void>;
  archiveEarner: (id: string) => Promise<void>;
  removeEarner: (id: string) => Promise<void>;
  setPrimaryEarner: (id: string) => Promise<void>;

  // Income actions
  addIncomeEntry: (earnerId: string, data: { label: string; amount: number; isTaxable?: boolean }) => Promise<void>;
  updateIncomeEntry: (entryId: string, data: Partial<IncomeEntry>) => Promise<void>;
  removeIncomeEntry: (entryId: string, earnerId: string) => Promise<void>;

  // Expense actions
  addExpenseCategory: (name: string) => Promise<void>;
  updateExpenseCategory: (id: string, data: Partial<ExpenseCategory>) => Promise<void>;
  removeExpenseCategory: (id: string) => Promise<void>;
  addExpenseSubCategory: (categoryId: string, name: string) => Promise<void>;
  updateExpenseSubCategory: (id: string, categoryId: string, data: Partial<ExpenseSubCategory>) => Promise<void>;
  removeExpenseSubCategory: (id: string, categoryId: string) => Promise<void>;

  // Expense scenario actions
  createScenario: (name: string) => Promise<void>;
  renameScenario: (id: string, name: string) => Promise<void>;
  removeScenario: (id: string) => Promise<void>;
  switchScenario: (id: string) => Promise<void>;

  // Settings actions (centralizes persistence for components)
  updateSavings: (earnerId: string, data: Partial<SavingsBalance>) => Promise<void>;
  updateRetirement: (earnerId: string, data: Partial<RetirementSettings>) => Promise<void>;
  updateRateOfReturn: (earnerId: string, data: Partial<RateOfReturn>) => Promise<void>;

  // Local earner data updates (sync store without API call)
  patchEarnerData: (earnerId: string, patch: Partial<EarnerWithRelations>) => void;
}

export const useHouseholdStore = create<HouseholdState>((set, get) => ({
  household: null,
  earners: [],
  expenseCategories: [],
  expenseScenarios: [],
  isLoading: false,
  error: null,

  loadSnapshot: async () => {
    const isInitial = get().household === null;
    if (isInitial) set({ isLoading: true, error: null });
    try {
      const snapshot = isGuestMode()
        ? guestStorage.getSnapshot()
        : await householdApi.getSnapshot();
      set({
        household: snapshot.household,
        earners: snapshot.earners,
        expenseCategories: snapshot.expenseCategories,
        expenseScenarios: snapshot.expenseScenarios ?? [],
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  reset: () => {
    set({
      household: null,
      earners: [],
      expenseCategories: [],
      expenseScenarios: [],
      isLoading: false,
      error: null,
    });
  },

  updateHousehold: async (data) => {
    set((state) => ({
      household: state.household ? { ...state.household, ...data } : state.household,
    }));
    if (isGuestMode()) {
      guestStorage.updateHousehold(data);
    } else {
      await householdApi.update(data);
    }
  },

  addEarner: async (name, memberType = 'adult') => {
    if (isGuestMode()) {
      const earner = guestStorage.createEarner(name, memberType);
      set((state) => ({ earners: [...state.earners, earner] }));
      return;
    }
    const earner = await earnersApi.create(name, memberType);
    set((state) => ({
      earners: [...state.earners, earner as EarnerWithRelations],
    }));
  },

  updateEarner: async (id, data) => {
    if (isGuestMode()) {
      guestStorage.updateEarner(id, data);
      set((state) => ({
        earners: state.earners.map((e) => e.id === id ? { ...e, ...data } : e),
      }));
      return;
    }
    const updated = await earnersApi.update(id, data);
    set((state) => ({
      earners: state.earners.map((e) =>
        e.id === id ? { ...e, ...updated } : e,
      ),
    }));
  },

  archiveEarner: async (id) => {
    if (isGuestMode()) {
      guestStorage.archiveEarner(id);
    } else {
      await earnersApi.archive(id);
    }
    set((state) => ({
      earners: state.earners.filter((e) => e.id !== id),
    }));
  },

  removeEarner: async (id) => {
    if (isGuestMode()) {
      guestStorage.removeEarner(id);
    } else {
      await earnersApi.remove(id);
    }
    set((state) => ({
      earners: state.earners.filter((e) => e.id !== id),
    }));
  },

  setPrimaryEarner: async (id) => {
    if (isGuestMode()) {
      guestStorage.setPrimaryEarner(id);
    } else {
      await earnersApi.setPrimary(id);
    }
    set((state) => ({
      earners: state.earners.map((e) => ({
        ...e,
        isPrimary: e.id === id,
      })),
    }));
  },

  addIncomeEntry: async (earnerId, data) => {
    if (isGuestMode()) {
      const entry = guestStorage.createIncome(earnerId, data);
      set((state) => ({
        earners: state.earners.map((e) =>
          e.id === earnerId ? { ...e, incomeEntries: [...e.incomeEntries, entry] } : e,
        ),
      }));
      return;
    }
    const entry = await incomeApi.create(earnerId, data);
    set((state) => ({
      earners: state.earners.map((e) =>
        e.id === earnerId
          ? { ...e, incomeEntries: [...e.incomeEntries, entry] }
          : e,
      ),
    }));
  },

  updateIncomeEntry: async (entryId, data) => {
    if (isGuestMode()) {
      const updated = guestStorage.updateIncome(entryId, data);
      set((state) => ({
        earners: state.earners.map((e) => ({
          ...e,
          incomeEntries: e.incomeEntries.map((ie) =>
            ie.id === entryId ? { ...ie, ...updated } : ie,
          ),
        })),
      }));
      return;
    }
    const updated = await incomeApi.update(entryId, data);
    set((state) => ({
      earners: state.earners.map((e) => ({
        ...e,
        incomeEntries: e.incomeEntries.map((ie) =>
          ie.id === entryId ? { ...ie, ...updated } : ie,
        ),
      })),
    }));
  },

  removeIncomeEntry: async (entryId, earnerId) => {
    if (isGuestMode()) {
      guestStorage.removeIncome(entryId);
    } else {
      await incomeApi.remove(entryId);
    }
    set((state) => ({
      earners: state.earners.map((e) =>
        e.id === earnerId
          ? { ...e, incomeEntries: e.incomeEntries.filter((ie) => ie.id !== entryId) }
          : e,
      ),
    }));
  },

  addExpenseCategory: async (name) => {
    if (isGuestMode()) {
      const category = guestStorage.createCategory({ name });
      set((state) => ({ expenseCategories: [...state.expenseCategories, category] }));
      return;
    }
    const category = await expensesApi.createCategory({ name });
    set((state) => ({
      expenseCategories: [...state.expenseCategories, category],
    }));
  },

  updateExpenseCategory: async (id, data) => {
    if (isGuestMode()) {
      const updated = guestStorage.updateCategory(id, data);
      set((state) => ({
        expenseCategories: state.expenseCategories.map((c) => c.id === id ? updated : c),
      }));
      return;
    }
    const updated = await expensesApi.updateCategory(id, data);
    set((state) => ({
      expenseCategories: state.expenseCategories.map((c) =>
        c.id === id ? updated : c,
      ),
    }));
  },

  removeExpenseCategory: async (id) => {
    if (isGuestMode()) {
      guestStorage.removeCategory(id);
    } else {
      await expensesApi.removeCategory(id);
    }
    set((state) => ({
      expenseCategories: state.expenseCategories.filter((c) => c.id !== id),
    }));
  },

  addExpenseSubCategory: async (categoryId, name) => {
    if (isGuestMode()) {
      const sub = guestStorage.createSubCategory(categoryId, { name });
      set((state) => ({
        expenseCategories: state.expenseCategories.map((c) =>
          c.id === categoryId ? { ...c, subCategories: [...c.subCategories, sub] } : c,
        ),
      }));
      return;
    }
    const sub = await expensesApi.createSubCategory(categoryId, { name });
    set((state) => ({
      expenseCategories: state.expenseCategories.map((c) =>
        c.id === categoryId
          ? { ...c, subCategories: [...c.subCategories, sub] }
          : c,
      ),
    }));
  },

  updateExpenseSubCategory: async (id, categoryId, data) => {
    if (isGuestMode()) {
      const updated = guestStorage.updateSubCategory(id, data);
      set((state) => ({
        expenseCategories: state.expenseCategories.map((c) =>
          c.id === categoryId
            ? { ...c, subCategories: c.subCategories.map((s) => s.id === id ? { ...s, ...updated } : s) }
            : c,
        ),
      }));
      return;
    }
    const updated = await expensesApi.updateSubCategory(id, data);
    set((state) => ({
      expenseCategories: state.expenseCategories.map((c) =>
        c.id === categoryId
          ? { ...c, subCategories: c.subCategories.map((s) => s.id === id ? { ...s, ...updated } : s) }
          : c,
      ),
    }));
  },

  removeExpenseSubCategory: async (id, categoryId) => {
    if (isGuestMode()) {
      guestStorage.removeSubCategory(id);
    } else {
      await expensesApi.removeSubCategory(id);
    }
    set((state) => ({
      expenseCategories: state.expenseCategories.map((c) =>
        c.id === categoryId
          ? { ...c, subCategories: c.subCategories.filter((s) => s.id !== id) }
          : c,
      ),
    }));
  },

  createScenario: async (name) => {
    if (isGuestMode()) {
      const scenario = guestStorage.createScenario(name);
      set((state) => ({ expenseScenarios: [...state.expenseScenarios, scenario] }));
      return;
    }
    const scenario = await scenariosApi.create({ name });
    set((state) => ({ expenseScenarios: [...state.expenseScenarios, scenario] }));
  },

  renameScenario: async (id, name) => {
    if (isGuestMode()) {
      const updated = guestStorage.renameScenario(id, name);
      set((state) => ({
        expenseScenarios: state.expenseScenarios.map((s) => s.id === id ? updated : s),
      }));
      return;
    }
    const updated = await scenariosApi.rename(id, name);
    set((state) => ({
      expenseScenarios: state.expenseScenarios.map((s) => s.id === id ? updated : s),
    }));
  },

  removeScenario: async (id) => {
    if (isGuestMode()) {
      guestStorage.removeScenario(id);
    } else {
      await scenariosApi.remove(id);
    }
    set((state) => ({
      expenseScenarios: state.expenseScenarios.filter((s) => s.id !== id),
      household: state.household?.activeExpenseScenarioId === id
        ? { ...state.household, activeExpenseScenarioId: null }
        : state.household,
    }));
  },

  switchScenario: async (id) => {
    if (isGuestMode()) {
      const result = guestStorage.switchScenario(id);
      set({
        household: result.household,
        expenseCategories: result.expenseCategories,
        expenseScenarios: result.expenseScenarios,
      });
      return;
    }
    const result = await scenariosApi.switchTo(id);
    set({
      household: result.household,
      expenseCategories: result.expenseCategories,
      expenseScenarios: result.expenseScenarios,
    });
  },

  updateSavings: async (earnerId, data) => {
    const earner = get().earners.find((e) => e.id === earnerId);
    if (!earner) return;
    const updated = { ...earner.savingsBalance, ...data } as any;
    get().patchEarnerData(earnerId, { savingsBalance: updated });
    if (isGuestMode()) {
      guestStorage.updateSavings(earnerId, data);
    } else {
      await savingsApi.update(earnerId, data);
    }
  },

  updateRetirement: async (earnerId, data) => {
    const earner = get().earners.find((e) => e.id === earnerId);
    if (!earner) return;
    const updated = { ...earner.retirementSettings, ...data } as any;
    get().patchEarnerData(earnerId, { retirementSettings: updated });
    if (isGuestMode()) {
      guestStorage.updateRetirement(earnerId, data);
    } else {
      await retirementApi.update(earnerId, data);
    }
  },

  updateRateOfReturn: async (earnerId, data) => {
    const earner = get().earners.find((e) => e.id === earnerId);
    if (!earner) return;
    const updated = { ...earner.rateOfReturn, ...data } as any;
    get().patchEarnerData(earnerId, { rateOfReturn: updated });
    if (isGuestMode()) {
      guestStorage.updateRateOfReturn(earnerId, data);
    } else {
      await rateOfReturnApi.update(earnerId, data);
    }
  },

  patchEarnerData: (earnerId, patch) => {
    set((state) => ({
      earners: state.earners.map((e) =>
        e.id === earnerId ? { ...e, ...patch } : e,
      ),
    }));
  },
}));
