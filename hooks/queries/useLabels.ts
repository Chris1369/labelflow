import { useQuery } from '@tanstack/react-query';
import { labelAPI } from '@/api/label.api';
import { Label } from '@/types/label';

// Query keys
export const labelKeys = {
  all: ['labels'] as const,
  lists: () => [...labelKeys.all, 'list'] as const,
  list: (filters?: any) => [...labelKeys.lists(), { filters }] as const,
  details: () => [...labelKeys.all, 'detail'] as const,
  detail: (id: string) => [...labelKeys.details(), id] as const,
  search: (query: string) => [...labelKeys.all, 'search', query] as const,
  byCategory: (categoryId: string) => [...labelKeys.all, 'category', categoryId] as const,
};

// Hook to get all labels
export const useLabels = () => {
  return useQuery<Label[], Error>({
    queryKey: labelKeys.lists(),
    queryFn: async () => {
      const labels = await labelAPI.getAll();
      return labels;
    },
  });
};

// Hook to get user labels
export const useMyLabels = () => {
  return useQuery<Label[], Error>({
    queryKey: labelKeys.list({ my: true }),
    queryFn: async () => {
      const labels = await labelAPI.getMyLabels();
      return labels;
    },
  });
};

// Hook to search labels
export const useSearchLabels = (query: string, enabled = true) => {
  return useQuery<Label[], Error>({
    queryKey: labelKeys.search(query),
    queryFn: async () => {
      const labels = await labelAPI.searchLabels(query);
      return labels;
    },
    enabled: enabled && query.length >= 2,
  });
};

// Hook to get labels by category
export const useLabelsByCategory = (categoryId: string, enabled = true) => {
  return useQuery<Label[], Error>({
    queryKey: labelKeys.byCategory(categoryId),
    queryFn: async () => {
      const labels = await labelAPI.getByCategory(categoryId);
      return labels;
    },
    enabled: enabled && !!categoryId,
  });
};

// Hook to get label details
export const useLabelDetails = (labelId: string, enabled = true) => {
  return useQuery<Label, Error>({
    queryKey: labelKeys.detail(labelId),
    queryFn: async () => {
      const label = await labelAPI.getOne(labelId);
      return label;
    },
    enabled: enabled && !!labelId,
  });
};