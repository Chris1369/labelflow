import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";

interface AddImageButtonProps {
  isComplete: boolean;
  isFull: boolean;
  isCreating: boolean;
  isSelectingImages: boolean;
  totalSelectedImages: number;
  requiredCount: number;
  maxCount: number;
  onPress: () => void;
  onLongPress?: () => void;
}

export const AddImageButton: React.FC<AddImageButtonProps> = ({
  isComplete,
  isFull,
  isCreating,
  isSelectingImages,
  totalSelectedImages,
  requiredCount,
  maxCount,
  onPress,
  onLongPress,
}) => {
  const renderContent = () => {
    if (isSelectingImages) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='small' color={theme.colors.primary} />
          <Text style={styles.loadingText as TextStyle}>Chargement...</Text>
        </View>
      );
    }

    if (isFull) {
      return (
        <View style={styles.addContent}>
          <Ionicons name='checkmark-circle' size={32} color={theme.colors.success} />
          <Text style={styles.completeText}>Terminé</Text>
        </View>
      );
    }

    if (isComplete) {
      return (
        <View style={styles.addContent}>
          <Ionicons name='checkmark-circle-outline' size={32} color={theme.colors.success} />
          <Text style={styles.completeText}>Minimum atteint</Text>
          <Text style={styles.remainingText as TextStyle}>
            +{maxCount - totalSelectedImages} optionnelles
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.addContent}>
        <View style={styles.addIconContainer}>
          <Ionicons name='add-circle-outline' size={28} color={theme.colors.primary} />
        </View>
        <Text style={styles.addImageText}>Ajouter</Text>
        <Text style={styles.remainingText as TextStyle}>
          {requiredCount - totalSelectedImages} requises
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.addImageCard,
        (isCreating || isSelectingImages) && styles.addImageCardDisabled,
        isComplete && styles.addImageCardComplete,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={isCreating || isSelectingImages}
      activeOpacity={0.7}
      delayLongPress={500}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addImageCard: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary + "40",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary + "08",
  },
  addImageCardDisabled: {
    opacity: 0.5,
  },
  addImageCardComplete: {
    borderColor: theme.colors.success + "40",
    backgroundColor: theme.colors.success + "08",
  },
  addContent: {
    alignItems: "center",
  },
  addIconContainer: {
    marginBottom: theme.spacing.xs / 2,
  },
  addImageText: {
    ...theme.fonts.caption,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  remainingText: {
    ...theme.fonts.caption,
    color: theme.colors.primary + "80",
    fontSize: 10,
    marginTop: 2,
  },
  completeText: {
    ...theme.fonts.caption,
    color: theme.colors.success,
    fontWeight: "600",
    marginTop: theme.spacing.xs / 2,
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    ...theme.fonts.caption,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    fontSize: 11,
  },
});