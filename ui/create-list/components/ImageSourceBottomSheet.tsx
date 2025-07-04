import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';

interface ImageSourceBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectGallery: () => void;
}

export const ImageSourceBottomSheet: React.FC<ImageSourceBottomSheetProps> = ({
  visible,
  onClose,
  onSelectCamera,
  onSelectGallery,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.container}>
          <View style={styles.handle} />
          
          <Text style={styles.title}>Ajouter des images</Text>
          <Text style={styles.subtitle}>
            Choisissez d'où viennent vos images
          </Text>

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.option}
              onPress={onSelectCamera}
              activeOpacity={0.8}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="camera" size={32} color={theme.colors.primary} />
              </View>
              <Text style={styles.optionTitle}>Prendre une photo</Text>
              <Text style={styles.optionDescription}>
                Utilisez l'appareil photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={onSelectGallery}
              activeOpacity={0.8}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="images" size={32} color={theme.colors.primary} />
              </View>
              <Text style={styles.optionTitle}>Choisir dans la galerie</Text>
              <Text style={styles.optionDescription}>
                Sélectionnez des images existantes
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.fonts.subtitle,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  options: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  option: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  optionTitle: {
    ...theme.fonts.body,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  optionDescription: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    ...theme.fonts.button,
    color: theme.colors.textSecondary,
  },
});