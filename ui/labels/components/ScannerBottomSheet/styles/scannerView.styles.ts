import { StyleSheet } from "react-native";
import { theme } from "@/types/theme";

export const scannerViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: "transparent",
  },
  text: {
    position: "absolute",
    bottom: 100,
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
});