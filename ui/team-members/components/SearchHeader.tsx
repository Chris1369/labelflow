import React from "react";
import { View, StyleSheet } from "react-native";
import { Input } from "@/components/atoms";
import { theme } from "@/types/theme";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <View style={styles.header}>
      <Input
        placeholder="Rechercher un membre..."
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
    paddingBottom: theme.spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
});