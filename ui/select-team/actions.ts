import { router } from 'expo-router';
import { useSelectTeamStore } from './useStore';
import { Team } from '@/types/team';

export const selectTeamActions = {
  searchTeams: (query: string) => {
    useSelectTeamStore.getState().setSearchQuery(query);
  },

  selectTeam: (team: Team) => {
    useSelectTeamStore.getState().selectTeam(team);
    const teamId = team._id || team.id;
    router.push(`/(team)/${teamId}`);
  },
};