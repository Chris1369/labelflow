import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';

export const InfoSection: React.FC = () => {
  return (
    <View style={styles.infoSection}>
      <Text style={styles.infoText}>
        Ces paramètres sont stockés localement et s'appliquent uniquement à
        cet appareil.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.info + "10",
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xl,
  },
  infoText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.info,
    textAlign: "center",
    lineHeight: theme.fontSize.sm * 1.5,
  },
});