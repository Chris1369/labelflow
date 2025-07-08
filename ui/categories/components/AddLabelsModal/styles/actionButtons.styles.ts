import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const actionButtonsStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  cancelText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  submitButton: {
    flex: 1,
  },
});