import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from '@/components/atoms';
import { theme } from '@/types/theme';

interface ActionButtonsProps {
  isCreating: boolean;
  onCreate: () => void;
  onCancel: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isCreating,
  onCreate,
  onCancel,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <Button
        title={isCreating ? "" : "Créer le projet"}
        onPress={onCreate}
        disabled={isCreating}
        style={styles.createButton}
      >
        {isCreating && (
          <ActivityIndicator color={theme.colors.secondary} size='small' />
        )}
      </Button>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        disabled={isCreating}
      >
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: theme.spacing.xl,
  },
  createButton: {
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
    padding: theme.spacing.md,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
});