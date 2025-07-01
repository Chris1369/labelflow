import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';

export const SettingsHeader: React.FC = () => {
  return <Text style={styles.title}>Paramètres</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
});