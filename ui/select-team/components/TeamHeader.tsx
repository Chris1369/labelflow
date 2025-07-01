import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Input } from "@/components/atoms";
import { theme } from "@/types/theme";

interface TeamHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Sélectionner une équipe</Text>
      <Input
        placeholder="Rechercher une équipe..."
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
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    marginBottom: 0,
  },
});