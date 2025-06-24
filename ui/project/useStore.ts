import { create } from 'zustand';
import { Project } from '@/types/project';
import { projectAPI } from '@/api/project.api';
import { router } from 'expo-router';

interface ProjectState {
  currentProject: Project | null;
  isModalVisible: boolean;
  modalType: 'reset' | 'delete' | null;
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  setCurrentProject: (project: Project | null) => void;
  loadProject: (projectId: string) => Promise<void>;
  showModal: (type: 'reset' | 'delete') => void;
  hideModal: () => void;
  resetProject: () => Promise<void>;
  deleteProject: () => Promise<void>;
}

export const useProjectStore = create<ProjectState & ProjectActions>((set, get) => ({
  currentProject: null,
  isModalVisible: false,
  modalType: null,
  isLoading: false,
  error: null,

  setCurrentProject: (project) => set({ currentProject: project }),

  loadProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectAPI.getOne(projectId);
      set({ currentProject: project, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to load project',
        isLoading: false,
        currentProject: null 
      });
    }
  },

  showModal: (type) => set({ isModalVisible: true, modalType: type }),

  hideModal: () => set({ isModalVisible: false, modalType: null }),

  resetProject: async () => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    try {
      await projectAPI.resetProject(currentProject.id);
      const updatedProject = await projectAPI.getOne(currentProject.id);
      set({ currentProject: updatedProject, isModalVisible: false, modalType: null });
    } catch (error: any) {
      set({ error: error.message || 'Failed to reset project' });
    }
  },

  deleteProject: async () => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    try {
      await projectAPI.delete(currentProject.id);
      set({ isModalVisible: false, modalType: null });
      router.replace('/(main)/select-project');
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete project' });
    }
  },
}));