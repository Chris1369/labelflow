import axiosInstance from './axiosInstance';
import { handleApiResponse, handleApiError } from './responseHelper';
import { QueryParams, PaginatedResponse } from '@/types/api';

export abstract class BaseAPI<T, CreateDTO = any, UpdateDTO = any> {
  protected abstract basePath: string;

  async create(data: CreateDTO): Promise<T> {
    try {
      const response = await axiosInstance.post(this.basePath, data);
      return handleApiResponse<T>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getAll(params?: QueryParams): Promise<T[] | PaginatedResponse<T>> {
    try {
      const response = await axiosInstance.get(this.basePath, { params });
      return handleApiResponse<T[] | PaginatedResponse<T>>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
  
  async getAllFiltered(filters: Record<string, any>, params?: QueryParams): Promise<T[] | PaginatedResponse<T>> {
    try {
      const response = await axiosInstance.get(this.basePath, { 
        params: { ...filters, ...params } 
      });
      return handleApiResponse<T[] | PaginatedResponse<T>>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getOne(id: string): Promise<T> {
    try {
      const response = await axiosInstance.get(`${this.basePath}/${id}`);
      return handleApiResponse<T>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
    try {
      const response = await axiosInstance.put(`${this.basePath}/${id}`, data);
      return handleApiResponse<T>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await axiosInstance.delete(`${this.basePath}/${id}`);
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}