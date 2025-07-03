import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { theme } from '@/types/theme';
import { Select } from '@/components/atoms/Select';
import { CAPTURE_TEMPLATES } from '@/constants/CapturesTemplates';

interface ListImageTemplateSelectProps {
  listImageTemplate: string;
  error: string | null;
  isCreating: boolean;
  onChangeText: (text: string) => void;
}

export const ListImageTemplateSelect: React.FC<ListImageTemplateSelectProps> = ({
  listImageTemplate,
  error,
  isCreating,
  onChangeText,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Select
        label="Template d'image"
        value={listImageTemplate}
        options={CAPTURE_TEMPLATES.map((template) => ({
          label: template.name,
          value: template.id,
        }))}
        onChange={onChangeText}
        disabled={isCreating}
        style={{
          height: 60
        }}
      />
      <Text style={styles.hint as TextStyle}>
        Sélectionnez un template d'image pour votre liste
      </Text>
      {error && <Text style={styles.error as TextStyle}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  hint: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  error: {
    ...theme.fonts.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});