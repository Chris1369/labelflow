import { useRef } from "react";
import { LabelBottomSheetRef } from "@/components/organisms";
import { useAddItemsStore } from "../useStore";
import { addItemsActions } from "../actions";
import { RecentLabelsManager } from "@/helpers/recentLabels";

interface UseHandlersProps {
  projectId: string;
  isForUnlabeled: boolean;
  unlabeledListId?: string;
}

export const useHandlers = ({
  projectId,
  isForUnlabeled,
  unlabeledListId,
}: UseHandlersProps) => {
  const cameraRef = useRef<any>(null);
  const bottomSheetRef = useRef<LabelBottomSheetRef>(null);
  
  const { 
    boundingBoxes, 
    currentBoxId, 
    isCapturing, 
    unlabeledListItems, 
    currentUnlabeledIndex 
  } = useAddItemsStore();

  const handleCapture = () => {
    if (cameraRef.current && !isCapturing) {
      addItemsActions.takePicture(cameraRef.current);
    }
  };

  const handleImport = () => {
    addItemsActions.importFromGallery();
  };

  const handleBoxUpdate = (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
  ) => {
    useAddItemsStore.getState().updateBoundingBox(id, {
      centerX: x,
      centerY: y,
      width,
      height,
      rotation,
    });
  };

  const hasUnknownBoxes = boundingBoxes.some(
    (box) => box.label === "???" || box.label === "Objet non identifié"
  );

  const handleValidate = () => {
    if (currentBoxId) {
      // Validate current box - open label selector
      bottomSheetRef.current?.open();
    } else if (hasUnknownBoxes) {
      // If there are unknown boxes, select the first one
      const firstUnknownBox = boundingBoxes.find((box) => box.label === "???");
      if (firstUnknownBox) {
        useAddItemsStore.getState().setCurrentBox(firstUnknownBox.id);
        bottomSheetRef.current?.open();
      }
    } else {
      // If in UnlabeledList mode, validate the item and move to next
      if (isForUnlabeled && unlabeledListId) {
        addItemsActions.validateUnlabeledItem(projectId, unlabeledListId);
      } else {
        // Save all items in normal mode
        addItemsActions.saveAllItems(projectId);
      }
    }
  };

  const handleSelectLabel = async (label: string) => {
    if (currentBoxId) {
      useAddItemsStore.getState().setLabelForBox(currentBoxId, label);
      // Add to recent labels
      await RecentLabelsManager.addRecentLabel(label);
    }
  };

  const handleDeleteBox = (id: string) => {
    useAddItemsStore.getState().deleteBoundingBox(id);
  };

  const handleEditLabel = (id: string) => {
    useAddItemsStore.getState().setCurrentBox(id);
    bottomSheetRef.current?.open();
  };

  const handleAddBox = () => {
    useAddItemsStore.getState().addBoundingBox();
  };

  const handleSelectBox = (id: string) => {
    useAddItemsStore.getState().setCurrentBox(id);
  };

  const hasNextImage =
    isForUnlabeled && currentUnlabeledIndex < unlabeledListItems.length - 1;

  const handleNextImage = () => {
    if (hasNextImage) {
      addItemsActions.loadNextUnlabeledImage();
    }
  };

  return {
    cameraRef,
    bottomSheetRef,
    handleCapture,
    handleImport,
    handleBoxUpdate,
    handleValidate,
    handleSelectLabel,
    handleDeleteBox,
    handleEditLabel,
    handleAddBox,
    handleSelectBox,
    handleNextImage,
    hasNextImage,
  };
};