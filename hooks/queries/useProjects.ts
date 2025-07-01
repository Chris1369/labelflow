import { useQuery } from '@tanstack/react-query';
import { projectAPI } from '@/api/project.api';
import { Project } from '@/types/project';
import { labelKeys } from './useLabels';

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

// Hook to get user projects
export const useUserProjects = (includePublic: boolean = false) => {
  return useQuery<Project[], Error>({
    queryKey: projectKeys.list({ userProjects: true, includePublic }),
    queryFn: async () => {
      const projects = await projectAPI.getMyProjects(includePublic);
      return projects;
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

// Hook to get user labels
export const useMyProjects = (includePublic: boolean = true) => {
  return useQuery<Project[], Error>({
    queryKey: labelKeys.list({ my: true, includePublic }),
    queryFn: async () => {
      const labels = await projectAPI.getMyProjects(includePublic);
      // Sort labels alphabetically
      const sortedLabels = labels.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      return sortedLabels;
    },
  });
};