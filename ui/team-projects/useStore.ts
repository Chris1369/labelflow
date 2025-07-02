import { create } from "zustand";
import { teamAPI } from "@/api/team.api";
import { debounce } from 'lodash';

interface TeamProjectsState {
  selectedProjects: Set<string>;
  searchQuery: string;
  filterQuery: string;
  isUpdating: boolean;
  error: string | null;
}

interface TeamProjectsActions {
  loadTeamProjects: (teamId: string) => Promise<void>;
  setSelectedProjects: (projectIds: string[]) => void;
  setSearchQuery: (query: string) => void;
  setIsUpdating: (isUpdating: boolean) => void;
  toggleProject: (projectId: string) => void;
  searchProjects: (query: string) => Promise<void>;
  saveChanges: (teamId: string) => Promise<void>;
}

export const useTeamProjectsStore = create<
  TeamProjectsState & TeamProjectsActions
>((set, get) => {
  // Create debounced search function
  const debouncedSearch = debounce(async (query: string) => {
    if (!query || query.trim().length < 2) {
      set({ filterQuery: '' });
      return;
    }

    set({ filterQuery: query });
  }, 300);

  return {
  selectedProjects: new Set(),
  searchQuery: "",
  filterQuery: "",
  isUpdating: false,
  error: null,

  loadTeamProjects: async (teamId: string) => {
    set({ error: null });
    try {
      // Charger d'abord les détails de la team pour obtenir les IDs des projets
      const team = await teamAPI.getOne(teamId);

      // Stocker les IDs des projets actuellement associés à la team
      const teamProjectIds = team.projectId || [];

      // Pas besoin de charger les projets ici, on va les charger dans loadAllProjects
      // On stocke juste les IDs sélectionnés

      set({
        selectedProjects: new Set(teamProjectIds),
      });
    } catch (error: any) {
      console.error("Error loading team projects:", error);
      set({
        error: error.message || "Failed to load team projects",
      });
    }
  },

  setSelectedProjects: (projectIds) => {
    set({ selectedProjects: new Set(projectIds) });
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    debouncedSearch(searchQuery);
  },

  setIsUpdating: (isUpdating) => set({ isUpdating }),

  toggleProject: (projectId) => {
    const { selectedProjects } = get();
    const newSelected = new Set(selectedProjects);

    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }

    set({ selectedProjects: newSelected });
  },

  searchProjects: async (query: string) => {
    debouncedSearch(query);
  },

  saveChanges: async (teamId: string) => {
    set({ isUpdating: true });
    try {
      const { selectedProjects } = get();

      // Récupérer la team pour avoir les IDs actuels
      const team = await teamAPI.getOne(teamId);
      const currentIds = team.projectId || [];
      const selectedIds = Array.from(selectedProjects);

      // Déterminer les projets à ajouter et à supprimer
      const toAdd = selectedIds.filter((id) => !currentIds.includes(id));
      const toRemove = currentIds.filter((id) => !selectedIds.includes(id));

      // Utiliser la méthode bulk updateProjects pour ajouter
      if (toAdd.length > 0) {
        await teamAPI.updateProjects(teamId, 'add', toAdd);
      }

      // Utiliser la méthode bulk updateProjects pour supprimer
      if (toRemove.length > 0) {
        await teamAPI.updateProjects(teamId, 'remove', toRemove);
      }

      // Recharger les projets de la team
      await get().loadTeamProjects(teamId);
    } catch (error: any) {
      console.error("Error saving changes:", error);
      set({ error: error.message || "Failed to update team projects" });
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },
};
});
