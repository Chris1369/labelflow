import { useCreateProjectStore } from './useStore';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { projectKeys } from '@/hooks/queries/useProjects';
import { invalidateQuery } from '@/helpers/invalidateQuery';
import { useSettingsStore } from '../settings/useStore';

export const createProjectActions = {
  createProject: async () => {
    const includePublic = useSettingsStore.getState().includePublicProjects;
    // Utiliser la méthode createProject du store qui gère déjà tout
    await useCreateProjectStore.getState().createProject();
    invalidateQuery(projectKeys.list({ my: true, includePublic }));
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