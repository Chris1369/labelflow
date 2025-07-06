import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { theme } from "@/types/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderPageProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: {
    icon?: keyof typeof Ionicons.glyphMap;
    text?: string;
    onPress: () => void;
  };
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  centered?: boolean;
}

export const HeaderPage: React.FC<HeaderPageProps> = ({
  title,
  subtitle,
  onBack,
  showBack = true,
  rightAction,
  style,
  titleStyle,
  subtitleStyle,
  centered = false,
}) => {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  // If centered is true, use the old centered layout
  if (centered) {
    return (
      <View style={styles.centeredHeader}>
        {!subtitle && (
          <Text style={styles.simpleTitle as TextStyle}>{title}</Text>
        )}
        {subtitle && <Text style={styles.centeredTitle}>{title}</Text>}
        {subtitle && <Text style={styles.centeredSubtitle}>{subtitle}</Text>}
      </View>
    );
  }

  // New navigation header layout
  return (
    <View style={[styles.container, { paddingTop: insets.top }, style]}>
      <View style={styles.header}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name='chevron-back' size={28} color={theme.colors.text} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[styles.subtitle as TextStyle, subtitleStyle]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction && (
          <View style={styles.rightActionContainer}>
            <TouchableOpacity
              style={[
                styles.rightButton,
                (rightAction.icon === "add-circle-outline" ||
                  rightAction.icon === "eye-outline") &&
                  styles.actionButton,
              ]}
              onPress={rightAction.onPress}
              hitSlop={{
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }}
            >
              {rightAction.icon ? (
                <Ionicons
                  name={
                    rightAction.icon === "add-circle-outline"
                      ? "add"
                      : rightAction.icon === "eye-outline"
                      ? "eye"
                      : rightAction.icon
                  }
                  size={
                    rightAction.icon === "add-circle-outline" ||
                    rightAction.icon === "eye-outline"
                      ? 20
                      : 24
                  }
                  color={
                    rightAction.icon === "add-circle-outline" ||
                    rightAction.icon === "eye-outline"
                      ? theme.colors.secondary
                      : theme.colors.primary
                  }
                />
              ) : rightAction.text ? (
                <Text style={styles.rightButtonText}>{rightAction.text}</Text>
              ) : null}
            </TouchableOpacity>
            {rightAction.badge !== undefined && rightAction.badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {rightAction.badge > 99 ? "99+" : rightAction.badge}
                </Text>
              </View>
            )}
          </View>
        )}

        {!rightAction && showBack && <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Navigation header styles
  container: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    minHeight: 56,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
  } as TextStyle,
  subtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  rightButton: {
    marginLeft: theme.spacing.md,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  rightButtonText: {
    ...theme.fonts.button,
    color: theme.colors.primary,
  } as TextStyle,
  placeholder: {
    width: 28,
    marginLeft: theme.spacing.md,
  },
  rightActionContainer: {
    position: "relative",
    marginLeft: theme.spacing.md,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    minWidth: 20,
    minHeight: 20,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  badgeText: {
    ...theme.fonts.caption,
    color: theme.colors.background,
    fontSize: 10,
    fontWeight: "600",
  } as TextStyle,

  // Centered header styles
  centeredHeader: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  centeredTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  simpleTitle: {
    ...theme.fonts.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  centeredSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
  },
});
