export const environment = process.env.APP_VARIANT || "development";
const IS_DEV = environment === "development";
const IS_STAGING = environment === "staging";
const IP = "192.168.1.33";

interface EnvironmentValues {
  name: string;
  icon: string;
  adaptiveIcon: string;
  package: string;
  BASE_URL: string;
  VERSION: string;
  PROJECT_NAME: string;
}

export function getEnvironmentValues(): EnvironmentValues {
  if (IS_DEV) {
    return {
      name: "BBoxly Dev",
      icon: "./assets/icon.png", // Using existing icon for now
      adaptiveIcon: "./assets/adaptive-icon.png", // Using existing adaptive icon
      package: "com.bboxly.dev",
      BASE_URL: `http://${IP}:3000/`,
      VERSION: "v1.0",
      PROJECT_NAME: "bboxly-api",
    };
  }
  if (IS_STAGING) {
    return {
      name: "BBoxly Staging",
      icon: "./assets/icon.png", // Using existing icon for now
      adaptiveIcon: "./assets/adaptive-icon.png", // Using existing adaptive icon
      package: "com.bboxly.staging",
      BASE_URL: "https://staging-api.bboxly.com/",
      VERSION: "v1.0",
      PROJECT_NAME: "bboxly-api",
    };
  }
  // Production
  return {
    name: "BBoxly",
    icon: "./assets/icon.png",
    adaptiveIcon: "./assets/adaptive-icon.png",
    package: "com.bboxly.app",
    BASE_URL: "https://api.bboxly.com/",
    VERSION: "v1.0",
    PROJECT_NAME: "bboxly-api",
  };
}

export default {
  expo: {
    name: getEnvironmentValues().name,
    slug: "bboxly",
    version: "1.0.0",
    orientation: "portrait",
    icon: getEnvironmentValues().icon,
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "bboxly",
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
          "Cette app a besoin d'acc�der � votre cam�ra pour capturer des images � labelliser.",
        NSPhotoLibraryUsageDescription:
          "Cette app a besoin d'acc�der � votre galerie photo pour importer des images.",
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
      edgeToEdgeEnabled: true,
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
