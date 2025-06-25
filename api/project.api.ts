import { BaseAPI } from "./baseAPI";
import axiosInstance from "./axiosInstance";
import { handleApiResponse, handleApiError } from "./responseHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/helpers/StorageKeys";
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/types/project";
import { User } from "@/types/auth";

class ProjectAPI extends BaseAPI<
  Project,
  CreateProjectRequest,
  UpdateProjectRequest
> {
  protected basePath = "/projects";

  // Override create pour ajouter l'ownerId automatiquement
  async create(data: CreateProjectRequest): Promise<Project> {
    try {
      // Récupérer l'utilisateur actuel
      const userDataStr = await AsyncStorage.getItem(StorageKeys.USER_DATA);
      if (!userDataStr) throw new Error("User not authenticated");
      
      const user: User = JSON.parse(userDataStr);
      
      // Ajouter l'ownerId et isPublic par défaut
      const requestData = {
        ...data,
        ownerId: user.id,
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
  async getMyProjects(): Promise<Project[]> {
    try {
      // Récupérer l'utilisateur actuel
      const userDataStr = await AsyncStorage.getItem(StorageKeys.USER_DATA);
      if (!userDataStr) throw new Error("User not authenticated");
      
      const user: User = JSON.parse(userDataStr);
      
      // Utiliser l'endpoint spécifique /projects/owner/:ownerId
      const response = await axiosInstance.get(`${this.basePath}/owner/${user.id}`);
      
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
}

export const projectAPI = new ProjectAPI();