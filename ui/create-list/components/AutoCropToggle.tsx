import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';

interface AutoCropToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const AutoCropToggle: React.FC<AutoCropToggleProps> = ({ value, onChange }) => {
  return (
    <View style={styles.switchContainer}>
      <View style={styles.switchLabel}>
        <Text style={styles.switchLabelText}>Crop auto 640x640</Text>
        <Text style={styles.switchDescription}>
          Redimensionne automatiquement les images
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary + "80",
        }}
        thumbColor={
          value
            ? theme.colors.primary
            : theme.colors.backgroundSecondary
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    width: "100%",
  },
  switchLabel: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  switchLabelText: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text,
  },
  switchDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});