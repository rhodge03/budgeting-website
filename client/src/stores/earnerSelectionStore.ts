import { create } from 'zustand';

type EarnerSelection = 'all' | string;
export type Category = 'all' | 'income' | 'savings' | 'retirement' | 'tax';

interface EarnerSelectionState {
  selectedEarnerId: EarnerSelection;
  setSelectedEarnerId: (id: EarnerSelection) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
}

export const useEarnerSelectionStore = create<EarnerSelectionState>((set) => ({
  selectedEarnerId: 'all',
  setSelectedEarnerId: (id) => set({ selectedEarnerId: id }),
  selectedCategory: 'all',
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
}));
