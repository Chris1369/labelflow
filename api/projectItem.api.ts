import { BaseAPI } from "./baseAPI";
import axiosInstance from "./axiosInstance";
import { handleApiResponse, handleApiError } from "./responseHelper";
import {
  ProjectItem,
  CreateProjectItemRequest,
  UpdateProjectItemRequest,
  ProjectItemsResponse,
} from "@/types/project";
import { QueryParams, PaginatedResponse } from "@/types/api";

class ProjectItemAPI extends BaseAPI<
  ProjectItem,
  CreateProjectItemRequest,
  UpdateProjectItemRequest
> {
  protected basePath = "/project-items";

  // Les méthodes CRUD standard sont héritées de BaseAPI:
  // - create(data: CreateProjectItemRequest): Promise<ProjectItem>
  // - getAll(params?: QueryParams): Promise<PaginatedResponse<ProjectItem>>
  // - getOne(id: string): Promise<ProjectItem>
  // - update(id: string, data: UpdateProjectItemRequest): Promise<ProjectItem>
  // - delete(id: string): Promise<void>

  // Méthodes spécifiques aux items
  async getProjectItems(
    projectId: string,
    params?: QueryParams
  ): Promise<ProjectItemsResponse> {
    try {
      const response = await axiosInstance.get(
        `${this.basePath}/project/${projectId}`,
        { params }
      );
      return handleApiResponse<ProjectItemsResponse>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async addProjectItems(formData: FormData): Promise<void> {
    try {
      const response = await axiosInstance.post(`${this.basePath}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error, `${this.basePath} - addProjectItems`);
    }
  }

  async uploadImage(projectId: string, formData: FormData): Promise<string> {
    try {
      const response = await axiosInstance.post(
        `${this.basePath}/upload/${projectId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return handleApiResponse<string>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async bulkCreate(items: CreateProjectItemRequest[]): Promise<ProjectItem[]> {
    try {
      const response = await axiosInstance.post(`${this.basePath}/bulk`, {
        items,
      });
      return handleApiResponse<ProjectItem[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async bulkDelete(itemIds: string[]): Promise<void> {
    try {
      const response = await axiosInstance.delete(`${this.basePath}/bulk`, {
        data: { itemIds },
      });
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async exportProjectItems(
    projectId: string,
    format: "csv" | "xml" | "json"
  ): Promise<Blob> {
    try {
      const response = await axiosInstance.get(
        `${this.basePath}/export/${projectId}`,
        {
          params: { format },
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const projectItemAPI = new ProjectItemAPI();