import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";

export interface MenuItemData {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  count?: number;
}

interface MenuItemComponentProps {
  item: MenuItemData;
}

export const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  item,
}) => {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.8}
    >
      <View style={styles.menuCard}>
        <View style={styles.menuHeader}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  item.color + "15" || theme.colors.primary + "15",
              },
            ]}
          >
            <Ionicons
              name={item.icon}
              size={28}
              color={item.color || theme.colors.primary}
            />
          </View>
          {item.count !== undefined && item.count > 0 && (
            <View
              style={[
                styles.badge,
                { backgroundColor: item.color || theme.colors.primary },
              ]}
            >
              <Text style={styles.badgeText}>
                {item.count > 99 ? "99+" : item.count}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    width: "48%",
    marginBottom: theme.spacing.md,
  },
  menuCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 170,
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
  } as TextStyle,
  menuContent: {
    flex: 1,
  },
  menuItemTitle: {
    ...theme.fonts.body,
    color: theme.colors.text,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  menuItemSubtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  } as TextStyle,
});
