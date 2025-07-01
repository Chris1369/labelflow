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
      const projects = await projectAPI.getAll(filters);
      return projects;
    },
  });
};

// Hook to get user projects
export const useUserProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: projectKeys.list({ userProjects: true }),
    queryFn: async () => {
      const projects = await projectAPI.getByUser();
      return projects;
    },
  });
};

// Hook to get team projects
export const useProjectsByTeam = (teamId: string, enabled = true) => {
  return useQuery<Project[], Error>({
    queryKey: projectKeys.list({ teamId }),
    queryFn: async () => {
      const projects = await projectAPI.getByTeam(teamId);
      return projects;
    },
    enabled: enabled && !!teamId,
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