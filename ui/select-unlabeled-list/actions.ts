import { unlabeledListAPI } from '@/api/unlabeledList.api';
import { useStore } from './useStore';
import { createSafeAction } from '@/helpers/safeAction';

export const actions = {
  setSearchQuery: (query: string) => {
    useStore.getState().setSearchQuery(query);
  },

  loadLists: createSafeAction(
    async (projectId: string) => {
      const store = useStore.getState();
      store.setIsLoading(true);
      store.setError(null);

      try {
        // Récupérer les listes du projet
        const lists = await unlabeledListAPI.getByProjectId(projectId);
        
        // Les listes sont déjà triées par date (plus récentes d'abord) côté API
        store.setLists(lists);
      } catch (error) {
        console.error('Error loading unlabeled lists:', error);
        store.setError('Impossible de charger les listes');
        store.setLists([]);
      } finally {
        store.setIsLoading(false);
      }
    },
    {
      showAlert: false,
      componentName: 'SelectUnlabeledList',
    }
  ),
};