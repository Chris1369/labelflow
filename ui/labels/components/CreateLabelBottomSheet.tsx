import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Input, Button } from '@/components/atoms';
import { SimpleBottomSheet } from '@/components/molecules';
import { theme } from '@/types/theme';
import { labelAPI } from '@/api/label.api';
import { useLabelsStore } from '../useStore';

export interface CreateLabelBottomSheetRef {
  open: () => void;
  close: () => void;
}

export const CreateLabelBottomSheet = forwardRef<CreateLabelBottomSheetRef>((_, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsVisible(true);
      setName('');
      setIsPublic(false);
    },
    close: () => setIsVisible(false),
  }));

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom pour le label');
      return;
    }

    setIsCreating(true);
    try {
      await labelAPI.create({
        name: name.trim(),
        isPublic,
      });

      // Refresh labels list
      await useLabelsStore.getState().refreshLabels?.();

      // Reset form and close
      setName('');
      setIsPublic(false);
      setIsVisible(false);

      Alert.alert('Succès', 'Label créé avec succès');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de créer le label');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SimpleBottomSheet
      visible={isVisible}
      onClose={() => setIsVisible(false)}
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
            <Text style={styles.title}>Nouveau label</Text>
            <Text style={styles.subtitle}>
              Créez un label pour catégoriser vos éléments
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              placeholder="Nom du label"
              value={name}
              onChangeText={setName}
              containerStyle={styles.input}
              autoFocus
            />

            <View style={styles.switchContainer}>
              <View style={styles.switchLabel}>
                <Text style={styles.switchText}>Rendre public</Text>
                <Text style={styles.switchDescription}>
                  Les autres utilisateurs pourront voir ce label
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
            onPress={() => setIsVisible(false)}
            disabled={isCreating}
          >
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>

          <Button
            title={isCreating ? 'Création...' : 'Créer'}
            onPress={handleCreate}
            disabled={isCreating || !name.trim()}
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
    fontSize: theme.fonts.caption.fontSize,
    fontWeight: theme.fonts.caption.fontWeight as '400',
    lineHeight: theme.fonts.caption.lineHeight,
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
    fontSize: theme.fonts.button.fontSize,
    fontWeight: theme.fonts.button.fontWeight as '600',
    lineHeight: theme.fonts.button.lineHeight,
    color: theme.colors.textSecondary,
  },
  createButton: {
    flex: 1,
  },
});