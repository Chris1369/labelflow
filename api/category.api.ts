import { BaseAPI } from "./baseAPI";
import axiosInstance from "./axiosInstance";
import { handleApiResponse, handleApiError } from "./responseHelper";
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";
import { getCurrentUserId } from "@/helpers/getCurrentUser";
import { Label } from "@/types/label";

class CategoryAPI extends BaseAPI<Category, CreateCategoryRequest, UpdateCategoryRequest> {
  protected basePath = "/categories";

  // Override create pour ajouter l'ownerId automatiquement
  async create(data: CreateCategoryRequest): Promise<Category> {
    try {
      // Récupérer l'ID de l'utilisateur actuel
      const userId = await getCurrentUserId();

      // Ajouter l'ownerId et initialiser les tableaux
      const requestData = {
        ...data,
        ownerId: userId,
        labels: data.labels || [],
        isPublic: data.isPublic ?? false,
      };

      const response = await axiosInstance.post(this.basePath, requestData);
      return handleApiResponse<Category>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Méthodes spécifiques aux catégories
  async getMyCategories(includePublic: boolean = true): Promise<Category[]> {
    try {
      // Récupérer l'ID de l'utilisateur actuel
      const userId = await getCurrentUserId();

      // Utiliser l'endpoint /categories/owner/:ownerId avec le paramètre getIsPublic
      const response = await axiosInstance.get(`${this.basePath}/owner/${userId}`, {
        params: {
          getIsPublic: includePublic
        }
      });

      // La réponse peut avoir une structure paginée
      const result = handleApiResponse<{
        categories?: Category[];
        total?: number;
        totalPage?: number;
        page?: number;
        limit?: number;
      } | Category[]>(response);
      
      // Gérer les deux types de réponse possibles
      if (Array.isArray(result)) {
        return result;
      }
      return result.categories || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }


  async getPublicCategories(): Promise<Category[]> {
    try {
      const response = await axiosInstance.get(`${this.basePath}/public`);
      
      const result = handleApiResponse<{
        categories?: Category[];
        total?: number;
        totalPage?: number;
      } | Category[]>(response);
      
      if (Array.isArray(result)) {
        return result;
      }
      return result.categories || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getCategoryLabels(categoryId: string): Promise<Label[]> {
    try {
      const response = await axiosInstance.get(`${this.basePath}/${categoryId}/labels`);
      return handleApiResponse<Label[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async addLabel(categoryId: string, labelId: string): Promise<Category> {
    try {
      const response = await axiosInstance.put(
        `${this.basePath}/${categoryId}/labels/${labelId}`
      );
      return handleApiResponse<Category>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async removeLabel(categoryId: string, labelId: string): Promise<Category> {
    try {
      const response = await axiosInstance.delete(
        `${this.basePath}/${categoryId}/labels/${labelId}`
      );
      return handleApiResponse<Category>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async searchCategories(query: string): Promise<Category[]> {
    try {
      const response = await axiosInstance.get(this.basePath, {
        params: {
          search: query,
          limit: 50, // Limit results for performance
        },
      });

      const result = handleApiResponse<
        | {
            categories?: Category[];
            total?: number;
            totalPage?: number;
            page?: number;
            limit?: number;
          }
        | Category[]
      >(response);
      if (Array.isArray(result)) {
        return result;
      }
      return result.categories || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const categoryAPI = new CategoryAPI();