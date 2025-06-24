import { create } from 'zustand';

interface HomeState {
  selectedMenuItem: string | null;
}

interface HomeActions {
  setSelectedMenuItem: (item: string | null) => void;
}

export const useHomeStore = create<HomeState & HomeActions>((set, get) => ({
  selectedMenuItem: null,

  setSelectedMenuItem: (item) => set({ selectedMenuItem: item }),
}));