import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';

interface PublicToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const PublicToggle: React.FC<PublicToggleProps> = ({ value, onChange }) => {
  return (
    <View style={styles.switchContainer}>
      <View style={styles.switchLabel}>
        <Text style={styles.label}>Rendre public</Text>
        <Text style={styles.switchDescription}>
          Les autres utilisateurs pourront voir ce projet
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ 
          false: theme.colors.border, 
          true: theme.colors.primary + '80' 
        }}
        thumbColor={value ? theme.colors.primary : theme.colors.backgroundSecondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
  },
  switchLabel: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  switchDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});