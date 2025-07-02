import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderPage, Input } from "@/components/atoms";
import { theme } from "@/types/theme";
import { useTeamMembersStore } from "./useStore";
import { teamMembersActions } from "./actions";
import {
  AddMemberSection,
  MembersList,
} from "./components";
import { useTeamMembers } from "@/hooks/queries";

interface TeamMembersScreenProps {
  teamId: string;
}

export const TeamMembersScreen: React.FC<TeamMembersScreenProps> = ({
  teamId,
}) => {
  const {
    filteredMembers,
    searchQuery,
    newMemberEmail,
    isAddingMember,
    error,
    initMembers,
  } = useTeamMembersStore();

  const { data: members, refetch: refetchTeamMembers } = useTeamMembers(teamId);

  useEffect(() => {
    initMembers({
      members: members || [],
      teamId,
      refetchTeamMembers
    });
  }, [teamId, members]);

  const handleEmailChange = (email: string) => {
    useTeamMembersStore.getState().setNewMemberEmail(email);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage 
        title="Membres de l'équipe" 
        subtitle={`${filteredMembers.length} membres`}
      />
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Rechercher un membre..."
          value={searchQuery}
          onChangeText={teamMembersActions.searchMembers}
          icon="search"
          containerStyle={styles.searchInput}
        />
      </View>

      <AddMemberSection
        newMemberEmail={newMemberEmail}
        isAddingMember={isAddingMember}
        error={error}
        onEmailChange={handleEmailChange}
        onAddMember={teamMembersActions.addMember}
      />

      <MembersList
        members={filteredMembers}
        onRemoveMember={teamMembersActions.removeMember}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
});
