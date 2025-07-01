import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "@/types/theme";
import { router } from "expo-router";

export const ProjectBottomSection: React.FC = () => {
  return (
    <View style={styles.bottomSection}>
      <TouchableOpacity
        style={styles.exitButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Text style={styles.exitButtonText}>Quitter le projet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSection: {
    marginTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.md,
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