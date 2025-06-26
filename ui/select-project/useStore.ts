import { create } from 'zustand';
import { Project } from '@/types/project';
import { projectAPI } from '@/api/project.api';
import { useSettingsStore } from '@/ui/settings/useStore';

interface SelectProjectState {
  projects: Project[];
  filteredProjects: Project[];
  searchQuery: string;
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

interface SelectProjectActions {
  setSearchQuery: (query: string) => void;
  filterProjects: () => void;
  selectProject: (project: Project) => void;
  loadProjects: () => Promise<void>;
}

export const useSelectProjectStore = create<SelectProjectState & SelectProjectActions>((set, get) => ({
  projects: [],
  filteredProjects: [],
  searchQuery: '',
  selectedProject: null,
  isLoading: false,
  error: null,

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterProjects();
  },

  filterProjects: () => {
    const { projects, searchQuery } = get();
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    set({ filteredProjects: filtered });
  },

  selectProject: (project) => {
    set({ selectedProject: project });
  },

  loadProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      // Récupérer le paramètre des settings
      const includePublic = useSettingsStore.getState().includePublicProjects;
      
      // Utiliser getMyProjects avec le paramètre includePublic
      const projects = await projectAPI.getMyProjects(includePublic);
      console.log('My projects:', projects);
      
      set({ 
        projects: projects, 
        filteredProjects: projects,
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error loading projects:', error);
      set({ 
        error: error.message || 'Failed to load projects',
        isLoading: false,
        projects: [],
        filteredProjects: []
      });
    }
  },
}));