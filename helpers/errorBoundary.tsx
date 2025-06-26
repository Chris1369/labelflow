import React, { Component, ReactNode, ErrorInfo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { theme } from "@/types/theme";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Save error details to AsyncStorage for debugging
    this.saveErrorLog(error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1,
    });
  }

  saveErrorLog = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      };

      // Get existing logs
      const existingLogs = await AsyncStorage.getItem("@bboxly:errorLogs");
      const logs = existingLogs ? JSON.parse(existingLogs) : [];

      // Add new log (keep only last 10 errors)
      logs.unshift(errorLog);
      if (logs.length > 10) {
        logs.pop();
      }

      await AsyncStorage.setItem("@bboxly:errorLogs", JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to save error log:", e);
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      Alert.alert("Erreur", "Impossible de recharger l'application");
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.title}>Oops! Une erreur s'est produite</Text>
            <Text style={styles.subtitle}>
              L'application a rencontré une erreur inattendue.
            </Text>

            <View style={styles.errorDetails}>
              <Text style={styles.errorTitle}>Détails de l'erreur:</Text>
              <View style={styles.errorBox}>
                <Text style={styles.errorMessage}>
                  {this.state.error && this.state.error.toString()}
                </Text>
              </View>

              {__DEV__ && this.state.errorInfo && (
                <View style={styles.stackTrace}>
                  <Text style={styles.stackTitle}>Stack trace:</Text>
                  <ScrollView style={styles.stackScroll}>
                    <Text style={styles.stackText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleReset}
              >
                <Text style={styles.buttonText}>Réessayer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={this.handleReload}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Recharger l'app
                </Text>
              </TouchableOpacity>
            </View>

            {__DEV__ && (
              <Text style={styles.devNote}>
                Mode développement: Les détails de l'erreur sont affichés
              </Text>
            )}
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingTop: 60,
  },
  title: {
    ...theme.fonts.title,
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  errorDetails: {
    marginBottom: theme.spacing.xl,
  },
  errorTitle: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  errorBox: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  errorMessage: {
    ...theme.fonts.caption,
    color: theme.colors.error,
  },
  stackTrace: {
    marginTop: theme.spacing.lg,
  },
  stackTitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  stackScroll: {
    maxHeight: 200,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  stackText: {
    ...theme.fonts.label,
    color: theme.colors.textSecondary,
    fontFamily: "monospace",
  },
  actions: {
    gap: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    ...theme.fonts.button,
    color: theme.colors.secondary,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
  },
  devNote: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xl,
    fontStyle: "italic",
  },
});
