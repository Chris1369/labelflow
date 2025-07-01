import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';

export const EmptyItemsState: React.FC = () => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons
        name='images-outline'
        size={64}
        color={theme.colors.textSecondary}
      />
      <Text style={styles.emptyText}>Aucun item dans ce projet</Text>
      <Text style={styles.emptySubtext}>
        Commencez par ajouter des images à votre projet
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing.xxl * 2,
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
  },
});