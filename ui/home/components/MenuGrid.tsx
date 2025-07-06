import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';
import { MenuItemComponent, MenuItemData } from './MenuItemComponent';

interface MenuGridProps {
  menuItems: MenuItemData[];
}

export const MenuGrid: React.FC<MenuGridProps> = ({ menuItems }) => {
  return (
    <View style={styles.menuGrid}>
      {menuItems.map((item) => (
        <MenuItemComponent key={item.id} item={item} />
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
});