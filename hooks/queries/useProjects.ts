import { useQuery } from '@tanstack/react-query';
import { projectAPI } from '@/api/project.api';
import { Project, ProjectQueryParams } from '@/types/project';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters?: any) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  items: (id: string) => [...projectKeys.detail(id), 'items'] as const,
};

// Hook to get all projects
export const useProjects = (filters?: { search?: string; isPublic?: boolean }) => {
  return useQuery<Project[], Error>({
    queryKey: projectKeys.list(filters),
    queryFn: async () => {
      const result = await projectAPI.getAll(filters);
      // Handle both array and paginated response
      if (Array.isArray(result)) {
        return result;
      }
      return result.data || [];
    },
  });
};

// Hook to get projects by owner ID
export const useProjectsByOwner = (ownerId: string, enabled = true) => {
  return useQuery<Project[], Error>({
    queryKey: projectKeys.list({ ownerId }),
    queryFn: async () => {
      const projects = await projectAPI.getProjectsByOwnerId(ownerId);
      return projects;
    },
    enabled: enabled && !!ownerId,
  });
};

// Hook to get project details
export const useProjectDetails = (projectId: string, enabled = true) => {
  return useQuery<Project, Error>({
    queryKey: projectKeys.detail(projectId),
    queryFn: async () => {
      const project = await projectAPI.getOne(projectId);
      return project;
    },
    enabled: enabled && !!projectId,
  });
};

// Hook to get user's own projects
export const useMyProjects = (query?: ProjectQueryParams) => {
 const {data, error, isLoading, refetch} = useQuery<{projects: Project[], total: number}, Error>({
    queryKey: projectKeys.list({ my: true, ...query }),
    queryFn: async () =>await projectAPI.getMyProjects(query)
  });

  return {
    projects: data?.projects || [],
    total: data?.total || 0,
    isLoading,
    error,
    refetch,
  };
};