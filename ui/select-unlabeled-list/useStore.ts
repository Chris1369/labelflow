import { create } from 'zustand';

interface UnlabeledList {
  id?: string;
  _id?: string;
  name: string;
  items?: any[];
  createdAt?: string;
}

interface SelectUnlabeledListState {
  lists: UnlabeledList[];
  filteredLists: UnlabeledList[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

interface SelectUnlabeledListActions {
  setLists: (lists: UnlabeledList[]) => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  filterLists: () => void;
  reset: () => void;
}

export const useStore = create<SelectUnlabeledListState & SelectUnlabeledListActions>((set, get) => ({
  // State
  lists: [],
  filteredLists: [],
  searchQuery: '',
  isLoading: false,
  error: null,

  // Actions
  setLists: (lists) => {
    set({ lists, filteredLists: lists });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterLists();
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  filterLists: () => {
    const { lists, searchQuery } = get();
    
    if (!searchQuery.trim()) {
      set({ filteredLists: lists });
      return;
    }

    const filtered = lists.filter(list =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    set({ filteredLists: filtered });
  },

  reset: () => set({
    lists: [],
    filteredLists: [],
    searchQuery: '',
    isLoading: false,
    error: null,
  }),
}));