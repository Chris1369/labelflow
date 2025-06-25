import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { theme } from "@/types/theme";
import { ExportOption } from "../types";
import { useExportStore } from "../useStore";
import { exportActions } from "../actions";

interface ExportOptionCardProps {
  option: ExportOption;
  projectId: string;
  isExporting: boolean;
}

export function ExportOptionCard({
  option,
  projectId,
  isExporting,
}: ExportOptionCardProps) {
  const { selectedFormat } = useExportStore();
  const isSelected = selectedFormat === option.id;

  return (
    <TouchableOpacity
      style={{
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 2,
        borderColor: isSelected ? theme.colors.primary : "transparent",
        opacity: option.enabled ? 1 : 0.5,
      }}
      onPress={() => {
        if (option.enabled && !isExporting) {
          exportActions.handleExport(projectId, option.id);
        }
      }}
      disabled={!option.enabled || isExporting}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, marginRight: theme.spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: theme.spacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: theme.colors.text,
                marginRight: theme.spacing.sm,
              }}
            >
              {option.title}
            </Text>
            <View
              style={{
                backgroundColor: theme.colors.primary + "20",
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 2,
                borderRadius: theme.borderRadius.sm,
              }}
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                {option.format}
              </Text>
            </View>
          </View>

          {option.tags.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: theme.spacing.sm,
              }}
            >
              {option.tags.map((tag, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: theme.colors.border,
                    paddingHorizontal: theme.spacing.sm,
                    paddingVertical: 4,
                    borderRadius: theme.borderRadius.sm,
                    marginRight: theme.spacing.xs,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: 11,
                    }}
                  >
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text
            style={{
              fontSize: 14,
              color: theme.colors.textSecondary,
              lineHeight: 20,
            }}
          >
            {option.description}
          </Text>
        </View>

        {isExporting && isSelected ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <View
            style={{
              backgroundColor: option.enabled
                ? theme.colors.primary
                : theme.colors.border,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.md,
            }}
          >
            <Text
              style={{
                color: option.enabled ? "#fff" : theme.colors.textSecondary,
                fontWeight: "600",
              }}
            >
              {option.enabled ? "Exporter" : "Bientôt"}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}