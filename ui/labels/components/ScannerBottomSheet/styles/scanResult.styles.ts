import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const scanResultStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fonts.caption.fontSize,
    fontWeight: theme.fonts.caption.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.caption.lineHeight,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  value: {
    fontSize: theme.fonts.subtitle.fontSize,
    fontWeight: theme.fonts.subtitle.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.subtitle.lineHeight,
    color: theme.colors.text,
  },
  actionButtons: {
    gap: theme.spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  confirmButtonText: {
    fontSize: theme.fonts.button.fontSize,
    fontWeight: theme.fonts.button.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.button.lineHeight,
    color: theme.colors.secondary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryButtonText: {
    fontSize: theme.fonts.button.fontSize,
    fontWeight: theme.fonts.button.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.button.lineHeight,
    color: theme.colors.text,
  },
});