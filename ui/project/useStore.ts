import { create } from 'zustand';
import { Alert } from 'react-native';
import { Project } from '@/types/project';
import { projectAPI } from '@/api/project.api';
import { router } from 'expo-router';
import { projectKeys } from '@/hooks/queries';
import { invalidateQuery } from '@/helpers/invalidateQuery';
import { useSettingsStore } from '../settings/useStore';

interface ProjectState {
  currentProject: Project | null;
  isModalVisible: boolean;
  modalType: 'reset' | 'delete' | null;
  isLoading: boolean;
  error: string | null;
}

interface ProjectActions {
  setCurrentProject: (project: Project | null) => void;
  showModal: (type: 'reset' | 'delete') => void;
  hideModal: () => void;
  resetProject: () => Promise<void>;
  deleteProject: () => Promise<void>;
  updateProjectVisibility: (isPublic: boolean) => Promise<void>;
}

export const useProjectStore = create<ProjectState & ProjectActions>((set, get) => ({
  currentProject: null,
  isModalVisible: false,
  modalType: null,
  isLoading: false,
  error: null,

  setCurrentProject: (project) => set({ currentProject: project }),

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
      const includePublic = useSettingsStore.getState().includePublicProjects;
      invalidateQuery( projectKeys.list({ my: true, includePublic }))
      set({ isModalVisible: false, modalType: null });
      router.replace('/(main)/select-project');
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete project' });
    }
  },

  updateProjectVisibility: async (isPublic: boolean) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    // Mise à jour optimiste de l'interface
    set({ currentProject: { ...currentProject, isPublic }, error: null });
    
    try {
      const updatedProject = await projectAPI.update(currentProject.id, { isPublic });
      // Si la réponse contient le projet mis à jour avec un id, on le met à jour
      // Sinon on garde la mise à jour optimiste (cas du 204 No Content)
      if (updatedProject && updatedProject.id) {
        set({ currentProject: updatedProject });
      }
      // Si on reçoit un objet vide (204), on garde la mise à jour optimiste
    } catch (error: any) {
      console.error('Error updating project visibility:', error);
      // En cas d'erreur, on revert le changement
      set({ currentProject: { ...currentProject, isPublic: !isPublic } });
      
      // Afficher une alerte au lieu de stocker l'erreur dans le state
      if (error.message && error.message !== "Une erreur est survenue") {
        // On n'affiche l'alerte que si on a un message d'erreur spécifique
        Alert.alert('Erreur', error.message);
      }
    }
  },
}));