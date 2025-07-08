import { StyleSheet } from "react-native";
import { theme } from "@/types/theme";

export const categoryListStyles = StyleSheet.create({
  categoriesList: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    minHeight: 45,
    maxHeight: 45,
  },
});