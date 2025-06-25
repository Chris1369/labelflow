import { BaseAPI } from "./baseAPI";
import axiosInstance from "./axiosInstance";
import { handleApiResponse, handleApiError } from "./responseHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/helpers/StorageKeys";
import { Label, CreateLabelRequest, UpdateLabelRequest } from "@/types/label";
import { User } from "@/types/auth";

class LabelAPI extends BaseAPI<Label, CreateLabelRequest, UpdateLabelRequest> {
  protected basePath = "/labels";

  // Override create pour ajouter l'ownerId automatiquement
  async create(data: CreateLabelRequest): Promise<Label> {
    try {
      // Récupérer l'utilisateur actuel
      const userDataStr = await AsyncStorage.getItem(StorageKeys.USER_DATA);
      if (!userDataStr) throw new Error("User not authenticated");

      const user: User = JSON.parse(userDataStr);

      // Ajouter l'ownerId
      const requestData = {
        ...data,
        ownerId: user.id,
        isPublic: data.isPublic ?? false,
      };

      const response = await axiosInstance.post(this.basePath, requestData);
      return handleApiResponse<Label>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Méthodes spécifiques aux labels
  async getMyLabels(includePublic: boolean = true): Promise<Label[]> {
    try {
      // Récupérer l'utilisateur actuel
      const userDataStr = await AsyncStorage.getItem(StorageKeys.USER_DATA);
      if (!userDataStr) throw new Error("User not authenticated");

      const user: User = JSON.parse(userDataStr);

      // Utiliser l'endpoint /labels/owner/:ownerId avec le paramètre getIsPublic
      const response = await axiosInstance.get(`${this.basePath}/owner/${user.id}`, {
        params: {
          getIsPublic: includePublic
        }
      });

      // La réponse peut avoir une structure paginée
      const result = handleApiResponse<{
        labels?: Label[];
        total?: number;
        totalPage?: number;
        page?: number;
        limit?: number;
      } | Label[]>(response);
      
      // Gérer les deux types de réponse possibles
      if (Array.isArray(result)) {
        return result;
      }
      return result.labels || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getPublicLabels(): Promise<Label[]> {
    try {
      const response = await axiosInstance.get(`${this.basePath}/public`);
      
      const result = handleApiResponse<{
        labels?: Label[];
        total?: number;
        totalPage?: number;
      } | Label[]>(response);
      
      if (Array.isArray(result)) {
        return result;
      }
      return result.labels || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async searchLabels(query: string): Promise<Label[]> {
    try {
      const response = await axiosInstance.get(`${this.basePath}/search`, {
        params: { q: query }
      });
      
      const result = handleApiResponse<Label[]>(response);
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const labelAPI = new LabelAPI();