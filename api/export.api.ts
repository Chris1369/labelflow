import { AxiosResponse } from "axios";
import { BaseAPI } from "./baseAPI";
import { CreateExportRequest, CreateExportResponse, Export } from "@/types/export";
import { handleApiResponse } from "./responseHelper";
import axiosInstance from "./axiosInstance";

class ExportAPI extends BaseAPI<Export> {
  protected basePath = "/exports";

  /**
   * Create a new export
   */
  async createExport(data: CreateExportRequest): Promise<CreateExportResponse> {
    try {
      const response: AxiosResponse<CreateExportResponse> = await axiosInstance.post(
        this.basePath,
        data
      );
      return handleApiResponse(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get export by ID
   */
  async getExport(exportId: string): Promise<Export> {
    try {
      const response: AxiosResponse<{ success: boolean; data: Export }> = 
        await axiosInstance.get(`${this.basePath}/${exportId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get exports by project
   */
  async getExportsByProject(projectId: string): Promise<Export[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: Export[] }> = 
        await axiosInstance.get(`${this.basePath}/project/${projectId}`);
      return handleApiResponse(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download export file
   */
  async downloadExport(exportId: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await axiosInstance.get(
        `${this.basePath}/${exportId}/download`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const exportAPI = new ExportAPI();