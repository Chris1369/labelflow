import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';

export const DictionaryHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Dictionnaire</Text>
      <Text style={styles.subtitle}>
        Gérez vos catégories et labels pour l'annotation
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});