import { create } from 'zustand';
import { Project } from '../../types/project';

interface ProjectState {
  currentProject: Project | null;
  isModalVisible: boolean;
  modalType: 'reset' | 'delete' | null;
}

interface ProjectActions {
  setCurrentProject: (project: Project | null) => void;
  showModal: (type: 'reset' | 'delete') => void;
  hideModal: () => void;
  resetProject: () => void;
  deleteProject: () => void;
}

export const useProjectStore = create<ProjectState & ProjectActions>((set, get) => ({
  currentProject: null,
  isModalVisible: false,
  modalType: null,

  setCurrentProject: (project) => set({ currentProject: project }),

  showModal: (type) => set({ isModalVisible: true, modalType: type }),

  hideModal: () => set({ isModalVisible: false, modalType: null }),

  resetProject: () => {
    const { currentProject } = get();
    console.log('Reset project:', currentProject?.name);
    set({ isModalVisible: false, modalType: null });
  },

  deleteProject: () => {
    const { currentProject } = get();
    console.log('Delete project:', currentProject?.name);
    set({ isModalVisible: false, modalType: null });
  },
}));