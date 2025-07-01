import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";

interface TeamEmptyStateProps {
  searchQuery: string;
  onCreateTeam: () => void;
}

export const TeamEmptyState: React.FC<TeamEmptyStateProps> = ({
  searchQuery,
  onCreateTeam,
}) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="people" size={64} color={theme.colors.textSecondary} />
      <Text style={styles.emptyText}>
        {searchQuery ? "Aucune équipe trouvée" : "Aucune équipe disponible"}
      </Text>
      <TouchableOpacity style={styles.createButton} onPress={onCreateTeam}>
        <Text style={styles.createButtonText}>Créer une équipe</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  createButton: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  createButtonText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
});