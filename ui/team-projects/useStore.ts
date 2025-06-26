import { create } from "zustand";
import { Project } from "@/types/project";
import { teamAPI } from "@/api/team.api";
import { projectAPI } from "@/api/project.api";

interface TeamProjectsState {
  teamProjects: Project[]; // Projets actuellement liés à la team
  allProjects: Project[]; // Tous les projets disponibles
  selectedProjects: Set<string>;
  filteredProjects: Project[];
  searchQuery: string;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

interface TeamProjectsActions {
  loadTeamProjects: (teamId: string) => Promise<void>;
  loadAllProjects: () => Promise<void>;
  setSelectedProjects: (projectIds: string[]) => void;
  setSearchQuery: (query: string) => void;
  setIsUpdating: (isUpdating: boolean) => void;
  toggleProject: (projectId: string) => void;
  filterProjects: () => void;
  saveChanges: (teamId: string) => Promise<void>;
}

export const useTeamProjectsStore = create<
  TeamProjectsState & TeamProjectsActions
>((set, get) => ({
  teamProjects: [],
  allProjects: [],
  selectedProjects: new Set(),
  filteredProjects: [],
  searchQuery: "",
  isLoading: false,
  isUpdating: false,
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
      // Charger tous les projets de l'utilisateur
      const projects = await projectAPI.getMyProjects();

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
    get().filterProjects();
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

  filterProjects: () => {
    const { allProjects, searchQuery } = get();
    if (!searchQuery.trim()) {
      set({ filteredProjects: allProjects });
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allProjects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
    );
    set({ filteredProjects: filtered });
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

      // Effectuer les modifications
      for (const projectId of toAdd) {
        await teamAPI.addProject(teamId, projectId);
      }

      for (const projectId of toRemove) {
        await teamAPI.removeProject(teamId, projectId);
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
}));
