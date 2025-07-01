import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";

interface EmptyStateProps {
  searchQuery: string;
  onCreateProject: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onCreateProject }) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="folder-open"
        size={64}
        color={theme.colors.textSecondary}
      />
      <Text style={styles.emptyText as TextStyle}>
        {searchQuery ? "Aucun projet trouvé" : "Aucun projet disponible"}
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={onCreateProject}
      >
        <Text style={styles.createButtonText}>Créer un projet</Text>
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
    ...theme.fonts.subtitle,
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
    ...theme.fonts.button,
    color: theme.colors.secondary,
  } as TextStyle,
});