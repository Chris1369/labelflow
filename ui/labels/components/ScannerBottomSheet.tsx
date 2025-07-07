import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Input } from "@/components/atoms";
import { labelAPI } from "@/api/label.api";

const { height: screenHeight } = Dimensions.get("window");

export interface ScannerBottomSheetRef {
  open: (labelId: string) => void;
  close: () => void;
}

interface Props {
  onScan?: (data: string, labelId: string) => void;
  onSubIdAdded?: () => void;
}

export const ScannerBottomSheet = forwardRef<ScannerBottomSheetRef, Props>(
  ({ onScan, onSubIdAdded }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentLabelId, setCurrentLabelId] = useState<string>("");
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState("");
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualCode, setManualCode] = useState("");
    const [permission, requestPermission] = useCameraPermissions();

    useImperativeHandle(ref, () => ({
      open: (labelId: string) => {
        setCurrentLabelId(labelId);
        setIsVisible(true);
      },
      close: () => {
        setIsVisible(false);
        setCurrentLabelId("");
      },
    }));

    const handleClose = () => {
      setIsVisible(false);
      setCurrentLabelId("");
      setScanned(false);
      setScannedData("");
      setShowManualInput(false);
      setManualCode("");
    };

    useEffect(() => {
      if (isVisible && !permission?.granted) {
        requestPermission();
      }
    }, [isVisible, permission]);

    const handleBarCodeScanned = ({ type, data }: any) => {
      if (!scanned) {
        setScanned(true);
        setScannedData(data);
      }
    };

    const handleConfirmScan = async () => {
      if (scannedData && currentLabelId) {
        try {
          await labelAPI.addSubId(currentLabelId, scannedData);
          Alert.alert(
            "Succès",
            "Le code a été ajouté au label",
            [
              {
                text: "OK",
                onPress: () => {
                  if (onSubIdAdded) {
                    onSubIdAdded();
                  }
                  handleClose();
                },
              },
            ]
          );
        } catch (error: any) {
          if (error.message?.includes("already exists") || error.message?.includes("déjà existant")) {
            Alert.alert("Erreur", "Ce code est déjà associé à ce label");
          } else {
            Alert.alert("Erreur", "Impossible d'ajouter le code au label");
          }
        }
      }
    };

    const handleManualSubmit = async () => {
      if (manualCode.trim() && currentLabelId) {
        try {
          await labelAPI.addSubId(currentLabelId, manualCode.trim());
          Alert.alert(
            "Succès",
            "Le code a été ajouté au label",
            [
              {
                text: "OK",
                onPress: () => {
                  if (onSubIdAdded) {
                    onSubIdAdded();
                  }
                  handleClose();
                },
              },
            ]
          );
        } catch (error: any) {
          if (error.message?.includes("already exists") || error.message?.includes("déjà existant")) {
            Alert.alert("Erreur", "Ce code est déjà associé à ce label");
          } else {
            Alert.alert("Erreur", "Impossible d'ajouter le code au label");
          }
        }
      }
    };

    const toggleManualInput = () => {
      setShowManualInput(!showManualInput);
      setScanned(false);
      setScannedData("");
    };

    return (
      <Modal
        visible={isVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayTouch}
            activeOpacity={1}
            onPress={handleClose}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <View style={styles.container}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <TouchableOpacity
                  style={[
                    styles.headerButton,
                    showManualInput && styles.activeHeaderButton,
                  ]}
                  onPress={toggleManualInput}
                >
                  {showManualInput ? (
                    <Ionicons
                      name='scan-outline'
                      size={24}
                      color={theme.colors.text}
                    />
                  ) : (
                    <Text style={styles.abcText}>ABC</Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.title}>
                  {showManualInput ? "Saisie manuelle" : "Scanner un code"}
                </Text>

                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={handleClose}
                >
                  <Ionicons name='close' size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                {showManualInput ? (
                  <View style={styles.manualInputContainer}>
                    <Text style={styles.manualInputTitle}>
                      Saisir le code manuellement
                    </Text>
                    <Input
                      placeholder='Entrez le code...'
                      value={manualCode}
                      onChangeText={setManualCode}
                      containerStyle={styles.input}
                    />
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleManualSubmit}
                      disabled={!manualCode.trim()}
                    >
                      <Text style={styles.submitButtonText}>Ajouter</Text>
                    </TouchableOpacity>
                  </View>
                ) : !permission ? (
                  <View style={styles.centerContent}>
                    <Text style={styles.permissionText}>Chargement...</Text>
                  </View>
                ) : !permission.granted ? (
                  <View style={styles.centerContent}>
                    <Ionicons
                      name='scan'
                      size={64}
                      color={theme.colors.textSecondary}
                    />
                    <Text style={styles.permissionText}>
                      Pas d'accès à la caméra
                    </Text>
                    <TouchableOpacity
                      style={styles.permissionButton}
                      onPress={requestPermission}
                    >
                      <Text style={styles.permissionButtonText}>
                        Autoriser la caméra
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : scanned ? (
                  <View style={styles.resultContainer}>
                    <View style={styles.resultCard}>
                      <View style={styles.resultIconContainer}>
                        <Ionicons
                          name='qr-code'
                          size={24}
                          color={theme.colors.primary}
                        />
                      </View>
                      <Text style={styles.resultLabel}>Code scanné</Text>
                      <Text style={styles.resultValue} numberOfLines={2}>
                        {scannedData}
                      </Text>
                    </View>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.confirmButton]}
                        onPress={handleConfirmScan}
                      >
                        <Ionicons
                          name='checkmark'
                          size={20}
                          color={theme.colors.secondary}
                        />
                        <Text style={styles.confirmButtonText}>Ajouter</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => {
                          setScanned(false);
                          setScannedData("");
                        }}
                      >
                        <Ionicons
                          name='refresh'
                          size={20}
                          color={theme.colors.text}
                        />
                        <Text style={styles.secondaryButtonText}>
                          Rescanner
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.scannerContainer}>
                    <CameraView
                      style={styles.scanner}
                      barcodeScannerSettings={{
                        barcodeTypes: [
                          "qr",
                          "ean13",
                          "ean8",
                          "code128",
                          "code39",
                          "code93",
                          "codabar",
                          "itf14",
                          "upc_a",
                          "upc_e",
                        ],
                      }}
                      onBarcodeScanned={handleBarCodeScanned}
                    />
                    <View style={styles.scanOverlay}>
                      <View style={styles.scanFrame} />
                      <Text style={styles.scanText}>
                        Placez le code dans le cadre
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
);

ScannerBottomSheet.displayName = "ScannerBottomSheet";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  overlayTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    minHeight: screenHeight * 0.6,
    maxHeight: screenHeight * 0.9,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerButton: {
    padding: theme.spacing.xs,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  activeHeaderButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
  },
  abcText: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  scannerContainer: {
    flex: 1,
    overflow: "hidden",
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scanner: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
  },
  permissionText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  instructionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  rescanButton: {
    position: "absolute",
    bottom: theme.spacing.xl,
    alignSelf: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  rescanButtonText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  manualInputContainer: {
    paddingVertical: theme.spacing.xl,
  },
  manualInputTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  input: {
    marginBottom: theme.spacing.lg,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  submitButtonText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  permissionButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  permissionButtonText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
  scanOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: "transparent",
  },
  scanText: {
    position: "absolute",
    bottom: 100,
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  resultContainer: {
    flex: 1,
    paddingTop: theme.spacing.xl,
  },
  resultCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  resultLabel: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  resultValue: {
    fontSize: theme.fonts.subtitle.fontSize,
    fontWeight: theme.fonts.subtitle.fontWeight as '600',
    lineHeight: theme.fonts.subtitle.lineHeight,
    color: theme.colors.text,
  },
  actionButtons: {
    gap: theme.spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  confirmButtonText: {
    fontSize: theme.fonts.button.fontSize,
    fontWeight: theme.fonts.button.fontWeight as '600',
    lineHeight: theme.fonts.button.lineHeight,
    color: theme.colors.secondary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryButtonText: {
    fontSize: theme.fonts.button.fontSize,
    fontWeight: theme.fonts.button.fontWeight as '600',
    lineHeight: theme.fonts.button.lineHeight,
    color: theme.colors.text,
  },
});
