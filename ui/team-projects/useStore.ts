import { create } from "zustand";
import { Project } from "@/types/project";
import { teamAPI } from "@/api/team.api";
import { projectAPI } from "@/api/project.api";
import { useSettingsStore } from "@/ui/settings/useStore";
import { debounce } from 'lodash';

interface TeamProjectsState {
  teamProjects: Project[]; // Projets actuellement liés à la team
  allProjects: Project[]; // Tous les projets disponibles
  selectedProjects: Set<string>;
  filteredProjects: Project[];
  searchQuery: string;
  isLoading: boolean;
  isUpdating: boolean;
  isSearching: boolean;
  error: string | null;
}

interface TeamProjectsActions {
  loadTeamProjects: (teamId: string) => Promise<void>;
  loadAllProjects: () => Promise<void>;
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
      const { allProjects } = get();
      set({ filteredProjects: allProjects, isSearching: false });
      return;
    }

    set({ isSearching: true });
    try {
      const includePublic = useSettingsStore.getState().includePublicProjects;
      const searchResults = await projectAPI.getAll({
        search: query,
        limit: 50,
        getIsPublic: includePublic
      });
      
      // Handle both array and paginated response
      let projects: Project[] = [];
      if (Array.isArray(searchResults)) {
        projects = searchResults;
      } else if (searchResults && 'projects' in searchResults) {
        projects = searchResults.projects || [];
      }
      
      set({ 
        filteredProjects: projects,
        isSearching: false 
      });
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search
      const { allProjects } = get();
      const filtered = allProjects.filter(project => 
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description?.toLowerCase().includes(query.toLowerCase())
      );
      set({ 
        filteredProjects: filtered,
        isSearching: false 
      });
    }
  }, 300);

  return {
  teamProjects: [],
  allProjects: [],
  selectedProjects: new Set(),
  filteredProjects: [],
  searchQuery: "",
  isLoading: false,
  isUpdating: false,
  isSearching: false,
  error: null,

  loadTeamProjects: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Charger d'abord les détails de la team pour obtenir les IDs des projets
      const team = await teamAPI.getOne(teamId);

      // Stocker les IDs des projets actuellement associés à la team
      const teamProjectIds = team.projectId || [];

      // Pas besoin de charger les projets ici, on va les charger dans loadAllProjects
      // On stocke juste les IDs sélectionnés

      set({
        teamProjects: [], // On va les charger avec loadAllProjects
        selectedProjects: new Set(teamProjectIds),
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Error loading team projects:", error);
      set({
        error: error.message || "Failed to load team projects",
        isLoading: false,
      });
    }
  },

  loadAllProjects: async () => {
    try {
      // Récupérer le paramètre des settings
      const includePublic = useSettingsStore.getState().includePublicProjects;
      
      // Charger tous les projets de l'utilisateur avec le paramètre includePublic
      const projects = await projectAPI.getMyProjects(includePublic);

      // S'assurer que projects est un tableau
      const projectArray = Array.isArray(projects) ? projects : [];
      set({
        allProjects: projectArray,
        filteredProjects: projectArray,
      });
    } catch (error: any) {
      console.error("Error loading all projects:", error);
      set({
        error: error.message || "Failed to load projects",
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
