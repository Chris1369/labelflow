import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@/components/atoms/Input';
import { theme } from '@/types/theme';

interface ListNameInputProps {
  listName: string;
  error: string | null;
  isCreating: boolean;
  onChangeText: (text: string) => void;
}

export const ListNameInput: React.FC<ListNameInputProps> = ({
  listName,
  error,
  isCreating,
  onChangeText,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Nom de la liste</Text>
      <Input
        placeholder="Ex: Photos du salon"
        value={listName}
        onChangeText={onChangeText}
        editable={!isCreating}
      />
      <Text style={styles.hint}>
        Ce nom vous aidera à identifier votre liste d'images
      </Text>
      {error && <Text style={styles.error}>{error}</Text>}
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
  error: {
    ...theme.fonts.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});