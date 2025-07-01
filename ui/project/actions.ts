import { router } from 'expo-router';
import { useProjectStore } from './useStore';
import { Alert } from 'react-native';
import { trainingAnnotationAPI } from '@/api/trainingAnnotation.api';

export const projectActions = {
  handleAddItems: async (projectId: string) => {
    // Add delay to prevent immediate camera access
    await new Promise(resolve => setTimeout(resolve, 100));
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
      pathname: '/(project)/[id]/select-unlabeled-list',
      params: { id: projectId }
    });
  },

  handleReset: () => {
    useProjectStore.getState().showModal('reset');
  },

  startTraining: async () => {
    const { currentProject } = useProjectStore.getState();
    
    if (!currentProject) {
      Alert.alert('Erreur', 'Aucun projet sélectionné');
      return;
    }

    try {
      Alert.alert(
        'Démarrer l\'entraînement',
        `Voulez-vous démarrer l'entraînement du modèle pour le projet "${currentProject.name}" ?`,
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Démarrer',
            onPress: async () => {
              try {
                await trainingAnnotationAPI.startTraining(
                  currentProject.name,
                  100, // epochs
                  8    // batch_size
                );
                
                Alert.alert(
                  'Entraînement démarré',
                  'L\'entraînement du modèle a été lancé avec succès.'
                );
              } catch (error) {
                console.error('Error starting training:', error);
                Alert.alert(
                  'Erreur',
                  'Impossible de démarrer l\'entraînement. Vérifiez que le serveur est en ligne.'
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error in startTraining:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
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