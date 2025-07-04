import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { CaptureAngle } from "@/types/capturesTemplate";
import { AngleImage } from "./AngleImage";
import { AddImageButton } from "./AddImageButton";

interface AngleSectionProps {
  angle: CaptureAngle;
  angleSelectedImages: string[];
  existingValidatedImages: string[];
  isComplete: boolean;
  isFull: boolean;
  progress: number;
  fadeAnim: Animated.Value;
  isSelectingImages: boolean;
  isCreating: boolean;
  onAddImagesByAngle: (angle: string) => void;
  onAddImagesByAngleLongPress?: (angle: string) => void;
  onRemoveImageByAngle: (angle: string, index: number) => void;
}

export const AngleSection: React.FC<AngleSectionProps> = ({
  angle,
  angleSelectedImages,
  existingValidatedImages,
  isComplete,
  isFull,
  progress,
  fadeAnim,
  isSelectingImages,
  isCreating,
  onAddImagesByAngle,
  onAddImagesByAngleLongPress,
  onRemoveImageByAngle,
}) => {
  const totalSelectedImages = angleSelectedImages.length + existingValidatedImages.length;
  const maxImages = angle.maxCount || angle.count;

  return (
    <Animated.View
      style={[
        styles.angleSection,
        isComplete && !isFull && styles.angleSectionMinimumReached,
        isFull && styles.angleSectionComplete,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.angleHeader}>
        <View style={styles.angleInfo}>
          <Text style={styles.angleIcon}>{angle.icon}</Text>
          <View style={styles.angleTitleContainer}>
            <Text
              style={[
                styles.angleTitle,
                isFull && styles.angleTitleComplete,
              ]}
            >
              {angle.description}
            </Text>
            <View style={styles.angleStats}>
              <Text
                style={[
                  styles.angleCount,
                  isComplete && styles.angleCountComplete,
                ]}
              >
                {totalSelectedImages}/
                {angle.maxCount
                  ? `${angle.count}-${angle.maxCount}`
                  : angle.count}{" "}
                images
              </Text>
              {isFull ? (
                <View style={styles.successBadge}>
                  <Ionicons
                    name='checkmark-circle'
                    size={16}
                    color='white'
                  />
                  <Text style={styles.successText}>Complet</Text>
                </View>
              ) : (
                isComplete && (
                  <View style={styles.minimumBadge}>
                    <Ionicons
                      name='checkmark-circle-outline'
                      size={16}
                      color={theme.colors.success}
                    />
                    <Text style={styles.minimumText}>Minimum</Text>
                  </View>
                )
              )}
            </View>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress, 100)}%` },
                isComplete && styles.progressFillComplete,
              ]}
            />
          </View>
          <Text style={styles.progressText as TextStyle}>
            {Math.round(progress)}%
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}
      >
        <View style={styles.imageGrid}>
          {/* Existing validated images (read-only) */}
          {existingValidatedImages.map((uri, imgIndex) => (
            <AngleImage
              key={`existing-${imgIndex}`}
              uri={uri}
              index={imgIndex}
              isValidated={true}
              isCreating={isCreating}
              existingValidatedCount={existingValidatedImages.length}
              fadeAnim={fadeAnim}
              onRemove={() => {}}
            />
          ))}

          {/* New selected images */}
          {angleSelectedImages.map((uri, imgIndex) => (
            <AngleImage
              key={`new-${imgIndex}`}
              uri={uri}
              index={imgIndex}
              isValidated={false}
              isCreating={isCreating}
              existingValidatedCount={existingValidatedImages.length}
              fadeAnim={fadeAnim}
              onRemove={() => onRemoveImageByAngle(angle.position, imgIndex)}
            />
          ))}

          {/* Add button - always visible */}
          <AddImageButton
            isComplete={isComplete}
            isFull={isFull}
            isCreating={isCreating}
            isSelectingImages={isSelectingImages}
            totalSelectedImages={totalSelectedImages}
            requiredCount={angle.count}
            maxCount={maxImages}
            onPress={() => onAddImagesByAngle(angle.position)}
            onLongPress={() => onAddImagesByAngleLongPress?.(angle.position)}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  angleSection: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  angleSectionMinimumReached: {
    backgroundColor: theme.colors.success + "08",
    borderColor: theme.colors.success + "20",
  },
  angleSectionComplete: {
    backgroundColor: theme.colors.success + "10",
    borderColor: theme.colors.success + "30",
  },
  angleHeader: {
    marginBottom: theme.spacing.md,
  },
  angleInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  angleIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  angleTitleContainer: {
    flex: 1,
  },
  angleTitle: {
    ...theme.fonts.body,
    fontWeight: "600",
    color: theme.colors.text,
  },
  angleTitleComplete: {
    color: theme.colors.success,
  },
  angleStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: 2,
  },
  angleCount: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  } as TextStyle,
  angleCountComplete: {
    color: theme.colors.success,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressFillComplete: {
    backgroundColor: theme.colors.success,
  },
  progressText: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    minWidth: 35,
    textAlign: "right",
  },
  imageScroll: {
    marginHorizontal: -theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  imageGrid: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  successText: {
    ...theme.fonts.caption,
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  minimumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.success + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.success + "40",
  },
  minimumText: {
    ...theme.fonts.caption,
    color: theme.colors.success,
    fontSize: 11,
    fontWeight: "600",
  },
});