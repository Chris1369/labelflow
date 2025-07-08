import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const labelListStyles = StyleSheet.create({
  labelsList: {
    paddingHorizontal: theme.spacing.lg,
    flex: 1,
  },
  emptyText: {
    fontSize: theme.fonts.body.fontSize,
    fontWeight: theme.fonts.body.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.body.lineHeight,
    textAlign: "center" as TextStyle["textAlign"],
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
  },
});