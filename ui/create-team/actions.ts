import { useCreateTeamStore } from './useStore';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useSelectTeamStore } from '../select-team/useStore';

export const createTeamActions = {
  createTeam: async () => {
    // Utiliser la méthode createTeam du store qui gère déjà tout
    await useCreateTeamStore.getState().createTeam();
    useSelectTeamStore.getState().refreshTeams?.();
  },
  
  addCurrentEmail: () => {
    useCreateTeamStore.getState().addMember();
  },
  
  removeMember: (id: string) => {
    useCreateTeamStore.getState().removeMember(id);
  },
  
  cancelCreation: () => {
    Alert.alert(
      'Annuler',
      'Êtes-vous sûr de vouloir annuler la création de l\'équipe ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          onPress: () => {
            useCreateTeamStore.getState().resetForm();
            router.replace('/(main)/home');
          },
        },
      ]
    );
  },
};