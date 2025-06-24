import { useCreateProjectStore } from './useStore';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export const createProjectActions = {
  createProject: async () => {
    // Utiliser la méthode createProject du store qui gère déjà tout
    await useCreateProjectStore.getState().createProject();
  },
  
  cancelCreation: () => {
    Alert.alert(
      'Annuler',
      'Êtes-vous sûr de vouloir annuler la création du projet ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          onPress: () => {
            useCreateProjectStore.getState().resetForm();
            router.replace('/(main)/home');
          },
        },
      ]
    );
  },
};