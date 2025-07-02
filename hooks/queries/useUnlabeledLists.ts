import { useQuery } from '@tanstack/react-query';
import { unlabeledListAPI } from '@/api/unlabeledList.api';
import { UnlabeledList } from '@/types/unlabeledList';

// Query keys
export const unlabeledListKeys = {
  all: ['unlabeledLists'] as const,
  lists: () => [...unlabeledListKeys.all, 'list'] as const,
  list: (filters?: any) => [...unlabeledListKeys.lists(), { filters }] as const,
  details: () => [...unlabeledListKeys.all, 'detail'] as const,
  detail: (id: string) => [...unlabeledListKeys.details(), id] as const,
  byProject: (projectId: string) => [...unlabeledListKeys.lists(), 'project', projectId] as const,
};

// Hook to get all unlabeled lists
export const useUnlabeledLists = () => {
  return useQuery<UnlabeledList[], Error>({
    queryKey: unlabeledListKeys.lists(),
    queryFn: async () => {
      const lists = await unlabeledListAPI.getAll();
      return lists;
    },
  });
};

// Hook to get unlabeled lists by project
export const useUnlabeledListsByProject = (projectId: string, enabled = true) => {
  return useQuery<UnlabeledList[], Error>({
    queryKey: unlabeledListKeys.byProject(projectId),
    queryFn: async () => {
      const lists = await unlabeledListAPI.getByProjectId(projectId);
      return lists;
    },
    enabled: enabled && !!projectId,
  });
};

// Hook to get a single unlabeled list
export const useUnlabeledListDetails = (listId: string, enabled = true) => {
  return useQuery<UnlabeledList, Error>({
    queryKey: unlabeledListKeys.detail(listId),
    queryFn: async () => {
      const list = await unlabeledListAPI.getById(listId);
      return list;
    },
    enabled: enabled && !!listId,
  });
};

