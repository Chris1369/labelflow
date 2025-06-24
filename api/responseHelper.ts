import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '@/types/api';

export const handleApiResponse = <T = any>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  
  throw new Error(response.data.message || 'Une erreur est survenue');
};

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data?.message || 'Une erreur est survenue',
        code: error.response.data?.code,
        statusCode: error.response.status,
        errors: error.response.data?.errors,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Impossible de contacter le serveur',
        code: 'NETWORK_ERROR',
      };
    }
  }
  
  // Other errors
  return {
    message: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
    code: 'UNKNOWN_ERROR',
  };
};