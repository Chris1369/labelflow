import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from '../../components/atoms';
import { theme } from '../../types/theme';
import { useTeamMembersStore, TeamMember } from './useStore';
import { teamMembersActions } from './actions';

interface TeamMembersScreenProps {
  teamId: string;
}

export const TeamMembersScreen: React.FC<TeamMembersScreenProps> = ({ teamId }) => {
  const {
    filteredMembers,
    searchQuery,
    newMemberEmail,
    isAddingMember,
    error,
  } = useTeamMembersStore();

  useEffect(() => {
    teamMembersActions.loadMembers();
  }, []);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'owner':
        return { backgroundColor: theme.colors.primary };
      case 'admin':
        return { backgroundColor: theme.colors.info };
      default:
        return { backgroundColor: theme.colors.textSecondary };
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Propriétaire';
      case 'admin':
        return 'Admin';
      default:
        return 'Membre';
    }
  };

  const renderMember = ({ item }: { item: TeamMember }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <View style={styles.memberAvatar}>
          <Text style={styles.avatarText}>
            {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberEmail}>{item.email}</Text>
        </View>
      </View>
      <View style={styles.memberActions}>
        <View style={[styles.roleBadge, getRoleBadgeStyle(item.role)]}>
          <Text style={styles.roleText}>{getRoleText(item.role)}</Text>
        </View>
        {item.role !== 'owner' && (
          <TouchableOpacity
            onPress={() => teamMembersActions.removeMember(item)}
            style={styles.removeButton}
          >
            <Ionicons name="trash" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Input
          placeholder="Rechercher un membre..."
          value={searchQuery}
          onChangeText={teamMembersActions.searchMembers}
          icon="search"
          containerStyle={styles.searchInput}
        />
      </View>

      <View style={styles.addMemberSection}>
        <Text style={styles.sectionTitle}>Ajouter un membre</Text>
        <View style={styles.addMemberForm}>
          <Input
            placeholder="Email du nouveau membre"
            value={newMemberEmail}
            onChangeText={(email) => useTeamMembersStore.getState().setNewMemberEmail(email)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.emailInput}
          />
          <Button
            title={isAddingMember ? '' : 'Inviter'}
            onPress={teamMembersActions.addMember}
            disabled={!newMemberEmail.trim() || isAddingMember}
            size="small"
          >
            {isAddingMember && (
              <ActivityIndicator color={theme.colors.secondary} size="small" />
            )}
          </Button>
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      <View style={styles.membersSection}>
        <Text style={styles.sectionTitle}>
          Membres de l'équipe ({filteredMembers.length})
        </Text>
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={renderMember}
          contentContainerStyle={styles.membersList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  addMemberSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  addMemberForm: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  emailInput: {
    flex: 1,
    marginBottom: 0,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
  },
  membersSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  membersList: {
    paddingBottom: theme.spacing.xl,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  roleText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});