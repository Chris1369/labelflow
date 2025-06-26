import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ErrorLog {
  timestamp: string;
  type: "api" | "navigation" | "state" | "render" | "unknown";
  message: string;
  stack?: string;
  context?: any;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLogs: ErrorLog[] = [];
  private isProduction = !__DEV__;

  private constructor() {
    this.setupGlobalHandler();
    this.loadErrorLogs();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalHandler() {
    // Handle unhandled promise rejections
    const originalHandler = global.onunhandledrejection;
    global.onunhandledrejection = (event: any) => {
      this.logError({
        type: "unknown",
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
      });

      if (originalHandler) {
        originalHandler(event);
      }
    };

    // Override console.error to capture all errors
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      // Call original console.error
      originalConsoleError.apply(console, args);

      // Log the error
      const errorMessage = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg) : String(arg)
        )
        .join(" ");

      this.logError({
        type: "unknown",
        message: errorMessage,
        context: { consoleArgs: args },
      });
    };
  }

  private async loadErrorLogs() {
    try {
      const logs = await AsyncStorage.getItem("@bboxly:errorHandler");
      if (logs) {
        this.errorLogs = JSON.parse(logs);
      }
    } catch (e) {
      console.warn("Failed to load error logs:", e);
    }
  }

  private async saveErrorLogs() {
    try {
      // Keep only last 50 errors
      if (this.errorLogs.length > 50) {
        this.errorLogs = this.errorLogs.slice(-50);
      }
      await AsyncStorage.setItem(
        "@bboxly:errorHandler",
        JSON.stringify(this.errorLogs)
      );
    } catch (e) {
      console.warn("Failed to save error logs:", e);
    }
  }

  logError(error: Omit<ErrorLog, "timestamp">) {
    const errorLog: ErrorLog = {
      ...error,
      timestamp: new Date().toISOString(),
    };

    this.errorLogs.push(errorLog);
    this.saveErrorLogs();

    // In development, log to console
    if (!this.isProduction) {
      console.log("🚨 Error logged:", errorLog);
    }
  }

  handleApiError(error: any, endpoint?: string) {
    const message =
      error.response?.data?.message || error.message || "Erreur API inconnue";

    this.logError({
      type: "api",
      message,
      stack: error.stack,
      context: {
        endpoint,
        status: error.response?.status,
        data: error.response?.data,
      },
    });

    // Show user-friendly error
    if (!this.isProduction) {
      Alert.alert(
        "Erreur API",
        `${message}\n\nEndpoint: ${endpoint}\nStatus: ${error.response?.status}`,
        [{ text: "OK" }]
      );
    } else {
      Alert.alert("Erreur", "Une erreur s'est produite. Veuillez réessayer.");
    }
  }

  handleNavigationError(error: any, route?: string) {
    this.logError({
      type: "navigation",
      message: error.message || "Erreur de navigation",
      stack: error.stack,
      context: { route },
    });

    Alert.alert(
      "Erreur de navigation",
      "Impossible de naviguer vers cette page."
    );
  }

  handleStateError(error: any, storeName?: string) {
    this.logError({
      type: "state",
      message: error.message || "Erreur de state management",
      stack: error.stack,
      context: { storeName },
    });
  }

  handleRenderError(error: any, componentName?: string) {
    this.logError({
      type: "render",
      message: error.message || "Erreur de rendu",
      stack: error.stack,
      context: { componentName },
    });
  }

  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  clearErrorLogs() {
    this.errorLogs = [];
    AsyncStorage.removeItem("@bboxly:errorHandler").catch(() => {});
  }

  // Helper to wrap async functions with error handling
  wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    errorType: ErrorLog["type"] = "unknown",
    context?: any
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.logError({
          type: errorType,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          context,
        });
        throw error;
      }
    }) as T;
  }

  // Development helper to show error logs
  showErrorLogs() {
    if (!this.isProduction) {
      const logs = this.getErrorLogs();
      console.log("📋 Error Logs:", logs);
      Alert.alert(
        "Error Logs",
        `Total errors: ${logs.length}\n\nCheck console for details.`,
        [
          { text: "Clear Logs", onPress: () => this.clearErrorLogs() },
          { text: "OK" },
        ]
      );
    }
  }
}

export const errorHandler = ErrorHandler.getInstance();
