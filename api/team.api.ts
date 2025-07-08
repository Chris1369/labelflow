import { BaseAPI } from "./baseAPI";
import axiosInstance from "./axiosInstance";
import { handleApiResponse, handleApiError } from "./responseHelper";
import { getCurrentUserId } from "@/helpers/getCurrentUser";
import {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  TeamMember,
} from "@/types/team";
import { Project } from "@/types/project";
import { AxiosError } from "axios";

class TeamAPI extends BaseAPI<Team, CreateTeamRequest, UpdateTeamRequest> {
  protected basePath = "/teams";

  // Override create pour ajouter l'owner automatiquement
  async create(data: CreateTeamRequest): Promise<Team> {
    try {
      // Récupérer l'ID de l'utilisateur actuel
      const userId = await getCurrentUserId();

      // Ajouter l'ownerId et initialiser les tableaux vides
      const requestData = {
        ...data,
        ownerId: userId,
        projectId: data.projectId || [],
        members: data.members || [userId], // Ajouter automatiquement le créateur comme membre
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
      // Récupérer l'ID de l'utilisateur actuel
      const userId = await getCurrentUserId();

      // Utiliser l'endpoint /teams/owner/:ownerId
      const response = await axiosInstance.get(
        `${this.basePath}/owner/${userId}`
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


  async searchMyTeam({query}: {query: string}): Promise<Team[]> {
    try {
      // Récupérer l'ID de l'utilisateur actuel
      const userId = await getCurrentUserId();

      // Utiliser l'endpoint /teams/owner/:ownerId
      const response = await axiosInstance.get(
        `${this.basePath}/owner/${userId}`,
        {
          params:{
            search: query
          }
        }
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
      const response = await axiosInstance.get(
        `${this.basePath}/${teamId}/projects`
      );
        // Si aucune structure connue, retourner un tableau vide
        console.warn(
          "Unexpected response structure for team projects:",
          response.data
        );
      const result = handleApiResponse<{
        projects: Project[];
        total: number;
        totalPage: number;
        page: number;
        limit: number;
      }>(response);
      
      // Retourner le tableau de projets
      return result.projects;
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

  async updateProjects(
    teamId: string,
    action: "add" | "remove",
    projectIds: string[]
  ): Promise<Team> {
    try {
      const response = await axiosInstance.put(
        `${this.basePath}/${teamId}/update-projects`,
        {
          action,
          projectIds,
        }
      );
      return handleApiResponse<Team>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const teamAPI = new TeamAPI();
