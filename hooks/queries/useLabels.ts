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
      const result = await labelAPI.getAll();
      // Handle both array and paginated response
      if (Array.isArray(result)) {
        return result;
      }
      return result.data || [];
    },
  });
};

// Hook to get user labels
export const useMyLabels = (includePublic: boolean = true, enabled: boolean = true) => {
  return useQuery<Label[], Error>({
    queryKey: labelKeys.list({ my: true, includePublic }),
    queryFn: async () => {
      const labels = await labelAPI.getMyLabels(includePublic);
      // Sort labels alphabetically
      const sortedLabels = labels.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      return sortedLabels;
    },
    enabled: enabled,
  });
};

// Hook to get public labels
export const usePublicLabels = () => {
  return useQuery<Label[], Error>({
    queryKey: labelKeys.list({ public: true }),
    queryFn: async () => {
      const labels = await labelAPI.getPublicLabels();
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