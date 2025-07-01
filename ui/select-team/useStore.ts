import { create } from "zustand";
import { Team } from "@/types/team";
import { teamAPI } from "@/api/team.api";
import { debounce } from 'lodash';

interface SelectTeamState {
  teams: Team[];
  filteredTeams: Team[];
  searchQuery: string;
  selectedTeam: Team | null;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
}

interface SelectTeamActions {
  setTeams: (teams: Team[]) => void;
  setSearchQuery: (query: string) => void;
  searchTeams: (query: string) => Promise<void>;
  selectTeam: (team: Team) => void;
  resetSelection: () => void;
  initTeams: ({teams, refreshTeams}: {teams: Team[], refreshTeams?: () => void}) => void;
  refreshTeams?: () => void;
}

export const useSelectTeamStore = create<SelectTeamState & SelectTeamActions>(
  (set, get) => {
    // Create debounced search function
    const debouncedSearch = debounce(async (query: string) => {
      if (!query || query.trim().length < 2) {
        const { teams } = get();
        set({ filteredTeams: teams, isSearching: false });
        return;
      }

      set({ isSearching: true });
      try {
        const searchResults = await teamAPI.searchMyTeam({query});
        set({ 
          filteredTeams: searchResults,
          isSearching: false 
        });
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to local search
        const { teams } = get();
        const filtered = teams.filter(team => 
          team.name.toLowerCase().includes(query.toLowerCase()) ||
          team.description?.toLowerCase().includes(query.toLowerCase())
        );
        set({ 
          filteredTeams: filtered,
          isSearching: false 
        });
      }
    }, 300);

    return {
    teams: [],
    filteredTeams: [],
    searchQuery: "",
    selectedTeam: null,
    isLoading: false,
    isSearching: false,
    error: null,

    setTeams: (teams) => {
      set({ teams, filteredTeams: teams });
    },

    setSearchQuery: (searchQuery) => {
      set({ searchQuery });
      debouncedSearch(searchQuery);
    },

    searchTeams: async (query: string) => {
      debouncedSearch(query);
    },

    selectTeam: (team) => set({ selectedTeam: team }),

    resetSelection: () => set({ selectedTeam: null, searchQuery: "" }),

    initTeams: ({teams, refreshTeams}: {teams: Team[], refreshTeams?: () => void}) => {
      set({ teams, filteredTeams: teams, refreshTeams });
    },
  };
  }
);
