import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { BoundingBox } from "../types";

interface ControlButtonsProps {
  currentBoxId: string | null;
  boundingBoxes: BoundingBox[];
  showSaveButton: boolean;
  hasCompletedBoxes: boolean;
  hasUncompletedBoxes: boolean;
  onRetake: () => void;
  onAddBox: () => void;
  onRotate: (direction: "left" | "right") => void;
  onValidate: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  currentBoxId,
  boundingBoxes,
  showSaveButton,
  hasCompletedBoxes,
  hasUncompletedBoxes,
  onRetake,
  onAddBox,
  onRotate,
  onValidate,
}) => {
  const currentBox = boundingBoxes.find(box => box.id === currentBoxId);

  return (
    <>
      {/* Top controls */}
      <TouchableOpacity style={styles.retakeButton} onPress={onRetake}>
        <Ionicons name="camera-reverse" size={32} color={theme.colors.secondary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addBoxButton, hasUncompletedBoxes && styles.disabledButton]}
        onPress={onAddBox}
        disabled={hasUncompletedBoxes}
      >
        <Ionicons
          name="add-circle"
          size={48}
          color={hasUncompletedBoxes ? theme.colors.textSecondary : theme.colors.primary}
        />
      </TouchableOpacity>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Rotation controls */}
        {currentBoxId && (
          <View style={styles.rotationControls}>
            <TouchableOpacity
              style={styles.rotationButton}
              onPress={() => onRotate("left")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="refresh-outline"
                size={20}
                color={theme.colors.secondary}
                style={{ transform: [{ scaleX: -1 }] }}
              />
            </TouchableOpacity>

            <Text style={styles.rotationText}>
              {currentBox?.rotation || 0}°
            </Text>

            <TouchableOpacity
              style={styles.rotationButton}
              onPress={() => onRotate("right")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="refresh-outline"
                size={20}
                color={theme.colors.secondary}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Validate button */}
        {showSaveButton && (
          <TouchableOpacity
            style={[
              styles.saveButton,
              hasCompletedBoxes && !currentBoxId && styles.saveAllButton
            ]}
            onPress={onValidate}
            activeOpacity={0.8}
          >
            <Ionicons
              name={currentBoxId ? 'checkmark-circle' : 'save-outline'}
              size={currentBoxId ? 56 : 32}
              color={hasCompletedBoxes && !currentBoxId ? theme.colors.secondary : theme.colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Box count indicator */}
      {boundingBoxes.length > 0 && (
        <View style={styles.boxCounter}>
          <Text style={styles.boxCounterText}>
            {boundingBoxes.filter(b => b.isComplete).length}/{boundingBoxes.length} objets
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  retakeButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addBoxButton: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  bottomControls: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rotationControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  rotationButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  rotationText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: "bold",
    marginHorizontal: theme.spacing.md,
    minWidth: 40,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 30,
    padding: 4,
  },
  saveAllButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
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
});