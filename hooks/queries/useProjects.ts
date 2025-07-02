import { useQuery } from '@tanstack/react-query';
import { projectAPI } from '@/api/project.api';
import { Project } from '@/types/project';

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
      const projects = await projectAPI.getMyProjects({includePublic});
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

// Hook to get user's own projects
export const useMyProjects = ({includePublic,onlyOwnerProjects=false, searchQuery}: {includePublic: boolean, onlyOwnerProjects?: boolean, searchQuery?: string}) => {
  return useQuery<Project[], Error>({
    queryKey: projectKeys.list({ my: true, includePublic, onlyOwnerProjects, searchQuery }),
    queryFn: async () => {
      const projects = await projectAPI.getMyProjects({includePublic, onlyOwnerProjects, searchQuery});
      // Sort projects alphabetically
      const sortedProjects = projects.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      return sortedProjects;
    },
  });
};