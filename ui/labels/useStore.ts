import { create } from 'zustand';
import { Label } from '@/types/label';
import { labelAPI } from '@/api/label.api';

interface LabelsState {
  labels: Label[];
  filteredLabels: Label[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  includePublic: boolean;
}

interface LabelsActions {
  loadLabels: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  filterLabels: () => void;
  deleteLabel: (labelId: string) => Promise<void>;
  refreshLabels: () => Promise<void>;
  setIncludePublic: (includePublic: boolean) => Promise<void>;
}

export const useLabelsStore = create<LabelsState & LabelsActions>((set, get) => ({
  labels: [],
  filteredLabels: [],
  searchQuery: '',
  isLoading: false,
  error: null,
  includePublic: true,

  loadLabels: async () => {
    set({ isLoading: true, error: null });
    try {
      const { includePublic } = get();
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
    get().filterLabels();
  },

  filterLabels: () => {
    const { labels, searchQuery } = get();
    if (!searchQuery.trim()) {
      set({ filteredLabels: labels });
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = labels.filter(
      (label) =>
        label.name.toLowerCase().includes(query)
    );
    set({ filteredLabels: filtered });
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

  setIncludePublic: async (includePublic) => {
    set({ includePublic });
    await get().loadLabels();
  },
}));