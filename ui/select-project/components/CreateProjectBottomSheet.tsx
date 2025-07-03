import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Input, Button } from '@/components/atoms';
import { SimpleBottomSheet } from '@/components/molecules';
import { theme } from '@/types/theme';
import { projectAPI } from '@/api/project.api';
import { router } from 'expo-router';
import { useSettingsStore } from '@/ui/settings/useStore';
import { invalidateQuery } from '@/helpers/invalidateQuery';
import { projectKeys } from '@/hooks/queries';

export interface CreateProjectBottomSheetRef {
  open: () => void;
  close: () => void;
}

export const CreateProjectBottomSheet = forwardRef<CreateProjectBottomSheetRef>((_, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsVisible(true);
      setName('');
      setDescription('');
      setIsPublic(false);
    },
    close: () => setIsVisible(false),
  }));

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour le projet');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une description pour le projet');
      return;
    }

    setIsCreating(true);
    try {
      const newProject = await projectAPI.create({
        name: name.trim(),
        description: description.trim(),
        isPublic,
      });

      // Refresh projects list
      const includePublic = useSettingsStore.getState().includePublicProjects;
      invalidateQuery(projectKeys.list({ my: true, includePublic }));

      // Reset form and close
      setName('');
      setDescription('');
      setIsPublic(false);
      setIsVisible(false);

      Alert.alert('Succès', 'Projet créé avec succès', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to the new project
            const projectId = newProject._id || newProject.id;
            router.push(`/(project)/${projectId}`);
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de créer le projet');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <SimpleBottomSheet
      visible={isVisible}
      onClose={handleClose}
      height="60%"
    >
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Nouveau projet</Text>
            <Text style={styles.subtitle}>
              Créez un projet pour organiser vos listes
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              placeholder="Nom du projet"
              value={name}
              onChangeText={setName}
              containerStyle={styles.input}
              autoFocus
            />

            <Input
              placeholder="Description du projet"
              value={description}
              onChangeText={setDescription}
              containerStyle={styles.input}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchText}>Rendre public</Text>
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
          </View>
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}
            disabled={isCreating}
          >
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>

          <Button
            title={isCreating ? 'Création...' : 'Créer'}
            onPress={handleCreate}
            disabled={isCreating || !name.trim() || !description.trim()}
            style={styles.createButton}
          />
        </View>
      </View>
    </SimpleBottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  title: {
    ...theme.fonts.subtitle,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.lg,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  switchLabel: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  switchText: {
    ...theme.fonts.body,
    fontWeight: '600',
  },
  switchDescription: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    ...theme.fonts.button,
    color: theme.colors.textSecondary,
  },
  createButton: {
    flex: 1,
  },
});