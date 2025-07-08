import { StyleSheet, Dimensions } from "react-native";
import { theme } from "@/types/theme";

const { height: screenHeight } = Dimensions.get("window");

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  overlayTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    minHeight: screenHeight * 0.6,
    maxHeight: screenHeight * 0.9,
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
});