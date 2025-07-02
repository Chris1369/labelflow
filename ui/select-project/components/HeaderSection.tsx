import React from "react";
import { View, StyleSheet } from "react-native";
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
      <Input
        placeholder='Rechercher un projet...'
        value={searchQuery}
        onChangeText={onSearchChange}
        icon='search'
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
  searchInput: {
    marginBottom: 0,
  },
});
