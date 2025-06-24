import { useCreateTeamStore } from './useStore';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export const createTeamActions = {
  createTeam: async () => {
    const { name, description, invitedMembers } = useCreateTeamStore.getState();
    
    // Validation
    if (!name.trim()) {
      useCreateTeamStore.getState().setError('Le nom de l\'équipe est obligatoire');
      return;
    }
    
    if (!description.trim()) {
      useCreateTeamStore.getState().setError('La description de l\'équipe est obligatoire');
      return;
    }
    
    try {
      useCreateTeamStore.getState().setIsCreating(true);
      useCreateTeamStore.getState().setError(null);
      
      // TODO: API call to create team
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock creating a team
      const newTeam = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        members: invitedMembers.map(m => m.email),
        createdAt: new Date().toISOString(),
      };
      
      console.log('Team created:', newTeam);
      
      // Reset form and navigate
      useCreateTeamStore.getState().resetForm();
      
      Alert.alert(
        'Succès',
        'L\'équipe a été créée avec succès',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/select-team'),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating team:', error);
      useCreateTeamStore.getState().setError('Une erreur est survenue lors de la création de l\'équipe');
    } finally {
      useCreateTeamStore.getState().setIsCreating(false);
    }
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
            router.back();
          },
        },
      ]
    );
  },
};