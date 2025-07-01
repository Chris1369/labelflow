import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';
import { MemberItem } from './MemberItem';
import { createTeamActions } from '../actions';

interface InvitedMember {
  email: string;
  id: string;
}

interface InvitedMembersListProps {
  members: InvitedMember[];
}

export const InvitedMembersList: React.FC<InvitedMembersListProps> = ({ members }) => {
  if (members.length === 0) return null;

  const renderMember = ({ item }: { item: InvitedMember }) => (
    <MemberItem
      email={item.email}
      onRemove={() => createTeamActions.removeMember(item.id)}
    />
  );

  return (
    <View style={styles.membersContainer}>
      <Text style={styles.membersTitle}>
        Membres invités ({members.length})
      </Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  membersContainer: {
    marginBottom: theme.spacing.xl,
  },
  membersTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
});