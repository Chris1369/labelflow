import { create } from 'zustand';
import { Category } from '@/types/category';
import { Label } from '@/types/label';
import { categoryAPI } from '@/api/category.api';
import { ExpandedCategories } from './types';
import { useSettingsStore } from '@/ui/settings/useStore';
import { debounce } from 'lodash';

interface CategoriesState {
  categories: Category[];
  filteredCategories: Category[];
  expandedCategories: ExpandedCategories;
  searchQuery: string;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
}

interface CategoriesActions {
  loadCategories: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchCategories: (query: string) => Promise<void>;
  toggleCategory: (categoryId: string) => void;
  deleteCategory: (categoryId: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState & CategoriesActions>((set, get) => {
  // Create debounced search function
  const debouncedSearch = debounce(async (query: string) => {
    if (!query || query.trim().length < 2) {
      const { categories } = get();
      set({ filteredCategories: categories, isSearching: false });
      return;
    }

    set({ isSearching: true });
    try {
      const includePublic = useSettingsStore.getState().includePublicCategories;
      const searchResults = await categoryAPI.getAll({
        search: query,
        limit: 50,
        getIsPublic: includePublic
      });
      
      // Handle both array and paginated response
      let categories: Category[] = [];
      if (Array.isArray(searchResults)) {
        categories = searchResults;
      } else if (searchResults && 'categories' in searchResults) {
        categories = searchResults.categories || [];
      }
      
      set({ 
        filteredCategories: categories,
        isSearching: false 
      });
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search
      const { categories } = get();
      const filtered = categories.filter(cat => 
        cat.name.toLowerCase().includes(query.toLowerCase())
      );
      set({ 
        filteredCategories: filtered,
        isSearching: false 
      });
    }
  }, 300);

  return {
  categories: [],
  filteredCategories: [],
  expandedCategories: {},
  searchQuery: '',
  isLoading: false,
  isSearching: false,
  error: null,

  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const includePublic = useSettingsStore.getState().includePublicCategories;
      const categories = await categoryAPI.getMyCategories(includePublic);
      set({ 
        categories,
        filteredCategories: categories,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to load categories',
        isLoading: false 
      });
    }
  },


  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    debouncedSearch(searchQuery);
  },

  searchCategories: async (query: string) => {
    debouncedSearch(query);
  },

  toggleCategory: (categoryId) => {
    const { expandedCategories } = get();
    const newExpanded = {
      ...expandedCategories,
      [categoryId]: !expandedCategories[categoryId]
    };
    set({ expandedCategories: newExpanded });
  },

  deleteCategory: async (categoryId) => {
    try {
      await categoryAPI.delete(categoryId);
      await get().loadCategories();
    } catch (error: any) {
      throw error;
    }
  },

  refreshCategories: async () => {
    await get().loadCategories();
  },
};
});