import { create } from 'zustand';
import { Label } from '@/types/label';
import { labelAPI } from '@/api/label.api';

interface AddLabelsModalState {
  allLabels: Label[];
  filteredLabels: Label[];
  selectedLabelIds: Set<string>;
  searchQuery: string;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

interface AddLabelsModalActions {
  loadAllLabels: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  toggleLabelSelection: (labelId: string) => void;
  setInitialSelectedLabels: (labelIds: string[]) => void;
  resetSelection: () => void;
  getNewlySelectedLabels: (existingLabelIds: string[]) => string[];
  getLabelsToRemove: (existingLabelIds: string[]) => string[];
}

export const useAddLabelsModalStore = create<AddLabelsModalState & AddLabelsModalActions>((set, get) => ({
  // State
  allLabels: [],
  filteredLabels: [],
  selectedLabelIds: new Set(),
  searchQuery: '',
  isLoading: false,
  isSubmitting: false,
  error: null,

  // Actions
  loadAllLabels: async () => {
    set({ isLoading: true, error: null });
    try {
      const labels = await labelAPI.getMyLabels(true); // Include public labels
      const sortedLabels = labels.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      set({ 
        allLabels: sortedLabels,
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
    const { allLabels } = get();
    
    if (!searchQuery.trim()) {
      set({ filteredLabels: allLabels });
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allLabels.filter(label =>
      label.name.toLowerCase().includes(query)
    );
    set({ filteredLabels: filtered });
  },

  toggleLabelSelection: (labelId) => {
    const { selectedLabelIds } = get();
    const newSelected = new Set(selectedLabelIds);
    
    if (newSelected.has(labelId)) {
      newSelected.delete(labelId);
    } else {
      newSelected.add(labelId);
    }
    
    set({ selectedLabelIds: newSelected });
  },

  setInitialSelectedLabels: (labelIds) => {
    set({ selectedLabelIds: new Set(labelIds) });
  },

  resetSelection: () => {
    set({ 
      selectedLabelIds: new Set(),
      searchQuery: '',
      error: null,
      isSubmitting: false
    });
  },

  getNewlySelectedLabels: (existingLabelIds) => {
    const { selectedLabelIds } = get();
    const existingSet = new Set(existingLabelIds);
    
    return Array.from(selectedLabelIds).filter(
      labelId => !existingSet.has(labelId)
    );
  },
  
  getLabelsToRemove: (existingLabelIds: string[]) => {
    const { selectedLabelIds } = get();
    return existingLabelIds.filter(
      (labelId: string) => !selectedLabelIds.has(labelId)
    );
  },
}));