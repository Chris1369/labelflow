import { StyleSheet } from "react-native";
import { theme } from "@/types/theme";

export const manualInputStyles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  input: {
    marginBottom: theme.spacing.lg,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  submitButtonText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
});