import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';
import { CAPTURE_TEMPLATES } from '@/constants/CapturesTemplates';

interface AddModeInfoProps {
  listName: string;
  listImageTemplate: string;
}

export const AddModeInfo: React.FC<AddModeInfoProps> = ({ listName, listImageTemplate }) => {
  const listImageTemplateName = CAPTURE_TEMPLATES.find(template => template.id === listImageTemplate)?.name;
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Liste : {listName}</Text>
      {listImageTemplate && <Text style={styles.label}>Template capture : {listImageTemplateName}</Text>}
      <Text style={styles.hint}>
        Sélectionnez des images à ajouter à cette liste
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.fonts.body,
    marginBottom: theme.spacing.sm,
  },
  hint: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
});