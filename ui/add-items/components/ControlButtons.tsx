import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { BoundingBox } from "../types";

interface ControlButtonsProps {
  currentBoxId: string | null;
  boundingBoxes: BoundingBox[];
  showSaveButton: boolean;
  hasCompletedBoxes: boolean;
  hasUncompletedBoxes: boolean;
  hasUnknownBoxes?: boolean;
  isSaving: boolean;
  onRetake: () => void;
  onAddBox: () => void;
  onValidate: () => void;
  onPredict: () => void;
  isForUnlabeled?: boolean;
  hasNextImage?: boolean;
  onNextImage?: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  currentBoxId,
  boundingBoxes,
  showSaveButton,
  hasCompletedBoxes,
  hasUncompletedBoxes,
  hasUnknownBoxes = false,
  isSaving,
  onRetake,
  onAddBox,
  onValidate,
  onPredict,
  isForUnlabeled = false,
  hasNextImage = false,
  onNextImage,
}) => {
  return (
    <>
      {/* Top left - Retake button or Next image button */}
      <View style={styles.topLeftContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isForUnlabeled && hasNextImage ? styles.nextButton : styles.secondaryButton,
              isSaving && styles.disabledButton,
            ]}
            onPress={isForUnlabeled && hasNextImage ? onNextImage : onRetake}
            disabled={isSaving}
          >
            {isForUnlabeled && hasNextImage ? (
              <Ionicons name='arrow-forward' size={24} color={theme.colors.secondary} />
            ) : (
              <Ionicons name='arrow-back' size={24} color={theme.colors.text} />
            )}
          </TouchableOpacity>
          {isForUnlabeled && hasNextImage && (
            <Text style={styles.buttonLabel}>Suivante</Text>
          )}
        </View>
      </View>

      {/* Top right - Add button */}
      <View style={styles.topRightContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            (hasUncompletedBoxes || isSaving) && styles.disabledButton,
          ]}
          onPress={onAddBox}
          disabled={hasUncompletedBoxes || isSaving}
        >
          <Ionicons
            name='add'
            size={28}
            color={
              hasUncompletedBoxes
                ? theme.colors.textSecondary
                : theme.colors.secondary
            }
          />
        </TouchableOpacity>
      </View>

      {/* Bottom left - Auto detect button - Show in both modes */}
      <View style={styles.bottomLeftContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.magicButton,
              isSaving && styles.disabledButton,
            ]}
            onPress={onPredict}
            disabled={isSaving}
          >
            <Ionicons
              name='sparkles'
              size={20}
              color={theme.colors.background}
            />
          </TouchableOpacity>
          <Text style={styles.buttonLabel}>Auto</Text>
        </View>
      </View>

      {/* Bottom controls */}
      {showSaveButton && (
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={[
              styles.bottomButton,
              currentBoxId ? styles.validateButton : styles.saveAllButton,
              isSaving && styles.disabledButton,
            ]}
            onPress={onValidate}
            activeOpacity={0.8}
            disabled={isSaving}
          >
            {isSaving && hasCompletedBoxes && !currentBoxId ? (
              <ActivityIndicator color={theme.colors.secondary} />
            ) : (
              <>
                <Ionicons
                  name={currentBoxId ? "checkmark" : "save"}
                  size={24}
                  color={theme.colors.secondary}
                />
                {!currentBoxId && hasCompletedBoxes && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {boundingBoxes.filter((b) => b.isComplete).length}
                    </Text>
                  </View>
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

    </>
  );
};

const styles = StyleSheet.create({
  topLeftContainer: {
    position: "absolute",
    top: 100,
    left: 20,
  },
  topRightContainer: {
    position: "absolute",
    top: 100,
    right: 20,
  },
  bottomLeftContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
  },
  buttonWrapper: {
    alignItems: "center",
  },
  buttonLabel: {
    marginTop: 4,
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  magicButton: {
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  bottomControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bottomButton: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  validateButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.success || '#4CAF50',
  },
  saveAllButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  badgeText: {
    color: theme.colors.secondary,
    fontSize: 12,
    fontWeight: "bold",
  },
  boxCounter: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    left: "50%",
    transform: [{ translateX: -50 }],
  },
  boxCounterText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: theme.colors.success || '#4CAF50',
  },
});
