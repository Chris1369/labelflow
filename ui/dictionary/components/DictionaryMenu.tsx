import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';
import { DictionaryMenuItem, DictionaryMenuItemData } from './DictionaryMenuItem';

interface DictionaryMenuProps {
  menuItems: DictionaryMenuItemData[];
}

export const DictionaryMenu: React.FC<DictionaryMenuProps> = ({ menuItems }) => {
  return (
    <View style={styles.menuContainer}>
      {menuItems.map((item) => (
        <DictionaryMenuItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    gap: theme.spacing.md,
  },
});