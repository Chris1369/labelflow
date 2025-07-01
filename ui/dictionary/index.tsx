import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/types/theme';
import { dictionaryActions } from './actions';
import { 
  DictionaryHeader, 
  DictionaryMenu, 
  type DictionaryMenuItemData 
} from './components';

export const DictionaryScreen: React.FC = () => {
  const menuItems: DictionaryMenuItemData[] = [
    {
      id: 'categories',
      title: 'Gestion des catégories',
      description: 'Créer et gérer vos catégories de labels',
      icon: 'folder',
      onPress: dictionaryActions.handleCategories,
      color: theme.colors.primary,
    },
    {
      id: 'labels',
      title: 'Gestion des labels',
      description: 'Créer et gérer vos labels',
      icon: 'pricetag',
      onPress: dictionaryActions.handleLabels,
      color: theme.colors.info,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <DictionaryHeader />
        <DictionaryMenu menuItems={menuItems} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
});