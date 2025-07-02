import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import { Team } from '@/types/team';

interface TeamHeaderProps {
  team: Team | null;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({ team }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{team?.name || "Équipe"}</Text>
      {team?.description && (
        <Text style={styles.subtitle}>{team?.description}</Text>
      )}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Ionicons name='people' size={20} color={theme.colors.primary} />
          <Text style={styles.statText}>
            {team?.members?.length || 0} membres
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name='folder' size={20} color={theme.colors.info} />
          <Text style={styles.statText}>
            {team?.projectId?.length || 0} projets
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  statsContainer: {
    flexDirection: "row",
    gap: theme.spacing.xl,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  statText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: "500",
  },
});