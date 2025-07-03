import { create } from 'zustand';

interface CreateListState {
  listName: string;
  listImageTemplate: string;
  selectedImages: string[];
  isCreating: boolean;
  error: string | null;
  autoCrop: boolean;
  isSelectingImages: boolean;

  selectedImagesByAngle: {
    [key: string]: string[];
  };
}

interface CreateListActions {
  setListName: (name: string) => void;
  setListImageTemplate: (template: string) => void;
  setSelectedImages: (images: string[]) => void;
  setIsCreating: (isCreating: boolean) => void;
  setError: (error: string | null) => void;
  setAutoCrop: (autoCrop: boolean) => void;
  setIsSelectingImages: (isSelecting: boolean) => void;
  reset: () => void;

  setSelectedImagesByAngle: (angle: string, images: string[]) => void;
  addImagesByAngle: (angle: string, images: string[]) => void;
}

export const useStore = create<CreateListState & CreateListActions>((set, get) => ({
  // state
  listName: '',
  listImageTemplate: '',
  selectedImages: [],
  isCreating: false,
  error: null,
  autoCrop: false,
  isSelectingImages: false,

  // selected images by angle
  selectedImagesByAngle: {},

  // actions
  setListName: (name) => set({ listName: name, error: null }),
  setListImageTemplate: (template) => set({ listImageTemplate: template }),
  setSelectedImages: (images) => set({ selectedImages: images }),
  setIsCreating: (isCreating) => set({ isCreating }),
  setError: (error) => set({ error }),
  setAutoCrop: (autoCrop) => set({ autoCrop }),
  setIsSelectingImages: (isSelecting) => set({ isSelectingImages: isSelecting }),
  addImagesByAngle: (angle, images) => {
    const currentImages = get().selectedImagesByAngle[angle] || [];
    const newImages = [...currentImages, ...images];
    set({ selectedImagesByAngle: { ...get().selectedImagesByAngle, [angle]: newImages } });
  },

  setSelectedImagesByAngle: (angle, images) => {
    set({
      selectedImagesByAngle: {
        ...get().selectedImagesByAngle,
        [angle]: images,
      },
    });
  },
  

  reset: () => set({
    listName: '',
    listImageTemplate: '',
    selectedImages: [],
    isCreating: false,
    error: null,
    autoCrop: false,
    isSelectingImages: false,
  }),
}));