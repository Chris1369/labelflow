import { Alert } from 'react-native';
import { useTeamMembersStore, TeamMember } from './useStore';

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
  loadMembers: () => {
    useTeamMembersStore.getState().setMembers(mockMembers);
  },

  searchMembers: (query: string) => {
    useTeamMembersStore.getState().setSearchQuery(query);
  },

  addMember: () => {
    useTeamMembersStore.getState().addMember();
  },

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