import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  TextStyle,
} from 'react-native';
import { Input, Button } from '@/components/atoms';
import { SimpleBottomSheet } from '@/components/molecules';
import { theme } from '@/types/theme';
import { categoryAPI } from '@/api/category.api';
import { useCategoriesStore } from '../useStore';

export interface CreateCategoryBottomSheetRef {
  open: () => void;
  close: () => void;
}

export const CreateCategoryBottomSheet = forwardRef<CreateCategoryBottomSheetRef>((_, ref) => {
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
      Alert.alert('Erreur', 'Veuillez entrer un nom pour la catégorie');
      return;
    }

    setIsCreating(true);
    try {
      await categoryAPI.create({
        name: name.trim(),
        isPublic,
      });

      // Refresh categories list
      useCategoriesStore.getState().refreshCategories?.();

      // Reset form and close
      setName('');
      setIsPublic(false);
      setIsVisible(false);

      Alert.alert('Succès', 'Catégorie créée avec succès');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de créer la catégorie');
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
      height="70%"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Nouvelle catégorie</Text>
          <Text style={styles.subtitle}>
            Organisez vos labels par catégories
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Nom de la catégorie"
            value={name}
            onChangeText={setName}
            containerStyle={styles.input}
            autoFocus
          />

          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchText}>Rendre publique</Text>
              <Text style={styles.switchDescription}>
                Les autres utilisateurs pourront voir cette catégorie
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
  header: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  title: {
    ...theme.fonts.subtitle,
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  subtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  } as TextStyle,
  form: {
    flex: 1,
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
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  switchDescription: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  } as TextStyle,
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
  } as TextStyle,
  createButton: {
    flex: 1,
  },
});