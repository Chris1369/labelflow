import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { Team } from "@/types/team";

interface TeamCardProps {
  team: Team;
  onPress: (team: Team) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.teamCard}
      onPress={() => onPress(team)}
      activeOpacity={0.7}
    >
      <View style={styles.teamHeader}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="people-outline"
            size={24}
            color="#4CAF50"
          />
        </View>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{team.name}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>
      {team.description ? (
        <Text style={styles.teamDescription} numberOfLines={2}>
          {team.description}
        </Text>
      ) : (
        <Text style={[styles.teamDescription, { fontStyle: 'italic' }]}>
          Aucune description
        </Text>
      )}
      <View style={styles.teamStats}>
        <View style={styles.stat}>
          <Ionicons
            name="people"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>
            {team.members?.length || 0} membres
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons
            name="folder"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>
            {team.projectId?.length || 0} projets
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons
            name="calendar"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>
            {new Date(team.createdAt).toLocaleDateString("fr-FR")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  teamCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: "#4CAF50" + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  teamInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  teamName: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
  },
  teamDescription: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  teamStats: {
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statText: {
    ...theme.fonts.label,
    color: theme.colors.textSecondary,
  },
});