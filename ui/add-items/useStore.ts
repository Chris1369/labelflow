import { create } from "zustand";
import uuid from 'react-native-uuid';
import { BoundingBox, CameraPermissionStatus } from "../../types/camera";
import { Project } from "@/types/project";

export type FlashMode = 'off' | 'on' | 'auto';

interface AddItemsState {
  hasPermission: boolean | null;
  permissionStatus: CameraPermissionStatus | null;
  capturedImageUri: string | null;
  boundingBoxes: BoundingBox[];
  currentBoxId: string | null;
  isCapturing: boolean;
  showSaveButton: boolean;
  isSaving: boolean;
  flashMode: FlashMode;
  isPredicting: boolean;
  // UnlabeledList state
  unlabeledListItems: any[];
  currentUnlabeledIndex: number;
  isForUnlabeled: boolean;
  unlabeledListId: string | null;
  unlabeledListPredictionLabels: string[];

  currentProject: Project | null;
}

interface AddItemsActions {
  setPermission: (hasPermission: boolean | null) => void;
  setPermissionStatus: (status: CameraPermissionStatus) => void;
  setCapturedImage: (uri: string | null) => void;
  setIsCapturing: (isCapturing: boolean) => void;
  setShowSaveButton: (show: boolean) => void;
  setIsSaving: (isSaving: boolean) => void;
  addBoundingBox: () => void;
  updateBoundingBox: (id: string, updates: Partial<BoundingBox>) => void;
  setCurrentBox: (id: string | null) => void;
  deleteBoundingBox: (id: string) => void;
  setLabelForBox: (id: string, label: string) => void;
  resetCapture: () => void;
  resetBoundingBoxes: () => void;
  setBoundingBoxes: (boxes: BoundingBox[]) => void;
  setFlashMode: (mode: FlashMode) => void;
  // UnlabeledList actions
  setUnlabeledListData: (items: any[], listId: string, predictionLabels?: string[]) => void;
  setIsForUnlabeled: (isFor: boolean) => void;
  nextUnlabeledItem: () => void;
  setCurrentUnlabeledImage: (uri: string) => void;
  setCurrentUnlabeledIndex: (index: number) => void;
  generateObjectItemTrainingId: () => string;
  setCurrentProject: (project: Project | null) => void;
  setIsPredicting: (isPredicting: boolean) => void;
}

const createInitialBox = (withUnknownLabel: boolean = false): BoundingBox => ({
  id: Date.now().toString(),
  centerX: 0.5, // 50% of image width
  centerY: 0.5, // 50% of image height
  width: 0.3, // 30% of image width
  height: 0.3, // 30% of image height
  rotation: 0,
  isComplete: withUnknownLabel,
  label: withUnknownLabel ? "???" : undefined,
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
    isSaving: false,
    flashMode: 'off',
    isPredicting: false,
    // UnlabeledList state
    unlabeledListItems: [],
    currentUnlabeledIndex: 0,
    isForUnlabeled: false,
    unlabeledListId: null,
    unlabeledListPredictionLabels: [],
    currentProject: null,
    setCurrentProject: (project) => set({ currentProject: project }),
    
    setPermission: (hasPermission) => set({ hasPermission }),

    setPermissionStatus: (permissionStatus) => set({ permissionStatus }),
    
    setIsSaving: (isSaving) => set({ isSaving }),

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
      const newBox = createInitialBox(true); // Create with ??? label
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
        currentBoxId: label === "???" ? state.currentBoxId : null, // Keep selected if ???, deselect otherwise
      }));
    },

    resetCapture: () => {
      set({
        capturedImageUri: null,
        boundingBoxes: [],
        currentBoxId: null,
        showSaveButton: false,
        isCapturing: false,
        isSaving: false,
      });
    },

    resetBoundingBoxes: () => {
      set({
        boundingBoxes: [],
        currentBoxId: null,
      });
    },

    setBoundingBoxes: (boxes) => {
      set({
        boundingBoxes: boxes,
        currentBoxId: null,
        showSaveButton: boxes.length > 0,
      });
    },

    setFlashMode: (mode) => set({ flashMode: mode }),

    // UnlabeledList actions
    setUnlabeledListData: (items, listId, predictionLabels) => set({ 
      unlabeledListItems: items, 
      unlabeledListId: listId,
      currentUnlabeledIndex: 0,
      unlabeledListPredictionLabels: predictionLabels || []
    }),

    setIsForUnlabeled: (isFor) => set({ isForUnlabeled: isFor }),

    nextUnlabeledItem: () => {
      const { currentUnlabeledIndex, unlabeledListItems } = get();
      if (currentUnlabeledIndex < unlabeledListItems.length - 1) {
        set({ currentUnlabeledIndex: currentUnlabeledIndex + 1 });
      }
    },

    setCurrentUnlabeledImage: (uri) => {
      console.log("Setting unlabeled image in store:", uri);
      const initialBox = createInitialBox();
      set({
        capturedImageUri: uri,
        showSaveButton: true,
        boundingBoxes: [initialBox],
        currentBoxId: initialBox.id,
      });
      console.log("Store state after setting image:", get().capturedImageUri);
    },

    setCurrentUnlabeledIndex: (index) => set({ currentUnlabeledIndex: index }),

    generateObjectItemTrainingId: () => {
      return uuid.v4();
    },
    
    setIsPredicting: (isPredicting) => set({ isPredicting }),
  })
);
