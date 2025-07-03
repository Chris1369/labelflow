import axiosInstance from "./axiosInstance";
import { handleApiResponse, handleApiError } from "./responseHelper";

class UnlabeledListAPI {
  private basePath = "/unlabeled-lists";

  /**
   * Create a new unlabeled list with images
   * @param formData - FormData with name, projectId, and files
   */
  async create(formData: FormData): Promise<any> {
    try {
      const response = await axiosInstance.post(this.basePath, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error, `${this.basePath} - create`);
    }
  }

  /**
   * Get all unlabeled lists
   */
  async getAll(): Promise<any[]> {
    try {
      const response = await axiosInstance.get(this.basePath);
      return handleApiResponse<any[]>(response);
    } catch (error) {
      throw handleApiError(error, `${this.basePath} - getAll`);
    }
  }

  /**
   * Get unlabeled lists by project ID
   * @param projectId - The project ID
   */
  async getByProjectId(projectId: string): Promise<any[]> {
    try {
      const response = await axiosInstance.get(
        `${this.basePath}/project/${projectId}`
      );
      return handleApiResponse<any[]>(response);
    } catch (error) {
      throw handleApiError(error, `${this.basePath} - getByProjectId`);
    }
  }

  /**
   * Get a single unlabeled list by ID
   * @param id - The list ID
   */
  async getById(id: string): Promise<any> {
    try {
      const response = await axiosInstance.get(`${this.basePath}/${id}`);
      return handleApiResponse<any>(response);
    } catch (error) {
      throw handleApiError(error, `${this.basePath} - getById`);
    }
  }

  /**
   * Add images to an existing unlabeled list
   * @param listId - The list ID
   * @param formData - FormData with files
   */
  async addImages(listId: string, formData: FormData): Promise<any> {

    try {
      const response = await axiosInstance.put(`${this.basePath}/${listId}/add-images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error, `${this.basePath} - create`);
    }
  }

  /**
   * Validate an item in the unlabeled list
   * @param listId - The list ID
   * @param itemId - The item ID
   * @param data - Object with projectId and labels
   */
  async validateItem(
    listId: string,
    itemId: string,
    data: {
      projectId: string;
      labels: Array<{ name: string; position: number[] }>;
      objectItemTrainingId: string;
    }
  ): Promise<{ projectItem: any; message: string }> {
    try {
      const response = await axiosInstance.post(
        `${this.basePath}/${listId}/items/${itemId}/validate`,
        data
      );
      return handleApiResponse<{ projectItem: any; message: string }>(response);
    } catch (error) {
      throw handleApiError(error, `${this.basePath} - validateItem`);
    }
  }

  /**
   * Update an unlabeled list
   * @param id - The list ID
   * @param data - Object with name to update
   */
  async update(id: string, data: { name: string }): Promise<any> {
    try {
      const response = await axiosInstance.put(`${this.basePath}/${id}`, data);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error, `${this.basePath} - update`);
    }
  }

  /**
   * Delete an unlabeled list
   * @param id - The list ID
   */
  async delete(id: string): Promise<void> {
    try {
      const response = await axiosInstance.delete(`${this.basePath}/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error, `${this.basePath} - delete`);
    }
  }
}

export const unlabeledListAPI = new UnlabeledListAPI();
