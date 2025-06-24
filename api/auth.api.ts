import axiosInstance from "./axiosInstance";
import { handleApiResponse, handleApiError } from "./responseHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/helpers/StorageKeys";
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOTPRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from "@/types/auth";

class AuthAPI {
  private readonly basePath = "/auth";

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(`${this.basePath}/login`, data);
      // console.log('response', JSON.stringify(response.data, null, 2))
      const authData = handleApiResponse<AuthResponse>(response);

      // Store tokens and user data
      await AsyncStorage.multiSet([
        [StorageKeys.ACCESS_TOKEN, authData.tokens.accessToken],
        [StorageKeys.REFRESH_TOKEN, authData.tokens.refreshToken],
        [StorageKeys.USER_DATA, JSON.stringify(authData.user)],
      ]);

      return authData;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.basePath}/register`,
        data
      );
      const authData = handleApiResponse<AuthResponse>(response);

      // Store tokens and user data
      await AsyncStorage.multiSet([
        [StorageKeys.ACCESS_TOKEN, authData.tokens.accessToken],
        [StorageKeys.REFRESH_TOKEN, authData.tokens.refreshToken],
        [StorageKeys.USER_DATA, JSON.stringify(authData.user)],
      ]);

      return authData;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      const response = await axiosInstance.post(
        `${this.basePath}/forgot-password`,
        data
      );
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    console.log("resetPassword", data);
    try {
      const response = await axiosInstance.post(
        `${this.basePath}/reset-password`,
        data
      );
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<void> {
    try {
      const response = await axiosInstance.post(
        `${this.basePath}/verify-otp`,
        data
      );
      handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const response = await axiosInstance.post(
        `${this.basePath}/refresh`,
        data
      );
      return handleApiResponse<RefreshTokenResponse>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(`${this.basePath}/logout`);
    } catch (error) {
      // Even if logout fails on server, clear local data
    } finally {
      await AsyncStorage.multiRemove([
        StorageKeys.ACCESS_TOKEN,
        StorageKeys.REFRESH_TOKEN,
        StorageKeys.USER_DATA,
      ]);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosInstance.get(`${this.basePath}/me`);
      return handleApiResponse<User>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await axiosInstance.put(
        `${this.basePath}/profile`,
        data
      );
      const user = handleApiResponse<User>(response);

      // Update stored user data
      await AsyncStorage.setItem(StorageKeys.USER_DATA, JSON.stringify(user));

      return user;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const authAPI = new AuthAPI();
