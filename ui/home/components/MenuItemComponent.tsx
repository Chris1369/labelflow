import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';

export interface MenuItemData {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}

interface MenuItemComponentProps {
  item: MenuItemData;
}

export const MenuItemComponent: React.FC<MenuItemComponentProps> = ({ item }) => {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          item.color && { backgroundColor: item.color + "20" },
        ]}
      >
        <Ionicons
          name={item.icon}
          size={48}
          color={item.color || theme.colors.primary}
        />
      </View>
      <Text style={styles.menuItemText}>{item.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  menuItemText: {
    ...theme.fonts.body,
    color: theme.colors.text,
    textAlign: "center",
  } as TextStyle,
});