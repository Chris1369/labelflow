import { create } from 'zustand';
import { ProjectItem, Project } from '@/types/project';
import { projectItemAPI } from '@/api/projectItem.api';
import { projectAPI } from '@/api/project.api';
import { getCurrentUser } from '@/helpers/getCurrentUser';
import { User } from '@/types/auth';

interface ViewItemsState {
  items: ProjectItem[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  projectId: string | null;
  project: Project | null;
  currentUser: User | null;
  isOwner: boolean;
  deletingItemId: string | null;
}

interface ViewItemsActions {
  setProjectId: (projectId: string) => void;
  loadItems: (reset?: boolean) => Promise<void>;
  loadMoreItems: () => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  reset: () => void;
}

const ITEMS_PER_PAGE = 20;

export const useViewItemsStore = create<ViewItemsState & ViewItemsActions>((set, get) => ({
  // state
  items: [],
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
  projectId: null,
  project: null,
  currentUser: null,
  isOwner: false,
  deletingItemId: null,

  // actions
  setProjectId: (projectId) => {
    set({ projectId });
  },

  loadItems: async (reset = false) => {
    const { projectId, page, items } = get();
    if (!projectId) return;

    if (reset) {
      set({ page: 1, items: [], hasMore: true });
    }

    set({ isLoading: true, error: null });

    try {
      // Charger les informations du projet
      const project = await projectAPI.getOne(projectId);

      let currentUser: User | null = null;
      let isOwner = false;

      try {
        currentUser = await getCurrentUser();
        const userId = currentUser._id || currentUser.id;
        isOwner = userId === project.ownerId;
      } catch (error) {
        console.warn('Could not get current user:', error);
      }

      const response = await projectItemAPI.getProjectItems(projectId, {
        page: reset ? 1 : page,
        limit: ITEMS_PER_PAGE,
      });

      // La réponse est maintenant typée avec ProjectItemsResponse
      const projectItems = response.projectItems || [];
      const newItems = reset ? projectItems : [...items, ...projectItems];
      const hasMore = projectItems.length === ITEMS_PER_PAGE;

      set({
        items: newItems,
        isLoading: false,
        hasMore,
        page: reset ? 2 : page + 1,
        project,
        currentUser,
        isOwner,
      });
    } catch (error: any) {
      console.error('Error loading items:', error);
      set({
        error: error.message || 'Failed to load items',
        isLoading: false,
      });
    }
  },

  loadMoreItems: async () => {
    const { hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;

    await get().loadItems();
  },

  deleteItem: async (itemId: string) => {
    const { projectId, items, project } = get();
    if (!projectId || !project) return;

    set({ deletingItemId: itemId });

    try {
      // Supprimer l'item
      await projectItemAPI.delete(itemId);

      // Mettre à jour le projet pour retirer l'item de la liste
      await projectAPI.removeItemFromProject(projectId, itemId);

      // Mettre à jour l'état local
      const updatedItems = items.filter(item => item.id !== itemId);
      set({
        items: updatedItems,
        deletingItemId: null,
      });
    } catch (error: any) {
      console.error('Error deleting item:', error);
      set({
        error: error.message || 'Failed to delete item',
        deletingItemId: null,
      });
    }
  },

  reset: () => {
    set({
      items: [],
      isLoading: false,
      error: null,
      page: 1,
      hasMore: true,
      projectId: null,
      project: null,
      currentUser: null,
      isOwner: false,
      deletingItemId: null,
    });
  },
}));