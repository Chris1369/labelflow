import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, TextStyle } from "react-native";
import { theme } from "@/types/theme";

interface LoadingStateProps {
  text: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ text }) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText as TextStyle}>{text}</Text>
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
    ...theme.fonts.body,
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
});