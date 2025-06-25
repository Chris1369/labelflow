import { create } from 'zustand';
import { Category } from '@/types/category';
import { Label } from '@/types/label';
import { categoryAPI } from '@/api/category.api';
import { ExpandedCategories } from './types';

interface CategoriesState {
  categories: Category[];
  filteredCategories: Category[];
  expandedCategories: ExpandedCategories;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  includePublic: boolean;
}

interface CategoriesActions {
  loadCategories: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  filterCategories: () => void;
  toggleCategory: (categoryId: string) => void;
  deleteCategory: (categoryId: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
  setIncludePublic: (includePublic: boolean) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState & CategoriesActions>((set, get) => ({
  categories: [],
  filteredCategories: [],
  expandedCategories: {},
  searchQuery: '',
  isLoading: false,
  error: null,
  includePublic: true,

  loadCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const { includePublic } = get();
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
    get().filterCategories();
  },

  filterCategories: () => {
    const { categories, searchQuery } = get();
    if (!searchQuery.trim()) {
      set({ filteredCategories: categories });
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query)
    );
    set({ filteredCategories: filtered });
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

  setIncludePublic: async (includePublic) => {
    set({ includePublic });
    await get().loadCategories();
  },
}));