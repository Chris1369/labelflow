import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";

export interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  variant?: "default" | "warning" | "danger";
  count?: number;
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
          activeOpacity={0.8}
        >
          <View style={styles.menuCard}>
            <View style={styles.menuHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: (item.color || theme.colors.primary) + "15" },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={28}
                  color={item.color || theme.colors.primary}
                />
              </View>
              {item.count !== undefined && item.count > 0 && (
                <View style={[styles.badge, { backgroundColor: item.color || theme.colors.primary }]}>
                  <Text style={styles.badgeText}>
                    {item.count > 99 ? "99+" : item.count}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.menuContent}>
              <Text
                style={[
                  styles.menuItemTitle,
                  item.variant === "warning" && styles.warningText,
                  item.variant === "danger" && styles.dangerText,
                ]}
              >
                {item.title}
              </Text>
              {item.subtitle && (
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              )}
            </View>
          </View>
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
  },
  menuItem: {
    width: "48%",
    marginBottom: theme.spacing.lg,
  },
  menuCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    ...theme.fonts.caption,
    color: theme.colors.background,
    fontWeight: "600",
  },
  menuContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  menuItemTitle: {
    ...theme.fonts.body,
    color: theme.colors.text,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  menuItemSubtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  warningText: {
    color: theme.colors.warning,
  },
  dangerText: {
    color: theme.colors.error,
  },
});