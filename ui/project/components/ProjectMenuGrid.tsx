import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";

export interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  variant?: "default" | "warning" | "danger";
}

interface ProjectMenuGridProps {
  menuItems: MenuItem[];
}

export const ProjectMenuGrid: React.FC<ProjectMenuGridProps> = ({ menuItems }) => {
  return (
    <View style={styles.menuGrid}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.menuItem}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              item.color && { backgroundColor: item.color + "20" },
              item.variant === "warning" && styles.warningContainer,
              item.variant === "danger" && styles.dangerContainer,
            ]}
          >
            <Ionicons
              name={item.icon}
              size={48}
              color={item.color || theme.colors.primary}
            />
          </View>
          <Text
            style={[
              styles.menuItemText,
              item.variant === "warning" && styles.warningText,
              item.variant === "danger" && styles.dangerText,
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
  },
  menuItem: {
    width: "47%",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  warningContainer: {
    borderColor: theme.colors.warning,
  },
  dangerContainer: {
    borderColor: theme.colors.error,
  },
  menuItemText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: "500",
    textAlign: "center",
  },
  warningText: {
    color: theme.colors.warning,
  },
  dangerText: {
    color: theme.colors.error,
  },
});