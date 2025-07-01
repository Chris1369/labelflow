import { create } from 'zustand';
import { Label } from '@/types/label';
import { labelAPI } from '@/api/label.api';
import { debounce } from 'lodash';

interface LabelsState {
  labels: Label[];
  filteredLabels: Label[];
  searchQuery: string;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
}

interface LabelsActions {
  setSearchQuery: (query: string) => void;
  searchLabels: (query: string) => Promise<void>;
  deleteLabel: (labelId: string, refetch?: () => void) => Promise<void>;
  initLabels: ({labels, refreshLabels}: {labels: Label[], refreshLabels?: () => void}) => void;
  refreshLabels?: () => void;
}

export const useLabelsStore = create<LabelsState & LabelsActions>((set, get) => {
  // Create debounced search function
  const debouncedSearch = debounce(async (query: string) => {
    if (!query || query.trim().length < 2) {
      const { labels } = get();
      set({ filteredLabels: labels, isSearching: false });
      return;
    }

    set({ isSearching: true });
    try {
      const searchResults = await labelAPI.searchLabels(query);
      set({ 
        filteredLabels: searchResults,
        isSearching: false 
      });
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search
      const { labels } = get();
      const filtered = labels.filter(label => 
        label.name.toLowerCase().includes(query.toLowerCase())
      );
      set({ 
        filteredLabels: filtered,
        isSearching: false 
      });
    }
  }, 300);

  return {
  labels: [],
  filteredLabels: [],
  searchQuery: '',
  isLoading: false,
  isSearching: false,
  error: null,

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    debouncedSearch(searchQuery);
  },

  searchLabels: async (query: string) => {
    debouncedSearch(query);
  },

  deleteLabel: async (labelId) => {
    const { refreshLabels } = get();
    try {
      await labelAPI.delete(labelId);
      if (refreshLabels) {
        refreshLabels();
      }
    } catch (error: any) {
      throw error;
    }
  },
  initLabels: ({ labels, refreshLabels }: {labels: Label[], refreshLabels?: () => void}) => {
    set({ labels, filteredLabels: labels, refreshLabels });
  }
};
});