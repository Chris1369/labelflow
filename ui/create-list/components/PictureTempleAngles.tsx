import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import { useStore } from '../useStore';
import { CAPTURE_TEMPLATES } from '@/constants/CapturesTemplates';

interface PictureTempleAnglesProps {
  onAddImagesByAngle: (angle: string) => void;
  onRemoveImageByAngle: (angle: string, index: number) => void;
}

export const PictureTempleAngles: React.FC<PictureTempleAnglesProps> = ({
  onAddImagesByAngle,
  onRemoveImageByAngle,
}) => {
  const { listImageTemplate, selectedImagesByAngle } = useStore();
  const selectedImageTemplate = CAPTURE_TEMPLATES.find(
    (template) => template.id === listImageTemplate
  );
  const angles = selectedImageTemplate?.angles;

  return angles?.map((angle, index) => {
    const angleSelectedImages = selectedImagesByAngle[angle.position] || [];

    return (
      <View key={`${index}`} style={styles.imagesSection}>
        <Text style={styles.sectionTitle}>
          {angle.description} ({angleSelectedImages.length}/{angle.count})
        </Text>

        <View style={styles.imageGrid}>
          {angleSelectedImages.map((uri, index) => (
            <View key={`${index}`} style={styles.imageCard}>
              <Image source={{ uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemoveImageByAngle(angle.position, index)}
                disabled={false}
              >
                <Ionicons
                  name='close'
                  size={20}
                  color={theme.colors.secondary}
                />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addImageCard}
            onPress={() => onAddImagesByAngle(angle.position)}
            disabled={false}
          >
            {false ? (
              <ActivityIndicator size='small' color={theme.colors.primary} />
            ) : (
              <>
                <Ionicons name='add' size={32} color={theme.colors.primary} />
                <Text style={styles.addImageText}>Ajouter</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  });
};

const styles = StyleSheet.create({
  imagesSection: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.fonts.body,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs, // Compense les marges des cartes
  },
  imageCard: {
    width: 106, // Dimensions fixes
    height: 106, // Dimensions fixes
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageCard: {
    width: 106, // Dimensions fixes
    height: 106, // Dimensions fixes
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
  },
  addImageText: {
    ...theme.fonts.caption,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
});
