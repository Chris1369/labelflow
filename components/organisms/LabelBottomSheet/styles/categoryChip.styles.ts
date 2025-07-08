import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const categoryChipStyles = StyleSheet.create({
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 35,
    justifyContent: "center",
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  categoryText: {
    fontSize: theme.fonts.caption.fontSize,
    fontWeight: theme.fonts.caption.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.caption.lineHeight,
    color: theme.colors.text,
  },
  categoryTextActive: {
    color: theme.colors.secondary,
  },
  dynamicIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginLeft: 4,
  },
});