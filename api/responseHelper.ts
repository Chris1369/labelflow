import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse, ApiError } from "@/types/api";

export const handleApiResponse = <T = any>(
  response: AxiosResponse<ApiResponse<T>>
): T => {
  // Si le status est 204 (No Content), on retourne un objet vide
  if (response.status === 204) {
    return {} as T;
  }
  
  // Si la réponse contient une propriété data
  if (response.data && response.data.data !== undefined) {
    return response.data.data;
  }
  
  // Si la réponse est directement l'objet (pas d'enveloppe)
  // et qu'elle n'a pas de propriété message (qui indiquerait une erreur)
  if (response.data && typeof response.data === 'object' && !('message' in response.data)) {
    return response.data as unknown as T;
  }

  throw new Error(response.data?.message || "Une erreur est survenue");
};

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    console.log("error", error);
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data?.message || "Une erreur est survenue",
        code: error.response.data?.code,
        statusCode: error.response.status,
        errors: error.response.data?.errors,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: "Impossible de contacter le serveur",
        code: "NETWORK_ERROR",
      };
    }
  }

  // Other errors
  return {
    message:
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue",
    code: "UNKNOWN_ERROR",
  };
};
