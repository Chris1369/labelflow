import { router } from 'expo-router';
import { useTeamStore } from './useStore';

export const teamActions = {
  handleMembers: (teamId: string) => {
    router.push(`/(team)/${teamId}/members`);
  },

  handleProjects: (teamId: string) => {
    router.push(`/(team)/${teamId}/projects`);
  },

  exitTeam: () => {
    useTeamStore.getState().setCurrentTeam(null);
    router.back();
  },
};