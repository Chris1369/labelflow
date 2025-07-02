import { create } from 'zustand';

interface CreateListState {
  listName: string;
  selectedImages: string[];
  isCreating: boolean;
  error: string | null;
  autoCrop: boolean;
  isSelectingImages: boolean;
}

interface CreateListActions {
  setListName: (name: string) => void;
  setSelectedImages: (images: string[]) => void;
  setIsCreating: (isCreating: boolean) => void;
  setError: (error: string | null) => void;
  setAutoCrop: (autoCrop: boolean) => void;
  setIsSelectingImages: (isSelecting: boolean) => void;
  reset: () => void;
}

export const useStore = create<CreateListState & CreateListActions>((set, get) => ({
  // state
  listName: '',
  selectedImages: [],
  isCreating: false,
  error: null,
  autoCrop: false,
  isSelectingImages: false,

  // actions
  setListName: (name) => set({ listName: name, error: null }),
  setSelectedImages: (images) => set({ selectedImages: images }),
  setIsCreating: (isCreating) => set({ isCreating }),
  setError: (error) => set({ error }),
  setAutoCrop: (autoCrop) => set({ autoCrop }),
  setIsSelectingImages: (isSelecting) => set({ isSelectingImages: isSelecting }),
  
  reset: () => set({
    listName: '',
    selectedImages: [],
    isCreating: false,
    error: null,
    autoCrop: false,
    isSelectingImages: false,
  }),
}));