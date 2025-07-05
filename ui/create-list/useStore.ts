import { create } from 'zustand';

interface CreateListState {
  listName: string;
  listImageTemplate: string;
  selectedImages: string[];
  existingImagesSelected: string[];
  isCreating: boolean;
  error: string | null;
  autoCrop: boolean;
  isSelectingImages: boolean;
  processingProgress: number;
  currentProcessingImage: number;
  totalProcessingImages: number;
  uploadProgress: number;

  selectedImagesByAngle: {
    [key: string]: string[];
  };
  existingValidatedImagesByAngle: {
    [key: string]: string[];
  };
}

interface CreateListActions {
  setListName: (name: string) => void;
  setListImageTemplate: (template: string) => void;
  setSelectedImages: (images: string[]) => void;
  setExistingImagesSelected: (images: string[]) => void;
  setIsCreating: (isCreating: boolean) => void;
  setError: (error: string | null) => void;
  setAutoCrop: (autoCrop: boolean) => void;
  setIsSelectingImages: (isSelecting: boolean) => void;
  setProcessingProgress: (progress: number, current: number, total: number) => void;
  setUploadProgress: (progress: number) => void;
  reset: () => void;

  setSelectedImagesByAngle: (angle: string, images: string[]) => void;
  addImagesByAngle: (angle: string, images: string[]) => void;
  setExistingValidatedImagesByAngle: (images: {
    [key: string]: string[];
  }) => void;
}

export const useStore = create<CreateListState & CreateListActions>((set, get) => ({
  // state
  listName: '',
  listImageTemplate: '',
  selectedImages: [],
  existingImagesSelected: [],
  isCreating: false,
  error: null,
  autoCrop: false,
  isSelectingImages: false,
  processingProgress: 0,
  currentProcessingImage: 0,
  totalProcessingImages: 0,
  uploadProgress: 0,

  // selected images by angle
  selectedImagesByAngle: {},
  existingValidatedImagesByAngle: {},
  // actions
  setListName: (name) => set({ listName: name, error: null }),
  setListImageTemplate: (template) => set({ listImageTemplate: template }),
  setSelectedImages: (images) => set({ selectedImages: images }),
  setExistingImagesSelected: (images) => set({ existingImagesSelected: images }),
  setIsCreating: (isCreating) => set({ isCreating }),
  setError: (error) => set({ error }),
  setAutoCrop: (autoCrop) => set({ autoCrop }),
  setIsSelectingImages: (isSelecting) => set({ isSelectingImages: isSelecting }),
  setProcessingProgress: (progress, current, total) => set({ 
    processingProgress: progress,
    currentProcessingImage: current,
    totalProcessingImages: total
  }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
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

  setExistingValidatedImagesByAngle: (images) => {
    set({ existingValidatedImagesByAngle: images });
  },

  reset: () => set({
    listName: '',
    listImageTemplate: '',
    selectedImages: [],
    existingImagesSelected: [],
    isCreating: false,
    error: null,
    autoCrop: false,
    isSelectingImages: false,
    processingProgress: 0,
    currentProcessingImage: 0,
    totalProcessingImages: 0,
    uploadProgress: 0,
    selectedImagesByAngle: {},
    existingValidatedImagesByAngle: {},
  }),
}));