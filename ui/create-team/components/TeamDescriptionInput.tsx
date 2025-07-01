import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@/components/atoms';
import { theme } from '@/types/theme';

interface TeamDescriptionInputProps {
  value: string;
  onChange: (text: string) => void;
}

export const TeamDescriptionInput: React.FC<TeamDescriptionInputProps> = ({ value, onChange }) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Description</Text>
      <Input
        placeholder="Décrivez votre équipe..."
        value={value}
        onChangeText={onChange}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={styles.textArea}
        maxLength={200}
      />
      <Text style={styles.charCount}>{value.length}/200</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  textArea: {
    minHeight: 100,
    paddingTop: theme.spacing.md,
  },
  charCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
});