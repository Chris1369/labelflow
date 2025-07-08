import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const headerStyles = StyleSheet.create({
  fixedHeader: {
    flexShrink: 0,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fonts.subtitle.fontSize,
    fontWeight: theme.fonts.subtitle.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.subtitle.lineHeight,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  subtitle: {
    fontSize: theme.fonts.caption.fontSize,
    fontWeight: theme.fonts.caption.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.caption.lineHeight,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  searchContainer: {
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  searchInput: {
    marginBottom: 0,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
});