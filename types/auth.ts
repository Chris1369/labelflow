export interface SignInForm {
  email: string;
  password: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface OTPForm {
  code: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface OTPSession {
  email: string;
  expiresAt: Date;
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  APPLE = 'apple',
}