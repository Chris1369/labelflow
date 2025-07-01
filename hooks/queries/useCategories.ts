import { useQuery } from "@tanstack/react-query";
import { categoryAPI } from "@/api/category.api";
import { Category } from "@/types/category";

// Query keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters?: any) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  withLabels: () => [...categoryKeys.all, "withLabels"] as const,
};

// Hook to get all categories
export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const result = await categoryAPI.getAll();
      // Handle both array and paginated response
      if (Array.isArray(result)) {
        return result;
      }
      return result.data || [];
    },
  });
};

// Hook to get user categories
export const useMyCategories = (includePublic: boolean = true) => {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.list({ my: true, includePublic }),
    queryFn: async () => {
      const categories = await categoryAPI.getMyCategories(includePublic);
      return categories;
    },
  });
};

// Hook to get public categories
export const usePublicCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.list({ public: true }),
    queryFn: async () => {
      const categories = await categoryAPI.getPublicCategories();
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
