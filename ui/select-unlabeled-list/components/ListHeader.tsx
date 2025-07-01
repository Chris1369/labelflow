import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@/components/atoms';
import { theme } from '@/types/theme';

interface ListHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

export const ListHeader: React.FC<ListHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Listes à labeliser</Text>
      <Input
        placeholder="Rechercher une liste..."
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