import { BaseAPI } from "./baseAPI";
import axiosInstance from "./axiosInstance";
import { handleApiResponse, handleApiError } from "./responseHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/helpers/StorageKeys";
import {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamMember,
} from "@/types/team";
import { User } from "@/types/auth";
import { Project } from "@/types/project";
import { AxiosError } from "axios";

class TeamAPI extends BaseAPI<Team, CreateTeamRequest, UpdateTeamRequest> {
  protected basePath = "/teams";

  // Override create pour ajouter l'owner automatiquement
  async create(data: CreateTeamRequest): Promise<Team> {
    try {
      // Récupérer l'utilisateur actuel
      const userDataStr = await AsyncStorage.getItem(StorageKeys.USER_DATA);
      if (!userDataStr) throw new Error("User not authenticated");

      const user: User = JSON.parse(userDataStr);

      // Ajouter l'ownerId et initialiser les tableaux vides
      const requestData = {
        ...data,
        ownerId: user.id,
        projectId: data.projectId || [],
        members: data.members || [user.id], // Ajouter automatiquement le créateur comme membre
      };

      const response = await axiosInstance.post(this.basePath, requestData);
      return handleApiResponse<Team>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Méthodes spécifiques aux teams
  async getMyTeams(): Promise<Team[]> {
    try {
      // Récupérer l'utilisateur actuel
      const userDataStr = await AsyncStorage.getItem(StorageKeys.USER_DATA);
      if (!userDataStr) throw new Error("User not authenticated");

      const user: User = JSON.parse(userDataStr);

      // Utiliser l'endpoint /teams/owner/:ownerId
      const response = await axiosInstance.get(
        `${this.basePath}/owner/${user.id}`
      );

      // La réponse peut avoir une structure paginée similaire aux projects
      const result = handleApiResponse<
        | {
            teams?: Team[];
            total?: number;
            totalPage?: number;
            page?: number;
            limit?: number;
          }
        | Team[]
      >(response);

      // Gérer les deux types de réponse possibles
      if (Array.isArray(result)) {
        return result;
      }
      return result.teams || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTeamsByOwnerId(ownerId: string): Promise<Team[]> {
    try {
      const response = await axiosInstance.get(
        `${this.basePath}/owner/${ownerId}`
      );

      // La réponse peut avoir une structure paginée similaire aux projects
      const result = handleApiResponse<
        | {
            teams?: Team[];
            total?: number;
            totalPage?: number;
            page?: number;
            limit?: number;
          }
        | Team[]
      >(response);

      // Gérer les deux types de réponse possibles
      if (Array.isArray(result)) {
        return result;
      }
      return result.teams || [];
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const response = await axiosInstance.get(
        `${this.basePath}/${teamId}/members`
      );
      return handleApiResponse<TeamMember[]>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async addMember(teamId: string, email: string): Promise<Team> {
    try {
      const response = await axiosInstance.post(
        `${this.basePath}/${teamId}/add-member`,
        { email }
      );
      return handleApiResponse<Team>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async removeMember(teamId: string, memberId: string): Promise<Team> {
    try {
      const response = await axiosInstance.delete(
        `${this.basePath}/${teamId}/members/${memberId}`
      );
      return handleApiResponse<Team>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTeamProjects(teamId: string): Promise<Project[]> {
    try {
      console.log("Getting projects for team:", teamId);
      const response = await axiosInstance.get(
        `${this.basePath}/${teamId}/projects`
      );
      console.log("Team projects response:", response.data);

      // Gérer différentes structures de réponse possibles
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.projects)) {
        return response.data.projects;
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      }

      // Si aucune structure connue, retourner un tableau vide
      console.warn(
        "Unexpected response structure for team projects:",
        response.data
      );
      return [];
    } catch (error) {
      console.error("Error in getTeamProjects:", error);
      // En cas d'erreur 404, retourner un tableau vide plutôt qu'une erreur
      if (error instanceof AxiosError && error.response?.status === 404) {
        return [];
      }
      throw handleApiError(error);
    }
  }

  async addProject(teamId: string, projectId: string): Promise<Team> {
    try {
      const response = await axiosInstance.post(
        `${this.basePath}/${teamId}/projects/${projectId}`
      );
      return handleApiResponse<Team>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async removeProject(teamId: string, projectId: string): Promise<Team> {
    try {
      const response = await axiosInstance.delete(
        `${this.basePath}/${teamId}/projects/${projectId}`
      );
      return handleApiResponse<Team>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async inviteMembers(teamId: string, emails: string[]): Promise<void> {
    try {
      const response = await axiosInstance.post(
        `${this.basePath}/${teamId}/invite`,
        { emails }
      );
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const teamAPI = new TeamAPI();
