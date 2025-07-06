export const environment = process.env.APP_VARIANT || "development";
const IS_DEV = environment === "development";
const IS_STAGING = environment === "staging";
const IP = "172.20.10.6";

interface EnvironmentValues {
  name: string;
  icon: string;
  adaptiveIcon: string;
  package: string;
  BASE_URL: string;
  VERSION: string;
  PROJECT_NAME: string;
  PREDICTION_API_URL: string;
}

export function getEnvironmentValues(): EnvironmentValues {
  if (IS_DEV) {
    return {
      name: "Labelflow Dev",
      icon: "./assets/icon.png", // Using existing icon for now
      adaptiveIcon: "./assets/adaptive-icon.png", // Using existing adaptive icon
      package: "com.labelflow.dev",
      BASE_URL: `http://${IP}:3000/`,
      VERSION: "v1.0",
      PROJECT_NAME: "labelflow-api",
      PREDICTION_API_URL: `http://${IP}:8000`,
    };
  }
  if (IS_STAGING) {
    return {
      name: "Labelflow Staging",
      icon: "./assets/icon.png", // Using existing icon for now
      adaptiveIcon: "./assets/adaptive-icon.png", // Using existing adaptive icon
      package: "com.labelflow.staging",
      BASE_URL: "https://staging-api.labelflow.com/",
      VERSION: "v1.0",
      PROJECT_NAME: "labelflow-api",
      PREDICTION_API_URL: "https://staging-prediction.labelflow.com",
    };
  }
  // Production
  return {
    name: "Labelflow",
    icon: "./assets/icon.png",
    adaptiveIcon: "./assets/adaptive-icon.png",
    package: "com.labelflow.app",
    BASE_URL: "https://api.labelflow.com/",
    VERSION: "v1.0",
    PROJECT_NAME: "labelflow-api",
    PREDICTION_API_URL: "https://prediction.labelflow.com",
  };
}

export default {
  expo: {
    name: getEnvironmentValues().name,
    slug: "labelflow",
    version: "1.0.0",
    orientation: "portrait",
    icon: getEnvironmentValues().icon,
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "labelflow",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#FF7557",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: getEnvironmentValues().package,
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        NSCameraUsageDescription:
          "Cette app a besoin d'accéder à votre caméra pour capturer des images à labelliser.",
        NSPhotoLibraryUsageDescription:
          "Cette app a besoin d'accéder à votre galerie photo pour importer des images.",
      },
      statusBar: {
        barStyle: "dark-content",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: getEnvironmentValues().adaptiveIcon,
        backgroundColor: "#FF7557",
      },
      package: getEnvironmentValues().package,
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
      ],
      statusBar: {
        barStyle: "dark-content",
        backgroundColor: "transparent",
        translucent: true,
      },
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
    },
    updates: {
      enabled: !IS_DEV,
      fallbackToCacheTimeout: 30000,
    },
    assetBundlePatterns: ["**/*"],
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "1aebec92-8023-4824-abd7-7bf26725af78", // TODO: Replace with actual EAS project ID
      },
      environment: environment,
      apiUrl: getEnvironmentValues().BASE_URL,
      version: getEnvironmentValues().VERSION,
      projectName: getEnvironmentValues().PROJECT_NAME,
      predictionApiUrl: getEnvironmentValues().PREDICTION_API_URL,
    },
    plugins: [
      "expo-font",
      "expo-router",
      "expo-camera",
      "expo-image-picker",
      "expo-document-picker",
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "15.1",
          },
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            minSdkVersion: 21,
          },
        },
      ],
    ],
    owner: "chriskakashi",
  },
};
