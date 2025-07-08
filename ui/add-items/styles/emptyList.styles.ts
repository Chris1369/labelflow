import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const emptyListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fonts.title.fontSize,
    fontWeight: theme.fonts.title.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.title.lineHeight,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  text: {
    fontSize: theme.fonts.body.fontSize,
    fontWeight: theme.fonts.body.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.body.lineHeight,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  addImagesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  addImagesButtonText: {
    fontSize: theme.fonts.button.fontSize,
    fontWeight: theme.fonts.button.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.button.lineHeight,
    color: theme.colors.secondary,
  },
});