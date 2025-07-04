import { theme } from "@/types/theme";
import { CAPTURE_TEMPLATES } from "@/constants/CapturesTemplates";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TemplateCard } from "./TemplateCard";

interface ListImageTemplateSelectProps {
  listImageTemplate: string;
  error: string | null;
  isCreating: boolean;
  onChangeText: (text: string) => void;
  containerStyle?: ViewStyle;
  hasImages?: boolean;
}

export const ListImageTemplateSelect: React.FC<
  ListImageTemplateSelectProps
> = ({
  listImageTemplate,
  error,
  isCreating,
  onChangeText,
  containerStyle,
  hasImages = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const isDisabled = isCreating || hasImages;

  const selectedTemplate = CAPTURE_TEMPLATES.find(
    (t) => t.id === listImageTemplate
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label as TextStyle}>Template d'images</Text>

      <TouchableOpacity
        style={[
          styles.selectButton,
          error && styles.selectButtonError,
          isDisabled && styles.selectButtonDisabled,
        ]}
        onPress={() => !isDisabled && setModalVisible(true)}
        disabled={isDisabled}
      >
        <View style={styles.selectContent}>
          {selectedTemplate ? (
            <>
              <Text style={styles.selectedText}>{selectedTemplate.name}</Text>
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedDetail}>
                  {selectedTemplate.totalPhotos} photos •{" "}
                  {selectedTemplate.estimatedTime} min
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.placeholderText}>Sélectionner un template</Text>
          )}
        </View>
        <Ionicons
          name='chevron-down'
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.error as TextStyle}>{error}</Text>}
      {hasImages && (
        <Text style={styles.disabledInfo as TextStyle}>
          Le template ne peut pas être modifié après l'ajout d'images
        </Text>
      )}

      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir un template</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name='close' size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.templatesList}
              showsVerticalScrollIndicator={false}
            >
              {CAPTURE_TEMPLATES.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={template.id === listImageTemplate}
                  onPress={() => {
                    onChangeText(template.id);
                    setModalVisible(false);
                  }}
                  disabled={isCreating}
                />
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.fonts.label,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    minHeight: 60,
  },
  selectButtonError: {
    borderColor: theme.colors.error,
  },
  selectButtonDisabled: {
    opacity: 0.5,
  },
  selectContent: {
    flex: 1,
  },
  selectedText: {
    ...theme.fonts.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  selectedInfo: {
    marginTop: theme.spacing.xs / 2,
  },
  selectedDetail: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  } as TextStyle,
  placeholderText: {
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
  } as TextStyle,
  error: {
    ...theme.fonts.label,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
    marginTop: 50,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
  } as TextStyle,
  templatesList: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  disabledInfo: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
});
