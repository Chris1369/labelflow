import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useTeamProjectsStore } from './useStore';
import { mockProjects } from '../../mock/projects';

export const teamProjectsActions = {
  loadProjects: () => {
    // Load all projects and set some as selected (mock)
    useTeamProjectsStore.getState().setAllProjects(mockProjects);
    
    // Mock: first 3 projects are already selected for this team
    const selectedIds = mockProjects.slice(0, 3).map(p => p.id);
    useTeamProjectsStore.getState().setSelectedProjects(selectedIds);
  },

  searchProjects: (query: string) => {
    useTeamProjectsStore.getState().setSearchQuery(query);
  },

  toggleProject: (projectId: string) => {
    useTeamProjectsStore.getState().toggleProject(projectId);
  },

  saveChanges: async () => {
    try {
      await useTeamProjectsStore.getState().saveChanges();
      
      Alert.alert(
        'Succès',
        'Les projets de l\'équipe ont été mis à jour',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
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

  cancel: () => {
    Alert.alert(
      'Annuler',
      'Êtes-vous sûr de vouloir annuler les modifications ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          onPress: () => router.back(),
        },
      ]
    );
  },
};