import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: theme.fonts.body.fontSize,
    fontWeight: theme.fonts.body.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.body.lineHeight,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});