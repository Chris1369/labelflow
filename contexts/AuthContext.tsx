import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '@/helpers/StorageKeys';
import { User, AuthAccessType } from '@/types/auth';
import { authAPI } from '@/api/auth.api';
import { router } from 'expo-router';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: AuthAccessType) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [token, userData] = await AsyncStorage.multiGet([
        StorageKeys.ACCESS_TOKEN,
        StorageKeys.USER_DATA,
      ]);

      if (token[1] && userData[1]) {
        setUser(JSON.parse(userData[1]));
        // Optionally refresh user data from server
        await refreshUser();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.user);
      router.replace('/(main)/home');
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register({ email, password, name });
      setUser(response.user);
      router.replace('/(main)/home');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear local data
      setUser(null);
      router.replace('/(auth)/signin');
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      await AsyncStorage.setItem(StorageKeys.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const hasRole = (role: AuthAccessType): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};