import { create } from 'zustand';
import { ProjectItem } from '@/types/project';
import { projectItemAPI } from '@/api/projectItem.api';

interface ViewItemsState {
  items: ProjectItem[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  projectId: string | null;
}

interface ViewItemsActions {
  setProjectId: (projectId: string) => void;
  loadItems: (reset?: boolean) => Promise<void>;
  loadMoreItems: () => Promise<void>;
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

  reset: () => {
    set({
      items: [],
      isLoading: false,
      error: null,
      page: 1,
      hasMore: true,
      projectId: null,
    });
  },
}));