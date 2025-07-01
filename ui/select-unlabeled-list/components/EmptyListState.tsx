import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';

interface EmptyListStateProps {
  searchQuery: string;
  onCreateList: () => void;
}

export const EmptyListState: React.FC<EmptyListStateProps> = ({
  searchQuery,
  onCreateList,
}) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="folder-open" 
        size={64} 
        color={theme.colors.textSecondary} 
      />
      <Text style={styles.emptyText}>
        {searchQuery ? "Aucune liste trouvée" : "Aucune liste disponible"}
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={onCreateList}
      >
        <Text style={styles.createButtonText}>Créer une liste</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});