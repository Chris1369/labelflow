import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const labelListStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fonts.body.fontSize,
    fontWeight: theme.fonts.body.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.body.lineHeight,
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.xl,
  },
});