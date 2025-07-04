import React from "react";
import { View, Text, StyleSheet, Animated, TextStyle } from "react-native";
import { theme } from "@/types/theme";
import { useStore } from "../../useStore";
import { CAPTURE_TEMPLATES } from "@/constants/CapturesTemplates";
import { AngleSection } from "./AngleSection";

interface PictureTempleAnglesProps {
  onAddImagesByAngle: (angle: string) => void;
  onAddImagesByAngleLongPress?: (angle: string) => void;
  onRemoveImageByAngle: (angle: string, index: number) => void;
}

export const PictureTempleAngles: React.FC<PictureTempleAnglesProps> = ({
  onAddImagesByAngle,
  onAddImagesByAngleLongPress,
  onRemoveImageByAngle,
}) => {
  const {
    listImageTemplate,
    selectedImagesByAngle,
    existingValidatedImagesByAngle,
    isSelectingImages,
    isCreating,
  } = useStore();
  
  const selectedImageTemplate = CAPTURE_TEMPLATES.find(
    (template) => template.id === listImageTemplate
  );
  const angles = selectedImageTemplate?.angles;

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!angles) return null;

  return (
    <View style={styles.container}>
      <View style={styles.templateHeader}>
        <Text style={styles.templateTitle as TextStyle}>
          Organisation par angles
        </Text>
        <Text style={styles.templateSubtitle}>
          Template: {selectedImageTemplate?.name}
        </Text>
      </View>

      {angles.map((angle, index) => {
        const angleSelectedImages = selectedImagesByAngle[angle.position] || [];
        const existingValidatedImages = existingValidatedImagesByAngle[angle.position] || [];
        const totalSelectedImages = angleSelectedImages.length + existingValidatedImages.length;
        const progress = (totalSelectedImages / angle.count) * 100;
        const isComplete = totalSelectedImages >= angle.count;
        const isFull = totalSelectedImages >= (angle.maxCount || angle.count);

        return (
          <AngleSection
            key={`${angle.position}-${index}`}
            angle={angle}
            angleSelectedImages={angleSelectedImages}
            existingValidatedImages={existingValidatedImages}
            isComplete={isComplete}
            isFull={isFull}
            progress={progress}
            fadeAnim={fadeAnim}
            isSelectingImages={isSelectingImages}
            isCreating={isCreating}
            onAddImagesByAngle={onAddImagesByAngle}
            onAddImagesByAngleLongPress={onAddImagesByAngleLongPress}
            onRemoveImageByAngle={onRemoveImageByAngle}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.lg,
  },
  templateHeader: {
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  templateTitle: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  templateSubtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  } as TextStyle,
});