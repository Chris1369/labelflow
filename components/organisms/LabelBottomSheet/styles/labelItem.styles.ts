import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const labelItemStyles = StyleSheet.create({
  labelItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  recentLabelItem: {
    backgroundColor: theme.colors.primary + "05",
  },
  labelContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  labelText: {
    fontSize: theme.fonts.body.fontSize,
    fontWeight: theme.fonts.body.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.body.lineHeight,
    marginLeft: theme.spacing.xs,
  },
  labelRightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  counterBadge: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
    minWidth: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  counterText: {
    fontSize: theme.fonts.caption.fontSize,
    fontWeight: "500" as TextStyle["fontWeight"],
    lineHeight: theme.fonts.caption.lineHeight,
    color: theme.colors.textSecondary,
  },
  labelCategory: {
    fontSize: theme.fonts.caption.fontSize,
    fontWeight: theme.fonts.caption.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.caption.lineHeight,
    color: theme.colors.textSecondary,
  },
  recentLabelCategory: {
    color: theme.colors.primary,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  dynamicLabelIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
});