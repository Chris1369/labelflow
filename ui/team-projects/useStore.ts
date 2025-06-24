import { create } from 'zustand';
import { Project } from '../../mock/projects';

interface TeamProjectsState {
  allProjects: Project[];
  selectedProjects: Set<string>;
  filteredProjects: Project[];
  searchQuery: string;
  isUpdating: boolean;
}

interface TeamProjectsActions {
  setAllProjects: (projects: Project[]) => void;
  setSelectedProjects: (projectIds: string[]) => void;
  setSearchQuery: (query: string) => void;
  setIsUpdating: (isUpdating: boolean) => void;
  toggleProject: (projectId: string) => void;
  filterProjects: () => void;
  saveChanges: () => Promise<void>;
}

export const useTeamProjectsStore = create<TeamProjectsState & TeamProjectsActions>((set, get) => ({
  allProjects: [],
  selectedProjects: new Set(),
  filteredProjects: [],
  searchQuery: '',
  isUpdating: false,

  setAllProjects: (projects) => {
    set({ allProjects: projects, filteredProjects: projects });
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
        project.description.toLowerCase().includes(query)
    );
    set({ filteredProjects: filtered });
  },

  saveChanges: async () => {
    set({ isUpdating: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedIds = Array.from(get().selectedProjects);
      console.log('Team projects updated:', selectedIds);
    } catch (error) {
      console.error('Error updating team projects:', error);
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },
}));