import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderPage } from "@/components/atoms";
import { useLocalSearchParams } from "expo-router";
import { theme } from "@/types/theme";
import { useExportStore } from "./useStore";
import { ExportOptionCard } from "./components/ExportOptionCard";
import { exportOptions } from "./data/exportOptions";

export default function ExportScreen() {
  const { id: projectId } = useLocalSearchParams<{ id: string }>();
  const { isExporting } = useExportStore();

  const yoloOptions = exportOptions.filter((opt) => opt.id.includes("yolo"));
  const jsonOptions = exportOptions.filter((opt) =>
    ["json", "json-min", "csv", "tsv"].includes(opt.id)
  );
  const otherOptions = exportOptions.filter((opt) =>
    ["coco", "pascal-voc"].includes(opt.id)
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['left', 'right', 'bottom']}>
      <HeaderPage 
        title="Export de données" 
        subtitle="Choisissez un format d'export"
      />
      
      <ScrollView contentContainerStyle={{ padding: theme.spacing.sm }}>
        <ExportSection
          title="Formats YOLO"
          options={yoloOptions}
          projectId={projectId}
          isExporting={isExporting}
        />

        <ExportSection
          title="Formats JSON"
          options={jsonOptions}
          projectId={projectId}
          isExporting={isExporting}
        />

        <ExportSection
          title="Autres formats (bientôt disponibles)"
          options={otherOptions}
          projectId={projectId}
          isExporting={isExporting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ExportSection({
  title,
  options,
  projectId,
  isExporting,
}: {
  title: string;
  options: typeof exportOptions;
  projectId: string;
  isExporting: boolean;
}) {
  return (
    <View style={{ marginBottom: theme.spacing.xl }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: theme.colors.text,
          marginBottom: theme.spacing.md,
        }}
      >
        {title}
      </Text>
      {options.map((option) => (
        <ExportOptionCard
          key={option.id}
          option={option}
          projectId={projectId}
          isExporting={isExporting}
        />
      ))}
    </View>
  );
}