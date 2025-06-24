import { router } from 'expo-router';
import { useProjectStore } from './useStore';
import { Alert } from 'react-native';

export const projectActions = {
  handleAddItems: (projectId: string) => {
    router.push({
      pathname: '/(project)/[id]/add-items',
      params: { id: projectId }
    });
  },

  handleViewItems: (projectId: string) => {
    router.push({
      pathname: '/(project)/[id]/view-items',
      params: { id: projectId }
    });
  },

  handleExport: (projectId: string) => {
    router.push({
      pathname: '/(project)/[id]/export',
      params: { id: projectId }
    });
  },

  handleImport: (projectId: string) => {
    router.push({
      pathname: '/(project)/[id]/import',
      params: { id: projectId }
    });
  },

  handleReset: () => {
    useProjectStore.getState().showModal('reset');
  },

  handleDelete: () => {
    useProjectStore.getState().showModal('delete');
  },

  confirmReset: () => {
    useProjectStore.getState().resetProject();
  },

  confirmDelete: () => {
    useProjectStore.getState().deleteProject();
    router.back();
  },

  cancelModal: () => {
    useProjectStore.getState().hideModal();
  },

  showWarningModal: () => {
    const { modalType } = useProjectStore.getState();
    
    if (modalType === 'reset') {
      Alert.alert(
        'Réinitialiser le projet',
        'Êtes-vous sûr de vouloir réinitialiser ce projet ? Tous les items seront supprimés.',
        [
          {
            text: 'Annuler',
            onPress: projectActions.cancelModal,
            style: 'cancel',
          },
          {
            text: 'Réinitialiser',
            onPress: projectActions.confirmReset,
            style: 'destructive',
          },
        ],
      );
    } else if (modalType === 'delete') {
      Alert.alert(
        'Supprimer le projet',
        'Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.',
        [
          {
            text: 'Annuler',
            onPress: projectActions.cancelModal,
            style: 'cancel',
          },
          {
            text: 'Supprimer',
            onPress: projectActions.confirmDelete,
            style: 'destructive',
          },
        ],
      );
    }
  },
};