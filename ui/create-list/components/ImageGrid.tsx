import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';

interface ImageGridProps {
  selectedImages: string[];
  isCreating: boolean;
  onRemoveImage: (index: number) => void;
  onAddImages: () => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  selectedImages,
  isCreating,
  onRemoveImage,
  onAddImages,
}) => {
  return (
    <View style={styles.imagesSection}>
      <Text style={styles.sectionTitle}>
        Images sélectionnées ({selectedImages.length})
      </Text>
      
      <View style={styles.imageGrid}>
        {selectedImages.map((uri, index) => (
          <View key={index} style={styles.imageCard}>
            <Image source={{ uri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemoveImage(index)}
              disabled={isCreating}
            >
              <Ionicons name="close" size={20} color={theme.colors.secondary} />
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.addImageCard}
          onPress={onAddImages}
          disabled={isCreating}
        >
          <Ionicons name="add" size={32} color={theme.colors.primary} />
          <Text style={styles.addImageText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
    justifyContent: 'space-between',
  },
  imageCard: {
    width: 106, // Dimensions fixes
    height: 106, // Dimensions fixes
    marginBottom: theme.spacing.md,
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