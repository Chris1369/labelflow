import { useEffect, useState } from "react";
import { useAddItemsStore } from "../useStore";
import { addItemsActions } from "../actions";
import { resetLabelColors } from "@/helpers/labelColors";

interface UseInitializationProps {
  isForUnlabeled: boolean;
  unlabeledListId?: string;
  currentProject: any;
}

export const useInitialization = ({
  isForUnlabeled,
  unlabeledListId,
  currentProject,
}: UseInitializationProps) => {
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        if (!mounted) return;

        // Set the mode in the store
        useAddItemsStore.getState().setIsForUnlabeled(isForUnlabeled);
        useAddItemsStore.getState().setCurrentProject(currentProject || null);
        
        if (isForUnlabeled && unlabeledListId) {
          // Load UnlabeledList items
          await addItemsActions.loadUnlabeledList(unlabeledListId);
        } else {
          // Normal camera mode
          // Add delay to prevent immediate camera access
          await new Promise((resolve) => setTimeout(resolve, 300));

          if (mounted) {
            const hasPermission = await addItemsActions.checkCameraPermission();
            if (!hasPermission && mounted) {
              await addItemsActions.requestCameraPermission();
            }

            // Mark camera as ready after another small delay
            if (mounted) {
              await new Promise((resolve) => setTimeout(resolve, 200));
              setIsCameraReady(true);
            }
          }
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };

    initialize();

    // Cleanup function
    return () => {
      mounted = false;
      setIsCameraReady(false);
      // Reset capture state when unmounting
      try {
        useAddItemsStore.getState().resetCapture();
        // Reset label colors to avoid memory leaks
        resetLabelColors();
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    };
  }, [isForUnlabeled, unlabeledListId, currentProject]);

  return { isCameraReady };
};