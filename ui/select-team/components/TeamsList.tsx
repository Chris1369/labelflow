import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { theme } from "@/types/theme";
import { Team } from "@/types/team";
import { TeamCard } from "./TeamCard";
import { TeamEmptyState } from "./TeamEmptyState";

interface TeamsListProps {
  teams: Team[];
  searchQuery: string;
  onTeamSelect: (team: Team) => void;
  onCreateTeam: () => void;
}

export const TeamsList: React.FC<TeamsListProps> = ({
  teams,
  searchQuery,
  onTeamSelect,
  onCreateTeam,
}) => {
  return (
    <FlatList
      data={teams}
      keyExtractor={(item) => item._id || item.id}
      renderItem={({ item }) => (
        <TeamCard team={item} onPress={onTeamSelect} />
      )}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <TeamEmptyState searchQuery={searchQuery} onCreateTeam={onCreateTeam} />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  separator: {
    height: theme.spacing.md,
  },
});