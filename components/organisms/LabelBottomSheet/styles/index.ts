import { StyleSheet, TextStyle, Dimensions } from "react-native";
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
    minHeight: screenHeight * 0.5,
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
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fonts.subtitle.fontSize,
    fontWeight: theme.fonts.subtitle.fontWeight as TextStyle["fontWeight"],
    lineHeight: theme.fonts.subtitle.lineHeight,
    textAlign: "center" as TextStyle["textAlign"],
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing.lg,
    top: theme.spacing.lg,
    padding: theme.spacing.xs,
    zIndex: 1,
  },
});