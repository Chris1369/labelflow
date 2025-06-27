import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import { theme } from "@/types/theme";
import { RecentLabelsManager } from "@/helpers/recentLabels";
import { Ionicons } from "@expo/vector-icons";

interface RecentLabelsBarProps {
  onSelectLabel: (label: string) => void;
  visible: boolean;
}

export const RecentLabelsBar: React.FC<RecentLabelsBarProps> = ({
  onSelectLabel,
  visible,
}) => {
  const [recentLabels, setRecentLabels] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const animatedHeight = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      loadRecentLabels();
    }
  }, [visible]);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const loadRecentLabels = async () => {
    const labels = await RecentLabelsManager.getRecentLabels();
    setRecentLabels(labels);
  };

  if (!visible || recentLabels.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Suggestions</Text>
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.toggleButton}
        >
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          styles.labelsContainer,
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 60],
            }),
            opacity: animatedHeight,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {recentLabels.map((label, index) => (
            <TouchableOpacity
              key={`${label}-${index}`}
              style={styles.labelButton}
              onPress={() => onSelectLabel(label)}
              activeOpacity={0.7}
            >
              <Text style={styles.labelText} numberOfLines={1}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    left: 16,
    right: 16,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  toggleButton: {
    padding: 4,
  },
  labelsContainer: {
    overflow: "hidden",
  },
  scrollView: {
    marginHorizontal: -theme.spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  labelButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  labelText: {
    ...theme.fonts.caption,
    color: theme.colors.text,
    fontWeight: "500",
  },
});
