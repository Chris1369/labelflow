import React from "react";
import { View, StyleSheet } from "react-native";
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
  if (teams.length === 0) {
    return <TeamEmptyState searchQuery={searchQuery} onCreateTeam={onCreateTeam} />;
  }

  return (
    <View style={styles.listContent}>
      {teams.map((team, index) => (
        <View key={team._id || team.id}>
          <TeamCard team={team} onPress={onTeamSelect} />
          {index < teams.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  separator: {
    height: theme.spacing.md,
  },
});