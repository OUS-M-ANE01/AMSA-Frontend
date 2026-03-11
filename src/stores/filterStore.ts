import { create } from 'zustand';

interface FilterState {
  pendingCategory: string | null;   // Nom ou _id de la catégorie à pré-sélectionner
  setPendingCategory: (cat: string | null) => void;
  clearPendingCategory: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  pendingCategory: null,
  setPendingCategory: (cat) => set({ pendingCategory: cat }),
  clearPendingCategory: () => set({ pendingCategory: null }),
}));
