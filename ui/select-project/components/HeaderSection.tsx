import React from "react";
import { View, Text, StyleSheet, TextStyle } from "react-native";
import { Input } from "@/components/atoms";
import { theme } from "@/types/theme";

interface HeaderSectionProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title as TextStyle}>Sélectionner un projet</Text>
      <Input
        placeholder="Rechercher un projet..."
        value={searchQuery}
        onChangeText={onSearchChange}
        icon="search"
        containerStyle={styles.searchInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    ...theme.fonts.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    marginBottom: 0,
  },
});