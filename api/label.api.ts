import { BaseAPI } from "./baseAPI";
import axiosInstance from "./axiosInstance";
import { handleApiResponse, handleApiError } from "./responseHelper";
import { Label, CreateLabelRequest, UpdateLabelRequest } from "@/types/label";
import { getCurrentUserId } from "@/helpers/getCurrentUser";

class LabelAPI extends BaseAPI<Label, CreateLabelRequest, UpdateLabelRequest> {
  protected basePath = "/labels";

  // Override create pour ajouter l'ownerId automatiquement
  async create(data: CreateLabelRequest): Promise<Label> {
    try {
      // Récupérer l'ID de l'utilisateur actuel
      const userId = await getCurrentUserId();

      // Ajouter l'ownerId
      const requestData = {
        ...data,
        ownerId: userId,
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
      // Récupérer l'ID de l'utilisateur actuel
      const userId = await getCurrentUserId();

      // Utiliser l'endpoint /labels/owner/:ownerId avec le paramètre getIsPublic
      const response = await axiosInstance.get(
        `${this.basePath}/owner/${userId}`,
        {
          params: {
            getIsPublic: includePublic,
          },
        }
      );

      // La réponse peut avoir une structure paginée
      const result = handleApiResponse<any>(response);
      
      console.log('getMyLabels response structure:', result);

      // Gérer les deux types de réponse possibles
      if (Array.isArray(result)) {
        return result;
      }
      
      // Check for different possible response structures
      if (result.labels && Array.isArray(result.labels)) {
        return result.labels;
      }
      
      if (result.projects && Array.isArray(result.projects)) {
        console.warn('API returned projects instead of labels for labels endpoint');
        return result.projects;
      }
      
      if (result.data && Array.isArray(result.data)) {
        return result.data;
      }
      
      console.error('Unexpected response structure for labels:', result);
      return [];
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getPublicLabels(): Promise<Label[]> {
    try {
      // Use the general /labels endpoint with getIsPublic parameter
      const response = await axiosInstance.get(this.basePath, {
        params: {
          getIsPublic: true,
          limit: 100, // Get more public labels
        },
      });

      const result = handleApiResponse<
        | {
            labels?: Label[];
            projects?: Label[]; // Backend might return 'projects' key
            total?: number;
            totalPage?: number;
          }
        | Label[]
      >(response);

      if (Array.isArray(result)) {
        return result;
      }
      // Check both 'labels' and 'projects' keys as backend might return either
      return result.labels || result.projects || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async searchLabels(query: string): Promise<Label[]> {
    try {
      const response = await axiosInstance.get(this.basePath, {
        params: {
          search: query,
          limit: 50, // Limit results for performance
        },
      });

      const result = handleApiResponse<
        | {
            labels?: Label[];
            projects?: Label[]; // Backend might return 'projects' key
            total?: number;
            totalPage?: number;
            page?: number;
            limit?: number;
          }
        | Label[]
      >(response);
      if (Array.isArray(result)) {
        return result;
      }
      // Check both 'labels' and 'projects' keys as backend might return either
      return result.labels || result.projects || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const labelAPI = new LabelAPI();
