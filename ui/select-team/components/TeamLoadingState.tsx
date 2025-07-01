import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { theme } from "@/types/theme";

interface TeamLoadingStateProps {
  text: string;
}

export const TeamLoadingState: React.FC<TeamLoadingStateProps> = ({ text }) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
});