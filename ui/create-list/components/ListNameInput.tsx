import React from "react";
import { View, Text, StyleSheet, TextStyle } from "react-native";
import { Input } from "@/components/atoms/Input";
import { theme } from "@/types/theme";

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
      <Input
        label='Nom de la liste'
        placeholder='Ex: Photos du salon'
        value={listName}
        onChangeText={onChangeText}
        editable={!isCreating}
      />
      {error && <Text style={styles.error as TextStyle}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: theme.spacing.sm,
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
