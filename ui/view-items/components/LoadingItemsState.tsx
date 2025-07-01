import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';

export const LoadingItemsState: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='large' color={theme.colors.primary} />
      <Text style={styles.loadingText}>Chargement des items...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
});