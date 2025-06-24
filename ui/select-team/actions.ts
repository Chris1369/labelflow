import { router } from 'expo-router';
import { useSelectTeamStore } from './useStore';
import { Team } from '../../mock/teams';

export const selectTeamActions = {
  loadTeams: (teams: Team[]) => {
    useSelectTeamStore.getState().setTeams(teams);
  },

  searchTeams: (query: string) => {
    useSelectTeamStore.getState().setSearchQuery(query);
  },

  selectTeam: (team: Team) => {
    useSelectTeamStore.getState().selectTeam(team);
    router.push(`/(team)/${team.id}`);
  },

  createNewTeam: () => {
    router.push('/(main)/create-team');
  },
};