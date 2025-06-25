import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Input, Button } from '@/components/atoms';
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
      await useLabelsStore.getState().refreshLabels();
      
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
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={() => setIsVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.container}>
              <View style={styles.handle} />
              
              <Text style={styles.title}>Nouveau label</Text>
              
              <Input
                placeholder="Nom du label"
                value={name}
                onChangeText={setName}
                containerStyle={styles.input}
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

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsVisible(false)}
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
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
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
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  switchDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
  },
});