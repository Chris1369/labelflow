import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/types/theme";

export const labelItemStyles = StyleSheet.create({
  labelItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  labelItemWillBeAdded: {
    backgroundColor: theme.colors.success + "10",
    borderColor: theme.colors.success,
  },
  labelItemWillBeRemoved: {
    backgroundColor: theme.colors.error + "10",
    borderColor: theme.colors.error,
  },
  labelItemExisting: {
    backgroundColor: theme.colors.info + "10",
    borderColor: theme.colors.info,
  },
  labelInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  labelName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  labelNameWillBeAdded: {
    color: theme.colors.success,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  labelNameWillBeRemoved: {
    color: theme.colors.error,
    fontWeight: "600" as TextStyle["fontWeight"],
    textDecorationLine: "line-through",
  },
  labelNameExisting: {
    color: theme.colors.info,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  publicBadge: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  statusBadge: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.success,
    backgroundColor: theme.colors.success + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  statusBadgeRemove: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
    backgroundColor: theme.colors.error + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    fontWeight: "600" as TextStyle["fontWeight"],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  checkboxWillBeRemoved: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  checkmark: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
    fontWeight: "bold" as TextStyle["fontWeight"],
  },
  checkmarkRemove: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: "bold" as TextStyle["fontWeight"],
  },
});