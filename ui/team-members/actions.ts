import { Alert } from 'react-native';
import { useTeamMembersStore, TeamMember } from './useStore';
import { teamAPI } from '@/api/team.api';
import { createSafeAction } from '@/helpers/safeAction';
import { useSelectTeamStore } from '../select-team/useStore';

const mockMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'owner',
    joinedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@example.com',
    role: 'admin',
    joinedAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Pierre Bernard',
    email: 'pierre.bernard@example.com',
    role: 'member',
    joinedAt: '2024-03-10',
  },
];

export const teamMembersActions = {
  loadMembers: createSafeAction(
    async () => {
      const { teamId } = useTeamMembersStore.getState();
      
      try {
        // Récupérer les membres de l'équipe via l'API
        const members = await teamAPI.getTeamMembers(teamId);
        useTeamMembersStore.getState().setMembers(members);
      } catch (error) {
        console.error('Erreur lors du chargement des membres:', error);
        // En cas d'erreur, utiliser les données mockées pour le développement
        useTeamMembersStore.getState().setMembers(mockMembers);
      }
    },
    {
      showAlert: false,
      componentName: 'TeamMembers'
    }
  ),

  searchMembers: (query: string) => {
    useTeamMembersStore.getState().setSearchQuery(query);
  },

  addMember: createSafeAction(
    async () => {
      const { teamId, newMemberEmail, members } = useTeamMembersStore.getState();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(newMemberEmail)) {
        useTeamMembersStore.getState().setError('Email invalide');
        return;
      }
      
      if (members.some(member => member.email === newMemberEmail)) {
        useTeamMembersStore.getState().setError('Ce membre fait déjà partie de l\'équipe');
        return;
      }

      useTeamMembersStore.getState().setIsAddingMember(true);
      useTeamMembersStore.getState().setError(null);
      
      try {
        // Appel API pour ajouter le membre
        await teamAPI.addMember(teamId, newMemberEmail);
        
        // Recharger la liste des membres après ajout
        await teamMembersActions.loadMembers();
        
        // Réinitialiser le formulaire
        useTeamMembersStore.getState().resetForm();
        useSelectTeamStore.getState().refreshTeams?.();
        
        Alert.alert(
          'Succès',
          'Le membre a été ajouté à l\'équipe avec succès'
        );
      } catch (error: any) {
        let errorMessage = 'Erreur lors de l\'ajout du membre';
        
        if (error?.response?.status === 403) {
          errorMessage = 'Cet utilisateur n\'autorise pas l\'ajout aux équipes. L\'utilisateur doit activer cette option dans son profil.';
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        useTeamMembersStore.getState().setError(errorMessage);
      } finally {
        useTeamMembersStore.getState().setIsAddingMember(false);
      }
    },
    {
      showAlert: false, // On gère les alertes nous-mêmes
      componentName: 'TeamMembers'
    }
  ),

  removeMember: (member: TeamMember) => {
    if (member.role === 'owner') {
      Alert.alert(
        'Action impossible',
        'Vous ne pouvez pas retirer le propriétaire de l\'équipe'
      );
      return;
    }

    Alert.alert(
      'Retirer le membre',
      `Êtes-vous sûr de vouloir retirer ${member.name} de l'équipe ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: () => {
            useTeamMembersStore.getState().removeMember(member.id);
          },
        },
      ]
    );
  },

  updateMemberRole: (member: TeamMember, newRole: 'admin' | 'member') => {
    // TODO: Implement role update
    console.log('Update role for', member.name, 'to', newRole);
  },
};