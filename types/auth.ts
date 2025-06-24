export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface VerifyOTPRequest {
  email: string;
  code: string;
}

export enum AuthAccessType {
  ADMIN = "admin",
  USER = "user",
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: AuthAccessType;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SignInForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  name: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export enum AuthProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
}