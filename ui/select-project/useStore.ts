import { create } from 'zustand';
import { debounce } from 'lodash';

interface SelectProjectState {
  searchQuery: string;
  filterQuery: string;
}

interface SelectProjectActions {
  setSearchQuery: (query: string) => void;
  searchProjects: (query: string) => Promise<void>;
}

export const useSelectProjectStore = create<SelectProjectState & SelectProjectActions>((set, get) => {
  // Create debounced search function
  const debouncedSearch = debounce(async (query: string) => {
    if (!query || query.trim().length < 2) {
      set({ filterQuery: ''});
      return;
    }
    
    set({ filterQuery: query });
  }, 300);

  return {
  searchQuery: '',
  filterQuery: '',

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    debouncedSearch(query);
  },

  searchProjects: async (query: string) => {
    debouncedSearch(query);
  },
};
});