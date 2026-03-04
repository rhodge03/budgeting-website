import { create } from 'zustand';
import type { HouseholdSnapshot, Earner, IncomeEntry, ExpenseCategory, ExpenseSubCategory } from 'shared';
import * as householdApi from '../api/household';
import * as earnersApi from '../api/earners';
import * as incomeApi from '../api/income';
import * as expensesApi from '../api/expenses';

type EarnerWithRelations = HouseholdSnapshot['earners'][number];

interface HouseholdState {
  // Data
  household: HouseholdSnapshot['household'] | null;
  earners: EarnerWithRelations[];
  expenseCategories: ExpenseCategory[];
  selectedEarnerId: string | null;

  // Status
  isLoading: boolean;
  error: string | null;

  // Computed
  selectedEarner: () => EarnerWithRelations | undefined;

  // Actions
  loadSnapshot: () => Promise<void>;
  reset: () => void;

  // Earner actions
  addEarner: (name: string) => Promise<void>;
  updateEarner: (id: string, data: Partial<Earner>) => Promise<void>;
  archiveEarner: (id: string) => Promise<void>;
  removeEarner: (id: string) => Promise<void>;
  setPrimaryEarner: (id: string) => Promise<void>;
  selectEarner: (id: string) => void;

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

  // Local earner data updates (sync store without API call)
  patchEarnerData: (earnerId: string, patch: Partial<EarnerWithRelations>) => void;
}

export const useHouseholdStore = create<HouseholdState>((set, get) => ({
  household: null,
  earners: [],
  expenseCategories: [],
  selectedEarnerId: null,
  isLoading: false,
  error: null,

  selectedEarner: () => {
    const { earners, selectedEarnerId } = get();
    return earners.find((e) => e.id === selectedEarnerId);
  },

  loadSnapshot: async () => {
    const isInitial = get().household === null;
    if (isInitial) set({ isLoading: true, error: null });
    try {
      const snapshot = await householdApi.getSnapshot();
      const currentSelectedId = get().selectedEarnerId;
      const stillExists = snapshot.earners.some((e) => e.id === currentSelectedId);
      const primaryOrFirst = snapshot.earners.find((e) => e.isPrimary) || snapshot.earners[0];
      set({
        household: snapshot.household,
        earners: snapshot.earners,
        expenseCategories: snapshot.expenseCategories,
        selectedEarnerId: stillExists ? currentSelectedId : (primaryOrFirst?.id || null),
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
      selectedEarnerId: null,
      isLoading: false,
      error: null,
    });
  },

  addEarner: async (name) => {
    const earner = await earnersApi.create(name);
    set((state) => ({
      earners: [...state.earners, earner as EarnerWithRelations],
      selectedEarnerId: state.earners.length === 0 ? earner.id : state.selectedEarnerId,
    }));
  },

  updateEarner: async (id, data) => {
    const updated = await earnersApi.update(id, data);
    set((state) => ({
      earners: state.earners.map((e) =>
        e.id === id ? { ...e, ...updated } : e,
      ),
    }));
  },

  archiveEarner: async (id) => {
    await earnersApi.archive(id);
    set((state) => {
      const earners = state.earners.filter((e) => e.id !== id);
      return {
        earners,
        selectedEarnerId:
          state.selectedEarnerId === id
            ? earners[0]?.id || null
            : state.selectedEarnerId,
      };
    });
  },

  removeEarner: async (id) => {
    await earnersApi.remove(id);
    set((state) => {
      const earners = state.earners.filter((e) => e.id !== id);
      return {
        earners,
        selectedEarnerId:
          state.selectedEarnerId === id
            ? earners[0]?.id || null
            : state.selectedEarnerId,
      };
    });
  },

  setPrimaryEarner: async (id) => {
    await earnersApi.setPrimary(id);
    set((state) => ({
      earners: state.earners.map((e) => ({
        ...e,
        isPrimary: e.id === id,
      })),
    }));
  },

  selectEarner: (id) => {
    set({ selectedEarnerId: id });
  },

  addIncomeEntry: async (earnerId, data) => {
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
    await incomeApi.remove(entryId);
    set((state) => ({
      earners: state.earners.map((e) =>
        e.id === earnerId
          ? { ...e, incomeEntries: e.incomeEntries.filter((ie) => ie.id !== entryId) }
          : e,
      ),
    }));
  },

  addExpenseCategory: async (name) => {
    const category = await expensesApi.createCategory({ name });
    set((state) => ({
      expenseCategories: [...state.expenseCategories, category],
    }));
  },

  updateExpenseCategory: async (id, data) => {
    const updated = await expensesApi.updateCategory(id, data);
    set((state) => ({
      expenseCategories: state.expenseCategories.map((c) =>
        c.id === id ? updated : c,
      ),
    }));
  },

  removeExpenseCategory: async (id) => {
    await expensesApi.removeCategory(id);
    set((state) => ({
      expenseCategories: state.expenseCategories.filter((c) => c.id !== id),
    }));
  },

  addExpenseSubCategory: async (categoryId, name) => {
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
    await expensesApi.removeSubCategory(id);
    set((state) => ({
      expenseCategories: state.expenseCategories.map((c) =>
        c.id === categoryId
          ? { ...c, subCategories: c.subCategories.filter((s) => s.id !== id) }
          : c,
      ),
    }));
  },

  patchEarnerData: (earnerId, patch) => {
    set((state) => ({
      earners: state.earners.map((e) =>
        e.id === earnerId ? { ...e, ...patch } : e,
      ),
    }));
  },
}));
