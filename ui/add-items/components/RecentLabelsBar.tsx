import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { theme } from "@/types/theme";
import { RecentLabelsManager } from "@/helpers/recentLabels";

interface RecentLabelsBarProps {
  onSelectLabel: (label: string) => void;
  visible: boolean;
}

export const RecentLabelsBar: React.FC<RecentLabelsBarProps> = ({
  onSelectLabel,
  visible,
}) => {
  const [recentLabels, setRecentLabels] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      loadRecentLabels();
    }
  }, [visible]);

  const loadRecentLabels = async () => {
    const labels = await RecentLabelsManager.getRecentLabels();
    setRecentLabels(labels);
  };

  if (!visible || recentLabels.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Labels récents</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recentLabels.map((label, index) => (
          <TouchableOpacity
            key={`${label}-${index}`}
            style={styles.labelButton}
            onPress={() => onSelectLabel(label)}
          >
            <Text style={styles.labelText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  title: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.xs,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
    opacity: 0.7,
  },
  scrollContent: {
    gap: theme.spacing.sm,
  },
  labelButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  labelText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
});