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
  loadTeams: () => Promise<void>;
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
        const searchResults = await teamAPI.getAll({
          search: query,
          limit: 50
        });
        
        // Handle both array and paginated response
        let teams: Team[] = [];
        if (Array.isArray(searchResults)) {
          teams = searchResults;
        } else if (searchResults && 'teams' in searchResults) {
          teams = searchResults.teams || [];
        }
        
        set({ 
          filteredTeams: teams,
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

    loadTeams: async () => {
      set({ isLoading: true, error: null });
      try {
        // Utiliser getMyTeams pour récupérer les teams où l'utilisateur est membre ou owner
        const teams = await teamAPI.getMyTeams();

        set({
          teams: teams,
          filteredTeams: teams,
          isLoading: false,
        });
      } catch (error: any) {
        console.error("Error loading teams:", error);
        set({
          error: error.message || "Failed to load teams",
          isLoading: false,
          teams: [],
          filteredTeams: [],
        });
      }
    },
  };
  }
);
