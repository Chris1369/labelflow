import Constants from 'expo-constants';

interface EnvironmentConfig {
  apiUrl: string;
  environment: string;
  version: string;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    apiUrl: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/',
    environment: Constants.expoConfig?.extra?.environment || 'development',
    version: Constants.expoConfig?.extra?.version || 'v1.0',
  };
};

export const isDevelopment = () => {
  const { environment } = getEnvironmentConfig();
  return environment === 'development';
};

export const isStaging = () => {
  const { environment } = getEnvironmentConfig();
  return environment === 'staging';
};

export const isProduction = () => {
  const { environment } = getEnvironmentConfig();
  return environment === 'production';
};