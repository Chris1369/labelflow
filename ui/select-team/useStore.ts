import { create } from 'zustand';
import { Team } from '../../mock/teams';

interface SelectTeamState {
  teams: Team[];
  filteredTeams: Team[];
  searchQuery: string;
  selectedTeam: Team | null;
}

interface SelectTeamActions {
  setTeams: (teams: Team[]) => void;
  setSearchQuery: (query: string) => void;
  filterTeams: () => void;
  selectTeam: (team: Team) => void;
  resetSelection: () => void;
}

export const useSelectTeamStore = create<SelectTeamState & SelectTeamActions>((set, get) => ({
  teams: [],
  filteredTeams: [],
  searchQuery: '',
  selectedTeam: null,

  setTeams: (teams) => {
    set({ teams, filteredTeams: teams });
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().filterTeams();
  },

  filterTeams: () => {
    const { teams, searchQuery } = get();
    if (!searchQuery.trim()) {
      set({ filteredTeams: teams });
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(query) ||
        team.description.toLowerCase().includes(query)
    );
    set({ filteredTeams: filtered });
  },

  selectTeam: (team) => set({ selectedTeam: team }),

  resetSelection: () => set({ selectedTeam: null, searchQuery: '' }),
}));