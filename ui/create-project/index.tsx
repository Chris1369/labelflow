import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Input, Button } from "../../components/atoms";
import { theme } from "../../types/theme";
import { useCreateProjectStore } from "./useStore";
import { createProjectActions } from "./actions";
import { Ionicons } from "@expo/vector-icons";

export const CreateProjectScreen: React.FC = () => {
  const { name, description, isPublic, isCreating, error, setName, setDescription, setIsPublic } =
    useCreateProjectStore();

  useEffect(() => {
    // Reset form when component mounts
    useCreateProjectStore.getState().resetForm();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom du projet</Text>
            <Input
              placeholder='Ex: Inventaire magasin'
              value={name}
              onChangeText={setName}
              autoCapitalize='sentences'
              maxLength={50}
            />
            <Text style={styles.charCount}>{name.length}/50</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <Input
              placeholder='Décrivez votre projet...'
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical='top'
              style={styles.textArea}
              maxLength={200}
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <Text style={styles.label}>Rendre public</Text>
              <Text style={styles.switchDescription}>
                Les autres utilisateurs pourront voir ce projet
              </Text>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ 
                false: theme.colors.border, 
                true: theme.colors.primary + '80' 
              }}
              thumbColor={isPublic ? theme.colors.primary : theme.colors.backgroundSecondary}
            />
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons
                name='alert-circle'
                size={20}
                color={theme.colors.error}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isCreating ? "" : "Créer le projet"}
            onPress={createProjectActions.createProject}
            disabled={isCreating}
            style={styles.createButton}
          >
            {isCreating && (
              <ActivityIndicator color={theme.colors.secondary} size='small' />
            )}
          </Button>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={createProjectActions.cancelCreation}
            disabled={isCreating}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  textArea: {
    minHeight: 100,
    paddingTop: theme.spacing.md,
  },
  charCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: "right",
    marginTop: theme.spacing.xs,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
  },
  switchLabel: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  switchDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${theme.colors.error}10`,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
  },
  createButton: {
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
    padding: theme.spacing.md,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
});
