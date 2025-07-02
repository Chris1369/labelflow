import { BaseAPI } from "./baseAPI";
import axiosInstance from "./axiosInstance";
import { handleApiResponse, handleApiError } from "./responseHelper";
import { getCurrentUserId } from "@/helpers/getCurrentUser";
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/types/project";

class ProjectAPI extends BaseAPI<
  Project,
  CreateProjectRequest,
  UpdateProjectRequest
> {
  protected basePath = "/projects";

  // Override create pour ajouter l'ownerId automatiquement
  async create(data: CreateProjectRequest): Promise<Project> {
    try {
      // Récupérer l'ID de l'utilisateur actuel
      const userId = await getCurrentUserId();
      
      // Ajouter l'ownerId et isPublic par défaut
      const requestData = {
        ...data,
        ownerId: userId,
        isPublic: data.isPublic ?? false, // false par défaut
        items: [] // Initialiser avec un tableau vide
      };
      
      const response = await axiosInstance.post(this.basePath, requestData);
      return handleApiResponse<Project>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Méthodes spécifiques aux projets
  async getMyProjects({includePublic, onlyOwnerProjects, searchQuery}: {includePublic: boolean, onlyOwnerProjects?: boolean, searchQuery?: string}): Promise<Project[]> {
    try {
      // Récupérer l'ID de l'utilisateur actuel
      const userId = await getCurrentUserId();
      
      // Utiliser l'endpoint spécifique /projects/owner/:ownerId avec getIsPublic
      const response = await axiosInstance.get(`${this.basePath}/owner/${userId}`, {
        params: {
          getIsPublic: includePublic,
          onlyOwnerProjects: onlyOwnerProjects,
          ...(searchQuery && { search: searchQuery, limit: 50 }), 
        }
      });
      
      // La réponse a une structure paginée avec projects array
      const result = handleApiResponse<{
        projects: Project[];
        total: number;
        totalPage: number;
        page: number;
        limit: number;
      }>(response);
      
      // Retourner le tableau de projets
      return result.projects || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }
  
  async getProjectsByOwnerId(ownerId: string): Promise<Project[]> {
    try {
      // Utiliser l'endpoint spécifique /projects/owner/:ownerId
      const response = await axiosInstance.get(`${this.basePath}/owner/${ownerId}`);
      
      // La réponse a une structure paginée avec projects array
      const result = handleApiResponse<{
        projects: Project[];
        total: number;
        totalPage: number;
        page: number;
        limit: number;
      }>(response);
      
      // Retourner le tableau de projets
      return result.projects || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async addItemToProject(projectId: string, itemId: string): Promise<Project> {
    try {
      const project = await this.getOne(projectId);
      const updatedItems = [...project.items, itemId];
      return await this.update(projectId, { items: updatedItems });
    } catch (error) {
      throw error;
    }
  }

  async removeItemFromProject(
    projectId: string,
    itemId: string
  ): Promise<Project> {
    try {
      const project = await this.getOne(projectId);
      const updatedItems = project.items.filter((id) => id !== itemId);
      return await this.update(projectId, { items: updatedItems });
    } catch (error) {
      throw error;
    }
  }

  async resetProject(projectId: string): Promise<Project> {
    try {
      return await this.update(projectId, { items: [] });
    } catch (error) {
      throw error;
    }
  }

  async searchProjects({query, includePublic}: {query: string, includePublic: boolean}): Promise<Project[]> {
    try {
      const response = await axiosInstance.get(this.basePath, {
        params: {
          search: query,
          getIsPublic: includePublic,
          limit: 50, // Limit results for performance
        },
      });

      const result = handleApiResponse<
        | {
            projects?: Project[];
            total?: number;
            totalPage?: number;
            page?: number;
            limit?: number;
          }
        | Project[]
      >(response);
      if (Array.isArray(result)) {
        return result;
      }
      return result.projects || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const projectAPI = new ProjectAPI();