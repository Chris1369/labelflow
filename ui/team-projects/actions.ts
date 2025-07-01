import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useTeamProjectsStore } from './useStore';
import { useSelectTeamStore } from '../select-team/useStore';

export const teamProjectsActions = {
  loadTeamProjects: async (teamId: string) => {
    const store = useTeamProjectsStore.getState();
    await store.loadTeamProjects(teamId);
    await store.loadAllProjects();
  },

  searchProjects: (query: string) => {
    useTeamProjectsStore.getState().setSearchQuery(query);
  },

  toggleProject: (projectId: string) => {
    useTeamProjectsStore.getState().toggleProject(projectId);
  },

  saveChanges: async (teamId: string) => {
    try {
      await useTeamProjectsStore.getState().saveChanges(teamId);
      useSelectTeamStore.getState().refreshTeams?.();
      
      Alert.alert(
        'Succès',
        'Les projets de l\'équipe ont été mis à jour',
        [
          {
            text: 'OK',
            onPress: () => router.replace(`/(team)/${teamId}`),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la mise à jour des projets'
      );
    }
  },

  cancel: (teamId: string) => {
    Alert.alert(
      'Annuler',
      'Êtes-vous sûr de vouloir annuler les modifications ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          onPress: () => router.replace(`/(team)/${teamId}`),
        },
      ]
    );
  },
};