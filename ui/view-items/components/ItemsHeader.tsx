import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';

interface ItemsHeaderProps {
  itemCount: number;
}

export const ItemsHeader: React.FC<ItemsHeaderProps> = ({ itemCount }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Items du projet</Text>
      <Text style={styles.subtitle}>
        {itemCount} item{itemCount > 1 ? "s" : ""}
      </Text>
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
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
});