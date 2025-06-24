import { BaseAPI } from "./baseAPI";
import axiosInstance from "./axiosInstance";
import { handleApiResponse, handleApiError } from "./responseHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/helpers/StorageKeys";
import {
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  AddMemberRequest,
  TeamMember,
} from "@/types/team";
import { User } from "@/types/auth";

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
      const response = await axiosInstance.get(`${this.basePath}/owner/${user.id}`);

      // La réponse peut avoir une structure paginée similaire aux projects
      const result = handleApiResponse<{
        teams?: Team[];
        total?: number;
        totalPage?: number;
        page?: number;
        limit?: number;
      } | Team[]>(response);
      
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
      const result = handleApiResponse<{
        teams?: Team[];
        total?: number;
        totalPage?: number;
        page?: number;
        limit?: number;
      } | Team[]>(response);
      
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

  async addMember(teamId: string, data: AddMemberRequest): Promise<Team> {
    try {
      const response = await axiosInstance.post(
        `${this.basePath}/${teamId}/members`,
        data
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