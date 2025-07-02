import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SimpleBottomSheet } from '@/components/molecules/SimpleBottomSheet';
import { Input, Button } from '@/components/atoms';
import { theme } from '@/types/theme';
import { useTeamMembers } from '@/hooks/queries';
import { TeamMember } from '@/types/team';
import { MemberCard } from './MemberCard';
import { teamAPI } from '@/api/team.api';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useTeamStore } from '../useStore';

export interface TeamMembersBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface TeamMembersBottomSheetProps {
  teamId: string;
}

export const TeamMembersBottomSheet = forwardRef<
  TeamMembersBottomSheetRef,
  TeamMembersBottomSheetProps
>(({ teamId }, ref) => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError, wrapAsync } = useErrorHandler('TeamMembersBottomSheet');
  
  const { data: members = [], refetch } = useTeamMembers(teamId);
  const currentTeam = useTeamStore((state) => state.currentTeam);

  const filteredMembers = members.filter(member =>
    member?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }));

  const handleAddMember = wrapAsync(async () => {
    if (!newMemberEmail.trim()) {
      setError('Veuillez entrer une adresse email');
      return;
    }

    setIsAddingMember(true);
    setError(null);

    try {
      await teamAPI.addMember(teamId, newMemberEmail);
      setNewMemberEmail('');
      await refetch();
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError("Cet utilisateur n'autorise pas l'ajout aux équipes");
      } else if (err?.response?.status === 404) {
        setError('Utilisateur non trouvé');
      } else if (err?.response?.status === 409) {
        setError('Cet utilisateur est déjà membre de l\'équipe');
      } else {
        setError(err?.response?.data?.message || 'Erreur lors de l\'ajout du membre');
      }
    } finally {
      setIsAddingMember(false);
    }
  });

  const handleRemoveMember = wrapAsync(async (member: TeamMember) => {
    try {
      await teamAPI.removeMember(teamId, member.id);
      await refetch();
    } catch (error) {
      handleError(error);
    }
  });

  return (
    <SimpleBottomSheet
      visible={visible}
      onClose={() => setVisible(false)}
      height="90%"
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Membres de l'équipe</Text>
          <Text style={styles.subtitle}>{filteredMembers.length} membres</Text>
        </View>

        <View style={styles.searchContainer}>
          <Input
            placeholder="Rechercher un membre..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="search"
            containerStyle={styles.searchInput}
          />
        </View>

        <View style={styles.addMemberSection}>
          <Text style={styles.sectionTitle}>Ajouter un membre</Text>
          <View style={styles.addMemberForm}>
            <Input
              placeholder="Email du membre"
              value={newMemberEmail}
              onChangeText={(text) => {
                setNewMemberEmail(text);
                setError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isAddingMember}
              containerStyle={styles.emailInput}
            />
            <Button
              title="Ajouter"
              onPress={handleAddMember}
              loading={isAddingMember}
              disabled={!newMemberEmail.trim() || isAddingMember}
              style={styles.addButton}
            />
          </View>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>
            Membres actuels ({members.length})
          </Text>
          <FlatList
            data={filteredMembers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MemberCard 
                member={item} 
                onRemove={handleRemoveMember}
              />
            )}
            contentContainerStyle={styles.membersList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </KeyboardAvoidingView>
    </SimpleBottomSheet>
  );
});

TeamMembersBottomSheet.displayName = 'TeamMembersBottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  addMemberSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
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
  addButton: {
    paddingHorizontal: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.sm,
  },
  membersSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  membersList: {
    paddingBottom: theme.spacing.xl,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});