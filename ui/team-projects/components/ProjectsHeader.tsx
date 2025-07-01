import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@/components/atoms';
import { theme } from '@/types/theme';

interface ProjectsHeaderProps {
  selectedCount: number;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

export const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  selectedCount,
  totalCount,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        {selectedCount} projet{selectedCount > 1 ? "s" : ""}{" "}
        sélectionné{selectedCount > 1 ? "s" : ""} sur{" "}
        {totalCount}
      </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
});