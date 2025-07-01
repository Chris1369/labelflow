import { useQuery } from '@tanstack/react-query';
import { categoryAPI } from '@/api/category.api';
import { Category } from '@/types/category';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters?: any) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  withLabels: () => [...categoryKeys.all, 'withLabels'] as const,
};

// Hook to get all categories
export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const categories = await categoryAPI.getAll();
      return categories;
    },
  });
};

// Hook to get user categories
export const useMyCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.list({ my: true }),
    queryFn: async () => {
      const categories = await categoryAPI.getMyCategories();
      return categories;
    },
  });
};

// Hook to get categories with labels
export const useCategoriesWithLabels = () => {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.withLabels(),
    queryFn: async () => {
      const categories = await categoryAPI.getWithLabels();
      return categories;
    },
  });
};

// Hook to get category details
export const useCategoryDetails = (categoryId: string, enabled = true) => {
  return useQuery<Category, Error>({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: async () => {
      const category = await categoryAPI.getOne(categoryId);
      return category;
    },
    enabled: enabled && !!categoryId,
  });
};