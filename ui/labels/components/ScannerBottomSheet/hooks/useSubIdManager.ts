import { Alert } from "react-native";
import { labelAPI } from "@/api/label.api";

interface UseSubIdManagerProps {
  currentLabelId: string;
  onSubIdAdded?: () => void;
  onClose: () => void;
}

export const useSubIdManager = ({
  currentLabelId,
  onSubIdAdded,
  onClose,
}: UseSubIdManagerProps) => {
  const addSubId = async (value: string) => {
    if (!value || !currentLabelId) return;

    try {
      await labelAPI.addSubId(currentLabelId, value);
      Alert.alert(
        "Succès",
        "Le code a été ajouté au label",
        [
          {
            text: "OK",
            onPress: () => {
              onSubIdAdded?.();
              onClose();
            },
          },
        ]
      );
    } catch (error: any) {
      if (error.message?.includes("already exists") || error.message?.includes("déjà existant")) {
        Alert.alert("Erreur", "Ce code est déjà associé à ce label");
      } else {
        Alert.alert("Erreur", "Impossible d'ajouter le code au label");
      }
    }
  };

  return {
    addSubId,
  };
};