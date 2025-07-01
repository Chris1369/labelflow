import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';
import { router } from 'expo-router';

export const TeamBottomSection: React.FC = () => {
  return (
    <View style={styles.bottomSection}>
      <TouchableOpacity
        style={styles.exitButton}
        onPress={() => router.replace("/(main)/home")}
        activeOpacity={0.7}
      >
        <Text style={styles.exitButtonText}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSection: {
    marginTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
  },
  exitButton: {
    alignItems: "center",
    padding: theme.spacing.md,
  },
  exitButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
});