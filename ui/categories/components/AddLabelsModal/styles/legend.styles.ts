import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const legendStyles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: theme.fonts.caption.fontSize,
    fontWeight: theme.fonts.caption.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.caption.lineHeight,
    color: theme.colors.textSecondary,
  },
});