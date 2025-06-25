import React from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { CameraView } from "expo-camera";
import { theme } from "@/types/theme";

interface CameraViewComponentProps {
  cameraRef: React.RefObject<any>;
  isCapturing: boolean;
  onCapture: () => void;
}

export const CameraViewComponent: React.FC<CameraViewComponentProps> = ({
  cameraRef,
  isCapturing,
  onCapture,
}) => {
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={styles.cameraOverlay}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={onCapture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator color={theme.colors.secondary} />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    paddingBottom: 50,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.secondary,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
  },
});