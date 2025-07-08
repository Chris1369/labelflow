import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const searchSectionStyles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  addLabelContainer: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  addButtonText: {
    fontSize: theme.fonts.button.fontSize,
    fontWeight: theme.fonts.button.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.button.lineHeight,
    marginLeft: theme.spacing.sm,
    color: theme.colors.primary,
  },
  addButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
});