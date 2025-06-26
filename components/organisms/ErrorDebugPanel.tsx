import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { errorHandler } from "@/helpers/errorHandler";

export const ErrorDebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState<any[]>([]);
  const [selectedError, setSelectedError] = useState<any>(null);

  useEffect(() => {
    if (!__DEV__) return;

    // Add global access to show debug panel
    (global as any).showErrorDebug = () => setIsVisible(true);

    // Refresh errors when panel opens
    if (isVisible) {
      setErrors(errorHandler.getErrorLogs());
    }
  }, [isVisible]);

  if (!__DEV__) return null;

  const clearLogs = () => {
    Alert.alert(
      "Effacer les logs",
      "Voulez-vous vraiment effacer tous les logs d'erreur?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Effacer",
          style: "destructive",
          onPress: () => {
            errorHandler.clearErrorLogs();
            setErrors([]);
            setSelectedError(null);
          },
        },
      ]
    );
  };

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case "api":
        return theme.colors.error;
      case "navigation":
        return theme.colors.warning;
      case "state":
        return theme.colors.info;
      case "render":
        return "#FF6B6B";
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <>
      {/* Floating Debug Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsVisible(true)}
      >
        <Ionicons name='bug' size={24} color={theme.colors.secondary} />
        {errors.length > 0 && (
          <View style={styles.errorCount}>
            <Text style={styles.errorCountText}>{errors.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Debug Modal */}
      <Modal
        visible={isVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Debug des Erreurs</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  onPress={clearLogs}
                  style={styles.headerButton}
                >
                  <Ionicons name='trash' size={20} color={theme.colors.error} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsVisible(false)}
                  style={styles.headerButton}
                >
                  <Ionicons name='close' size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.errorList}>
              {errors.length === 0 ? (
                <Text style={styles.noErrors}>Aucune erreur enregistrée</Text>
              ) : (
                errors.map((error, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.errorItem}
                    onPress={() => setSelectedError(error)}
                  >
                    <View style={styles.errorHeader}>
                      <View
                        style={[
                          styles.errorTypeBadge,
                          { backgroundColor: getErrorTypeColor(error.type) },
                        ]}
                      >
                        <Text style={styles.errorTypeText}>{error.type}</Text>
                      </View>
                      <Text style={styles.errorTime}>
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                    <Text style={styles.errorMessage} numberOfLines={2}>
                      {error.message}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>

        {/* Error Detail Modal */}
        {selectedError && (
          <Modal
            visible={!!selectedError}
            animationType='fade'
            transparent={true}
            onRequestClose={() => setSelectedError(null)}
          >
            <View style={styles.detailModalContainer}>
              <View style={styles.detailModalContent}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>Détails de l'erreur</Text>
                  <TouchableOpacity onPress={() => setSelectedError(null)}>
                    <Ionicons
                      name='close'
                      size={24}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.detailScroll}>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Type:</Text>
                    <Text style={styles.detailValue}>{selectedError.type}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Timestamp:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedError.timestamp).toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Message:</Text>
                    <Text style={styles.detailValue}>
                      {selectedError.message}
                    </Text>
                  </View>

                  {selectedError.stack && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Stack trace:</Text>
                      <View style={styles.stackContainer}>
                        <Text style={styles.stackText}>
                          {selectedError.stack}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedError.context && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Context:</Text>
                      <View style={styles.stackContainer}>
                        <Text style={styles.stackText}>
                          {JSON.stringify(selectedError.context, null, 2)}
                        </Text>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  errorCount: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  errorCountText: {
    ...theme.fonts.label,
    color: theme.colors.secondary,
    fontSize: 10,
  } as TextStyle,
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    height: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.fonts.title,
    color: theme.colors.text,
  } as TextStyle,
  headerButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  errorList: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  noErrors: {
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xxl,
  } as TextStyle,
  errorItem: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  errorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  errorTypeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  errorTypeText: {
    ...theme.fonts.label,
    color: theme.colors.secondary,
    textTransform: "uppercase",
  } as TextStyle,
  errorTime: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  } as TextStyle,
  errorMessage: {
    ...theme.fonts.body,
    color: theme.colors.text,
  } as TextStyle,
  detailModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  detailModalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    width: "100%",
    maxHeight: "80%",
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailTitle: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
  } as TextStyle,
  detailScroll: {
    padding: theme.spacing.lg,
  },
  detailSection: {
    marginBottom: theme.spacing.lg,
  },
  detailLabel: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  detailValue: {
    ...theme.fonts.body,
    color: theme.colors.text,
  } as TextStyle,
  stackContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
  },
  stackText: {
    ...theme.fonts.caption,
    color: theme.colors.text,
    fontFamily: "monospace",
  } as TextStyle,
});
