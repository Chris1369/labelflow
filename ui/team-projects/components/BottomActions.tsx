import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from '@/components/atoms';
import { theme } from '@/types/theme';

interface BottomActionsProps {
  isUpdating: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const BottomActions: React.FC<BottomActionsProps> = ({
  isUpdating,
  onSave,
  onCancel,
}) => {
  return (
    <View style={styles.bottomActions}>
      <Button
        title={isUpdating ? "" : "Enregistrer les modifications"}
        onPress={onSave}
        disabled={isUpdating}
        style={styles.saveButton}
      >
        {isUpdating && (
          <ActivityIndicator color={theme.colors.secondary} size='small' />
        )}
      </Button>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        disabled={isUpdating}
      >
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomActions: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  saveButton: {
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