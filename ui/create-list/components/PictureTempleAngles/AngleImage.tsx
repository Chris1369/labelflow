import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ImageStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";

interface AngleImageProps {
  uri: string;
  index: number;
  isValidated: boolean;
  isCreating: boolean;
  existingValidatedCount: number;
  fadeAnim: Animated.Value;
  onRemove: () => void;
}

export const AngleImage: React.FC<AngleImageProps> = ({
  uri,
  index,
  isValidated,
  isCreating,
  existingValidatedCount,
  fadeAnim,
  onRemove,
}) => {
  if (isValidated) {
    return (
      <View style={styles.imageCard}>
        <Image source={{ uri }} style={styles.imagePreview as ImageStyle} />
        <View style={styles.validatedOverlay}>
          <Ionicons name='lock-closed' size={16} color='white' />
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.imageCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Image source={{ uri }} style={styles.imagePreview as ImageStyle} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
        disabled={isCreating}
      >
        <Ionicons name='close-circle' size={24} color='white' />
      </TouchableOpacity>
      <View style={styles.imageNumber}>
        <Text style={styles.imageNumberText}>
          {existingValidatedCount + index + 1}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  imageCard: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    position: "relative",
    backgroundColor: theme.colors.backgroundSecondary,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  validatedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    position: "absolute",
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  imageNumber: {
    position: "absolute",
    bottom: theme.spacing.xs,
    left: theme.spacing.xs,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  imageNumberText: {
    ...theme.fonts.caption,
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
});