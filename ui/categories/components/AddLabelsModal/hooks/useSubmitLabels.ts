import { Alert } from "react-native";
import { categoryAPI } from "@/api/category.api";
import { Category } from "@/types/category";

interface UseSubmitLabelsProps {
  category: Category;
  selectedLabelIds: Set<string>;
  getNewlySelectedLabels: (existingLabelIds: string[]) => string[];
  getLabelsToRemove: (existingLabelIds: string[]) => string[];
  setIsSubmitting: (value: boolean) => void;
  onLabelsUpdated: () => void;
  onClose: () => void;
}

export const useSubmitLabels = ({
  category,
  selectedLabelIds,
  getNewlySelectedLabels,
  getLabelsToRemove,
  setIsSubmitting,
  onLabelsUpdated,
  onClose,
}: UseSubmitLabelsProps) => {
  const handleSubmit = async () => {
    // Extract label IDs from the category labels
    const existingLabelIds = (category.labels || []).map((label) =>
      typeof label === "string" ? label : label.id
    );
    const newlySelectedLabels = getNewlySelectedLabels(existingLabelIds);
    const labelsToRemove = getLabelsToRemove(existingLabelIds);

    if (newlySelectedLabels.length === 0 && labelsToRemove.length === 0) {
      Alert.alert("Info", "Aucune modification détectée");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the final list of label IDs
      const finalLabelIds = Array.from(selectedLabelIds);

      // Update the category with the new label list
      await categoryAPI.update(category.id, {
        labels: finalLabelIds,
      });

      const message = [];
      if (newlySelectedLabels.length > 0) {
        message.push(`${newlySelectedLabels.length} label(s) ajouté(s)`);
      }
      if (labelsToRemove.length > 0) {
        message.push(`${labelsToRemove.length} label(s) supprimé(s)`);
      }

      Alert.alert("Succès", message.join(" et "));
      onLabelsUpdated();
      onClose();
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de modifier les labels"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
  };
};