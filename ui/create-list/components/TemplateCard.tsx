import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { CaptureTemplate } from "@/types/capturesTemplate";

interface TemplateCardProps {
  template: CaptureTemplate;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onPress,
  disabled,
}) => {
  const getDifficultyColor = () => {
    switch (template.difficulty) {
      case "easy":
        return theme.colors.success;
      case "medium":
        return theme.colors.warning;
      case "hard":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getDifficultyLabel = () => {
    switch (template.difficulty) {
      case "easy":
        return "Facile";
      case "medium":
        return "Moyen";
      case "hard":
        return "Difficile";
      default:
        return "";
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        disabled && styles.disabledContainer,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, isSelected && styles.selectedText]}>
            {template.name}
          </Text>
          {isSelected && (
            <View style={styles.checkIcon}>
              <Ionicons
                name='checkmark-circle'
                size={24}
                color={theme.colors.primary}
              />
            </View>
          )}
        </View>
        <Text style={styles.description}>{template.description}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons
            name='time-outline'
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>{template.estimatedTime} min</Text>
        </View>

        <View style={styles.stat}>
          <Ionicons
            name='camera-outline'
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>{template.totalPhotos} photos</Text>
        </View>

        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor() + "20" },
          ]}
        >
          <Text
            style={[styles.difficultyText, { color: getDifficultyColor() }]}
          >
            {getDifficultyLabel()}
          </Text>
        </View>
      </View>

      <View style={styles.anglesPreview}>
        <Text style={styles.anglesTitle as TextStyle}>Angles principaux:</Text>
        <View style={styles.anglesList}>
          {template.angles.slice(0, 4).map((angle, index) => (
            <View key={index} style={styles.angleItem}>
              <Text style={styles.angleIcon}>{angle.icon}</Text>
              <Text style={styles.angleCount}>{angle.count}</Text>
            </View>
          ))}
          {template.angles.length > 4 && (
            <Text style={styles.moreAngles}>+{template.angles.length - 4}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedContainer: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "08",
  },
  disabledContainer: {
    opacity: 0.5,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.fonts.body,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  selectedText: {
    color: theme.colors.primary,
  },
  checkIcon: {
    marginLeft: theme.spacing.sm,
  },
  description: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  } as TextStyle,
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statText: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  } as TextStyle,
  difficultyBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
    marginLeft: "auto",
  },
  difficultyText: {
    ...theme.fonts.caption,
    fontWeight: "600",
  },
  anglesPreview: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },
  anglesTitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  anglesList: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  angleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs / 2,
  },
  angleIcon: {
    fontSize: 16,
  },
  angleCount: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  moreAngles: {
    ...theme.fonts.caption,
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
