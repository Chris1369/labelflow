import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@/components/atoms';
import { theme } from '@/types/theme';

interface ProjectNameInputProps {
  value: string;
  onChange: (text: string) => void;
}

export const ProjectNameInput: React.FC<ProjectNameInputProps> = ({ value, onChange }) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Nom du projet</Text>
      <Input
        placeholder='Ex: Inventaire magasin'
        value={value}
        onChangeText={onChange}
        autoCapitalize='sentences'
        maxLength={50}
      />
      <Text style={styles.charCount}>{value.length}/50</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  charCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "right",
    marginTop: theme.spacing.xs,
  },
});