import React from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Text, Dimensions } from "react-native";
import { CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { FlashMode } from "../useStore";

interface CameraViewComponentProps {
  cameraRef: React.RefObject<any>;
  isCapturing: boolean;
  onCapture: () => void;
  onImport: () => void;
  flashMode: FlashMode;
  onFlashModeChange: (mode: FlashMode) => void;
}

export const CameraViewComponent: React.FC<CameraViewComponentProps> = ({
  cameraRef,
  isCapturing,
  onCapture,
  onImport,
  flashMode,
  onFlashModeChange,
}) => {
  const getNextFlashMode = (): FlashMode => {
    switch (flashMode) {
      case 'off':
        return 'on';
      case 'on':
        return 'auto';
      case 'auto':
        return 'off';
    }
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case 'off':
        return 'flash-off';
      case 'on':
        return 'flash';
      case 'auto':
        return 'flash-outline';
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" flash={flashMode}>
        <View style={styles.cameraOverlay}>
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.flashButton}
              onPress={() => onFlashModeChange(getNextFlashMode())}
            >
              <Ionicons name={getFlashIcon()} size={28} color={theme.colors.secondary} />
            </TouchableOpacity>
          </View>
          
          {/* Cadre de visée carré */}
          <View style={styles.frameContainer}>
            <View style={styles.frameOverlay}>
              {/* Top overlay */}
              <View style={styles.overlayTop} />
              
              {/* Middle row */}
              <View style={styles.overlayMiddle}>
                <View style={styles.overlaySide} />
                <View style={styles.frame}>
                  <View style={[styles.frameCorner, styles.frameCornerTL]} />
                  <View style={[styles.frameCorner, styles.frameCornerTR]} />
                  <View style={[styles.frameCorner, styles.frameCornerBL]} />
                  <View style={[styles.frameCorner, styles.frameCornerBR]} />
                  <Text style={styles.frameHint}>Centrez votre objet ici</Text>
                </View>
                <View style={styles.overlaySide} />
              </View>
              
              {/* Bottom overlay */}
              <View style={styles.overlayBottom} />
            </View>
          </View>
          
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.importButton}
              onPress={onImport}
            >
              <Ionicons name="images" size={28} color={theme.colors.secondary} />
            </TouchableOpacity>
            
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
            
            <View style={styles.placeholder} />
          </View>
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
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 50,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },
  flashButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  frameContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  frameOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  overlayMiddle: {
    flexDirection: 'row',
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  frame: {
    width: Dimensions.get('window').width * 0.95,
    height: Dimensions.get('window').width * 0.95,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: theme.colors.secondary,
  },
  frameCornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  frameCornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  frameCornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  frameCornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  frameHint: {
    color: theme.colors.secondary,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bottomControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
  importButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 50,
    height: 50,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.secondary,
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