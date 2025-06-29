import { create } from 'zustand';

interface UnlabeledItem {
  id?: string;
  _id?: string;
  imageUrl: string;
}

interface UnlabeledList {
  id?: string;
  _id?: string;
  name: string;
  items?: UnlabeledItem[];
}

interface BoundingBox {
  id: string;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotation: number;
  label?: string;
  isComplete: boolean;
}

interface LabelListState {
  currentList: UnlabeledList | null;
  currentItemIndex: number;
  currentImageUrl: string | null;
  isLoading: boolean;
  boundingBoxes: BoundingBox[];
  currentBoxId: string | null;
  isLabelBottomSheetOpen: boolean;
  isSaving: boolean;
}

interface LabelListActions {
  setCurrentList: (list: UnlabeledList | null) => void;
  setCurrentItemIndex: (index: number) => void;
  setCurrentImageUrl: (url: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setBoundingBoxes: (boxes: BoundingBox[]) => void;
  setCurrentBoxId: (id: string | null) => void;
  setIsLabelBottomSheetOpen: (open: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  updateBoundingBox: (id: string, updates: Partial<BoundingBox>) => void;
  addBoundingBox: (box: BoundingBox) => void;
  removeBoundingBox: (id: string) => void;
  removeValidatedItem: (itemId: string) => void;
  reset: () => void;
}

export const useLabelListStore = create<LabelListState & LabelListActions>((set, get) => ({
  // State
  currentList: null,
  currentItemIndex: 0,
  currentImageUrl: null,
  isLoading: false,
  boundingBoxes: [],
  currentBoxId: null,
  isLabelBottomSheetOpen: false,
  isSaving: false,

  // Actions
  setCurrentList: (list) => set({ currentList: list }),
  setCurrentItemIndex: (index) => set({ currentItemIndex: index }),
  setCurrentImageUrl: (url) => set({ currentImageUrl: url }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setBoundingBoxes: (boxes) => set({ boundingBoxes: boxes }),
  setCurrentBoxId: (id) => set({ currentBoxId: id }),
  setIsLabelBottomSheetOpen: (open) => set({ isLabelBottomSheetOpen: open }),
  setIsSaving: (saving) => set({ isSaving: saving }),

  updateBoundingBox: (id, updates) => {
    const boxes = get().boundingBoxes;
    set({
      boundingBoxes: boxes.map(box =>
        box.id === id ? { ...box, ...updates } : box
      ),
    });
  },

  addBoundingBox: (box) => {
    set({
      boundingBoxes: [...get().boundingBoxes, box],
      currentBoxId: box.id,
    });
  },

  removeBoundingBox: (id) => {
    const boxes = get().boundingBoxes.filter(box => box.id !== id);
    set({
      boundingBoxes: boxes,
      currentBoxId: boxes.length > 0 ? boxes[0].id : null,
    });
  },

  removeValidatedItem: (itemId: string) => {
    const { currentList, currentItemIndex } = get();
    
    if (!currentList || !currentList.items) return;
    
    const updatedItems = currentList.items.filter(
      item => (item.id || item._id) !== itemId
    );
    
    set({
      currentList: { ...currentList, items: updatedItems },
    });
    
    // Load next image if available
    if (updatedItems.length > 0) {
      const nextIndex = Math.min(currentItemIndex, updatedItems.length - 1);
      const nextItem = updatedItems[nextIndex];
      set({
        currentItemIndex: nextIndex,
        currentImageUrl: nextItem.imageUrl,
        boundingBoxes: [],
        currentBoxId: null,
      });
    } else {
      // No more items
      set({
        currentImageUrl: null,
        boundingBoxes: [],
        currentBoxId: null,
      });
    }
  },

  reset: () => set({
    currentList: null,
    currentItemIndex: 0,
    currentImageUrl: null,
    isLoading: false,
    boundingBoxes: [],
    currentBoxId: null,
    isLabelBottomSheetOpen: false,
    isSaving: false,
  }),
}));