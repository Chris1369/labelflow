import { create } from 'zustand';
import { Category } from '@/types/category';
import { categoryAPI } from '@/api/category.api';
import { ExpandedCategories } from './types';
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
  setSearchQuery: (query: string) => void;
  searchCategories: (query: string) => Promise<void>;
  toggleCategory: (categoryId: string) => void;
  deleteCategory: (categoryId: string) => Promise<void>;
  refreshCategories?: () => void;
  initCategories: ({categories, refreshCategories}: {categories: Category[], refreshCategories?: () => void}) => void;
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
      const categories = await categoryAPI.searchCategories(query);

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

  initCategories: ({ categories, refreshCategories }: { categories: Category[], refreshCategories?: () => void }) => {
    set({ categories, filteredCategories: categories, refreshCategories });
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
      get().refreshCategories?.();
    } catch (error: any) {
      throw error;
    }
  },
};
});