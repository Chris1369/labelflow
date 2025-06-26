import { create } from 'zustand';
import { Label } from '@/types/label';
import { labelAPI } from '@/api/label.api';
import { useSettingsStore } from '@/ui/settings/useStore';
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
  loadLabels: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchLabels: (query: string) => Promise<void>;
  deleteLabel: (labelId: string) => Promise<void>;
  refreshLabels: () => Promise<void>;
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

  loadLabels: async () => {
    set({ isLoading: true, error: null });
    try {
      const includePublic = useSettingsStore.getState().includePublicLabels;
      const labels = await labelAPI.getMyLabels(includePublic);
      // Sort labels alphabetically
      const sortedLabels = labels.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      set({ 
        labels: sortedLabels,
        filteredLabels: sortedLabels,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to load labels',
        isLoading: false 
      });
    }
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    debouncedSearch(searchQuery);
  },

  searchLabels: async (query: string) => {
    debouncedSearch(query);
  },

  deleteLabel: async (labelId) => {
    try {
      await labelAPI.delete(labelId);
      await get().loadLabels();
    } catch (error: any) {
      throw error;
    }
  },

  refreshLabels: async () => {
    await get().loadLabels();
  },
};
});