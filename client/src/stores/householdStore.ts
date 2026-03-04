import { create } from 'zustand';
import type { HouseholdSnapshot, Earner, ExpenseCategory } from 'shared';
import * as householdApi from '../api/household';
import * as earnersApi from '../api/earners';

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
    set({ isLoading: true, error: null });
    try {
      const snapshot = await householdApi.getSnapshot();
      const primaryOrFirst = snapshot.earners.find((e) => e.isPrimary) || snapshot.earners[0];
      set({
        household: snapshot.household,
        earners: snapshot.earners,
        expenseCategories: snapshot.expenseCategories,
        selectedEarnerId: primaryOrFirst?.id || null,
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
}));
