import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
  TextStyle,
} from "react-native";
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
  const [isMounted, setIsMounted] = React.useState(true);
  
  React.useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  const getNextFlashMode = (): FlashMode => {
    switch (flashMode) {
      case "off":
        return "on";
      case "on":
        return "auto";
      case "auto":
        return "off";
    }
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case "off":
        return "flash-off";
      case "on":
        return "flash";
      case "auto":
        return "flash-outline";
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing='back'
        flash={flashMode}
      />
      
      {/* Overlay content positioned absolutely */}
      <View style={styles.cameraOverlay}>
        <View style={styles.topControls}>
          <View style={styles.flashWrapper}>
            <TouchableOpacity
              style={styles.flashButton}
              onPress={() => onFlashModeChange(getNextFlashMode())}
            >
              <Ionicons
                name={getFlashIcon()}
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.flashLabel}>{flashMode.toUpperCase()}</Text>
          </View>
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
          <View style={styles.secondaryButtons}>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.galleryButton} onPress={onImport}>
                <Ionicons
                  name='images-outline'
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <Text style={styles.buttonLabel}>Galerie</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.captureButton, isCapturing && styles.captureButtonActive]}
            onPress={onCapture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator size="large" color={theme.colors.secondary} />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>

          <View style={styles.secondaryButtons} />
        </View>
      </View>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 40,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },
  flashWrapper: {
    alignItems: "center",
  },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  flashLabel: {
    marginTop: 4,
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  frameContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  frameOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  overlayMiddle: {
    flexDirection: "row",
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  frame: {
    width: Dimensions.get("window").width * 0.85,
    height: Dimensions.get("window").width * 0.85,
    justifyContent: "center",
    alignItems: "center",
  },
  frameCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: theme.colors.primary,
  },
  frameCornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  frameCornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  frameCornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  frameCornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  frameHint: {
    ...theme.fonts.caption,
    color: theme.colors.secondary,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 13,
  } as TextStyle,
  bottomControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 60,
  },
  secondaryButtons: {
    width: 80,
    alignItems: "center",
  },
  buttonWrapper: {
    alignItems: "center",
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  buttonLabel: {
    marginTop: 4,
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  captureButtonActive: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
  },
});
