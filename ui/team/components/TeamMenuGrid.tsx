import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';
import { MenuItem, MenuItemData } from './MenuItem';

interface TeamMenuGridProps {
  menuItems: MenuItemData[];
}

export const TeamMenuGrid: React.FC<TeamMenuGridProps> = ({ menuItems }) => {
  return (
    <View style={styles.menuContainer}>
      {menuItems.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    gap: theme.spacing.md,
  },
});