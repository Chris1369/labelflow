import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/helpers/StorageKeys";
import { User } from "@/types/auth";
import { authAPI } from "@/api/auth.api";

/**
 * Récupère l'utilisateur actuel de manière fiable
 * Essaie d'abord depuis AsyncStorage, puis depuis l'API si nécessaire
 */
export async function getCurrentUser(): Promise<User> {
  try {
    // Essayer d'abord depuis AsyncStorage
    const userDataStr = await AsyncStorage.getItem(StorageKeys.USER_DATA);

    if (userDataStr) {
      const user: User = JSON.parse(userDataStr);

      // Vérifier que l'utilisateur a un ID valide
      const userId = user._id || user.id;
      if (userId) {
        return user;
      }

      console.warn(
        "User in AsyncStorage has no valid ID, fetching from API..."
      );
    }

    // Si pas de données ou pas d'ID valide, récupérer depuis l'API
    const freshUser = await authAPI.getCurrentUser();

    // Sauvegarder dans AsyncStorage pour les prochaines fois
    await AsyncStorage.setItem(
      StorageKeys.USER_DATA,
      JSON.stringify(freshUser)
    );

    return freshUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw new Error("Unable to get current user");
  }
}

/**
 * Récupère l'ID de l'utilisateur actuel
 */
export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  const userId = user._id || user.id;

  if (!userId) {
    console.error("User object has no ID:", user);
    throw new Error("User ID not found");
  }

  return userId;
}
