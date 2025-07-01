import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { theme } from "@/types/theme";
import { TeamMember } from "@/types/team";
import { MemberCard } from "./MemberCard";

interface MembersListProps {
  members: TeamMember[];
  onRemoveMember: (member: TeamMember) => void;
}

export const MembersList: React.FC<MembersListProps> = ({
  members,
  onRemoveMember,
}) => {
  return (
    <View style={styles.membersSection}>
      <Text style={styles.sectionTitle}>
        Membres de l'équipe ({members.length})
      </Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemberCard member={item} onRemove={onRemoveMember} />
        )}
        contentContainerStyle={styles.membersList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  membersSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  membersList: {
    paddingBottom: theme.spacing.xl,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});