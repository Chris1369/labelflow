import { useQuery } from '@tanstack/react-query';
import { teamAPI } from '@/api/team.api';
import { Team } from '@/types/team';

// Query keys
export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (filters?: any) => [...teamKeys.lists(), { filters }] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamKeys.details(), id] as const,
  members: (id: string) => [...teamKeys.detail(id), 'members'] as const,
  projects: (id: string) => [...teamKeys.detail(id), 'projects'] as const,
};

// Hook to get all user teams
export const useTeams = () => {
  return useQuery<Team[], Error>({
    queryKey: teamKeys.lists(),
    queryFn: async () => {
      const teams = await teamAPI.getMyTeams();
      return teams;
    },
  });
};

// Hook to get teams by owner
export const useTeamsByOwner = (ownerId: string, enabled = true) => {
  return useQuery<Team[], Error>({
    queryKey: teamKeys.list({ ownerId }),
    queryFn: async () => {
      const teams = await teamAPI.getTeamsByOwnerId(ownerId);
      return teams;
    },
    enabled: enabled && !!ownerId,
  });
};

// Hook to get team details
export const useTeamDetails = (teamId: string, enabled = true) => {
  return useQuery<Team, Error>({
    queryKey: teamKeys.detail(teamId),
    queryFn: async () => {
      const team = await teamAPI.getOne(teamId);
      return team;
    },
    enabled: enabled && !!teamId,
  });
};

// Hook to get team members
export const useTeamMembers = (teamId: string, enabled = true) => {
  return useQuery({
    queryKey: teamKeys.members(teamId),
    queryFn: async () => {
      const members = await teamAPI.getTeamMembers(teamId);
      return members;
    },
    enabled: enabled && !!teamId,
  });
};

// Hook to get team projects
export const useTeamProjects = (teamId: string, enabled = true) => {
  return useQuery({
    queryKey: teamKeys.projects(teamId),
    queryFn: async () => {
      const projects = await teamAPI.getTeamProjects(teamId);
      return projects;
    },
    enabled: enabled && !!teamId,
  });
};


export const useMyTeams = () => {
  return useQuery<Team[], Error>({
    queryKey: teamKeys.list({ my: true }),
    queryFn: async () => {
      const teams = await teamAPI.getMyTeams();
      // Sort labels alphabetically
      const sortedTeams = teams.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      return sortedTeams;
    },
  });
};