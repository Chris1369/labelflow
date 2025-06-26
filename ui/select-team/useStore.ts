import { create } from "zustand";
import { Team } from "@/types/team";
import { teamAPI } from "@/api/team.api";

interface SelectTeamState {
  teams: Team[];
  filteredTeams: Team[];
  searchQuery: string;
  selectedTeam: Team | null;
  isLoading: boolean;
  error: string | null;
}

interface SelectTeamActions {
  setTeams: (teams: Team[]) => void;
  setSearchQuery: (query: string) => void;
  filterTeams: () => void;
  selectTeam: (team: Team) => void;
  resetSelection: () => void;
  loadTeams: () => Promise<void>;
}

export const useSelectTeamStore = create<SelectTeamState & SelectTeamActions>(
  (set, get) => ({
    teams: [],
    filteredTeams: [],
    searchQuery: "",
    selectedTeam: null,
    isLoading: false,
    error: null,

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
  })
);
