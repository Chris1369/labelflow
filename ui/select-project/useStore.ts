import { create } from 'zustand';
import { Project } from '../../types/project';
import { mockProjects } from '../../mock/projects';

interface SelectProjectState {
  projects: Project[];
  filteredProjects: Project[];
  searchQuery: string;
  selectedProject: Project | null;
}

interface SelectProjectActions {
  setSearchQuery: (query: string) => void;
  filterProjects: () => void;
  selectProject: (project: Project) => void;
  loadProjects: () => void;
}

export const useSelectProjectStore = create<SelectProjectState & SelectProjectActions>((set, get) => ({
  projects: [],
  filteredProjects: [],
  searchQuery: '',
  selectedProject: null,

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

  loadProjects: () => {
    set({ projects: mockProjects, filteredProjects: mockProjects });
  },
}));