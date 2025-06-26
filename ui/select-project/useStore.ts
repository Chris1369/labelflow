import { create } from 'zustand';
import { Project } from '@/types/project';
import { projectAPI } from '@/api/project.api';
import { useSettingsStore } from '@/ui/settings/useStore';
import { debounce } from 'lodash';

interface SelectProjectState {
  projects: Project[];
  filteredProjects: Project[];
  searchQuery: string;
  selectedProject: Project | null;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
}

interface SelectProjectActions {
  setSearchQuery: (query: string) => void;
  searchProjects: (query: string) => Promise<void>;
  selectProject: (project: Project) => void;
  loadProjects: () => Promise<void>;
}

export const useSelectProjectStore = create<SelectProjectState & SelectProjectActions>((set, get) => {
  // Create debounced search function
  const debouncedSearch = debounce(async (query: string) => {
    if (!query || query.trim().length < 2) {
      const { projects } = get();
      set({ filteredProjects: projects, isSearching: false });
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
      const { projects } = get();
      const filtered = projects.filter(project => 
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
  projects: [],
  filteredProjects: [],
  searchQuery: '',
  selectedProject: null,
  isLoading: false,
  isSearching: false,
  error: null,

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    debouncedSearch(query);
  },

  searchProjects: async (query: string) => {
    debouncedSearch(query);
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
};
});