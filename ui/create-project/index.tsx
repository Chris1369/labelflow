import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { theme } from "@/types/theme";
import { useCreateProjectStore } from "./useStore";
import { createProjectActions } from "./actions";
import {
  ProjectNameInput,
  ProjectDescriptionInput,
  PublicToggle,
  ErrorMessage,
  ActionButtons,
} from "./components";

export const CreateProjectScreen: React.FC = () => {
  const { name, description, isPublic, isCreating, error, setName, setDescription, setIsPublic } =
    useCreateProjectStore();

  useEffect(() => {
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
          <ProjectNameInput
            value={name}
            onChange={setName}
          />

          <ProjectDescriptionInput
            value={description}
            onChange={setDescription}
          />

          <PublicToggle
            value={isPublic}
            onChange={setIsPublic}
          />

          <ErrorMessage error={error} />
        </View>

        <ActionButtons
          isCreating={isCreating}
          onCreate={createProjectActions.createProject}
          onCancel={createProjectActions.cancelCreation}
        />
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
});
