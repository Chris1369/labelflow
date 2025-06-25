import { router } from 'expo-router';

export const dictionaryActions = {
  handleCategories: () => {
    router.push('/(main)/categories');
  },

  handleLabels: () => {
    router.push('/(main)/labels');
  },
};