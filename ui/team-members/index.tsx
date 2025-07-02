import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/types/theme";
import { useTeamMembersStore } from "./useStore";
import { teamMembersActions } from "./actions";
import {
  SearchHeader,
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
    <SafeAreaView style={styles.container}>
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={teamMembersActions.searchMembers}
      />

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
});
