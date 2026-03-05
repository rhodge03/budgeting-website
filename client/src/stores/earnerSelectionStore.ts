import { create } from 'zustand';

type EarnerSelection = 'all' | string;

interface EarnerSelectionState {
  selectedEarnerId: EarnerSelection;
  setSelectedEarnerId: (id: EarnerSelection) => void;
}

export const useEarnerSelectionStore = create<EarnerSelectionState>((set) => ({
  selectedEarnerId: 'all',
  setSelectedEarnerId: (id) => set({ selectedEarnerId: id }),
}));
