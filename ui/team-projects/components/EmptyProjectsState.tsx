import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';

interface EmptyProjectsStateProps {
  searchQuery: string;
}

export const EmptyProjectsState: React.FC<EmptyProjectsStateProps> = ({ searchQuery }) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons
        name='folder-open'
        size={64}
        color={theme.colors.textSecondary}
      />
      <Text style={styles.emptyText}>
        {searchQuery
          ? "Aucun projet trouvé"
          : "Aucun projet disponible"}
      </Text>
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
  },
});