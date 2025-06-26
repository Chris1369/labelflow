import { Alert } from "react-native";
import { useSettingsStore } from "./useStore";
import { createSafeAction } from "@/helpers/safeAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/helpers/StorageKeys";
import { User } from "@/types/auth";
import axiosInstance from "@/api/axiosInstance";
import { handleApiResponse, handleApiError } from "@/api/responseHelper";
import { authAPI } from "@/api/auth.api";

export const settingsActions = {
  updateCanBeAddedToTeam: createSafeAction(
    async (value: boolean) => {
      const store = useSettingsStore.getState();
      const previousValue = store.canBeAddedToTeam;

      // Mettre à jour optimistiquement le store
      store.setCanBeAddedToTeam(value);

      try {
        // Récupérer l'utilisateur actuel depuis l'API pour avoir les données à jour
        const user = await authAPI.getCurrentUser();

        // Debug pour voir la structure de l'utilisateur
        console.log("Current user from API:", user);

        // Utiliser _id ou id selon ce qui est disponible
        const userId = user._id || user.id;
        if (!userId) {
          console.error("User object:", user);
          throw new Error("ID utilisateur non trouvé");
        }

        // Mettre à jour via l'API
        const response = await axiosInstance.put(`/users/${userId}`, {
          canBeAddedToTeam: value,
        });

        const updatedUser = handleApiResponse<User>(response);

        // Mettre à jour les données utilisateur dans AsyncStorage
        await AsyncStorage.setItem(
          StorageKeys.USER_DATA,
          JSON.stringify(updatedUser)
        );

        Alert.alert(
          "Succès",
          value
            ? "Vous pouvez maintenant être ajouté aux équipes"
            : "Vous ne pouvez plus être ajouté aux équipes"
        );
      } catch (error: any) {
        // Remettre l'ancienne valeur en cas d'erreur
        store.setCanBeAddedToTeam(previousValue);

        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Erreur lors de la mise à jour du paramètre";

        Alert.alert("Erreur", errorMessage);
        throw error;
      }
    },
    {
      showAlert: false, // On gère les alertes nous-mêmes
      componentName: "Settings",
    }
  ),

  loadUserSettings: createSafeAction(
    async () => {
      try {
        // Récupérer l'utilisateur actuel depuis l'API
        const user = await authAPI.getCurrentUser();

        // Mettre à jour le store avec la valeur actuelle
        useSettingsStore
          .getState()
          .setCanBeAddedToTeam(user.canBeAddedToTeam || false);

        // Mettre aussi à jour AsyncStorage avec les données fraîches
        await AsyncStorage.setItem(StorageKeys.USER_DATA, JSON.stringify(user));
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres:", error);
        // En cas d'erreur, essayer de charger depuis AsyncStorage
        try {
          const userDataStr = await AsyncStorage.getItem(StorageKeys.USER_DATA);
          if (userDataStr) {
            const user = JSON.parse(userDataStr);
            useSettingsStore
              .getState()
              .setCanBeAddedToTeam(user.canBeAddedToTeam || false);
          }
        } catch (storageError) {
          console.error("Erreur AsyncStorage:", storageError);
        }
      }
    },
    {
      showAlert: false,
      componentName: "Settings",
    }
  ),
};
