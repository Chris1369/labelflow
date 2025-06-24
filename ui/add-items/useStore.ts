import { create } from "zustand";
import { BoundingBox, CameraPermissionStatus } from "../../types/camera";

interface AddItemsState {
  hasPermission: boolean | null;
  permissionStatus: CameraPermissionStatus | null;
  capturedImageUri: string | null;
  boundingBoxes: BoundingBox[];
  currentBoxId: string | null;
  isCapturing: boolean;
  showSaveButton: boolean;
}

interface AddItemsActions {
  setPermission: (hasPermission: boolean | null) => void;
  setPermissionStatus: (status: CameraPermissionStatus) => void;
  setCapturedImage: (uri: string | null) => void;
  setIsCapturing: (isCapturing: boolean) => void;
  setShowSaveButton: (show: boolean) => void;
  addBoundingBox: () => void;
  updateBoundingBox: (id: string, updates: Partial<BoundingBox>) => void;
  setCurrentBox: (id: string | null) => void;
  deleteBoundingBox: (id: string) => void;
  setLabelForBox: (id: string, label: string) => void;
  resetCapture: () => void;
}

const createInitialBox = (): BoundingBox => ({
  id: Date.now().toString(),
  centerX: 0.5, // 50% of image width
  centerY: 0.5, // 50% of image height
  width: 0.3, // 30% of image width
  height: 0.3, // 30% of image height
  rotation: 0,
  isComplete: false,
});

export const useAddItemsStore = create<AddItemsState & AddItemsActions>(
  (set, get) => ({
    hasPermission: null,
    permissionStatus: null,
    capturedImageUri: null,
    boundingBoxes: [],
    currentBoxId: null,
    isCapturing: false,
    showSaveButton: false,

    setPermission: (hasPermission) => set({ hasPermission }),

    setPermissionStatus: (permissionStatus) => set({ permissionStatus }),

    setCapturedImage: (uri) => {
      if (uri) {
        const initialBox = createInitialBox();
        set({
          capturedImageUri: uri,
          showSaveButton: true,
          boundingBoxes: [initialBox],
          currentBoxId: initialBox.id,
        });
      } else {
        set({
          capturedImageUri: uri,
          showSaveButton: false,
          boundingBoxes: [],
          currentBoxId: null,
        });
      }
    },

    setIsCapturing: (isCapturing) => set({ isCapturing }),

    setShowSaveButton: (show) => set({ showSaveButton: show }),

    addBoundingBox: () => {
      const newBox = createInitialBox();
      set((state) => ({
        boundingBoxes: [...state.boundingBoxes, newBox],
        currentBoxId: newBox.id,
      }));
    },

    updateBoundingBox: (id, updates) => {
      set((state) => ({
        boundingBoxes: state.boundingBoxes.map((box) =>
          box.id === id ? { ...box, ...updates } : box
        ),
      }));
    },

    setCurrentBox: (id) => set({ currentBoxId: id }),

    deleteBoundingBox: (id) => {
      set((state) => ({
        boundingBoxes: state.boundingBoxes.filter((box) => box.id !== id),
        currentBoxId: state.currentBoxId === id ? null : state.currentBoxId,
      }));
    },

    setLabelForBox: (id, label) => {
      set((state) => ({
        boundingBoxes: state.boundingBoxes.map((box) =>
          box.id === id ? { ...box, label, isComplete: true } : box
        ),
        currentBoxId: null, // Deselect after labeling
      }));
    },

    resetCapture: () => {
      set({
        capturedImageUri: null,
        boundingBoxes: [],
        currentBoxId: null,
        showSaveButton: false,
        isCapturing: false,
      });
    },
  })
);
