import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Animated, ImageStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';

interface ImageGridProps {
  selectedImages: string[];
  existingImagesSelected: string[];
  isCreating: boolean;
  isSelectingImages: boolean;
  onRemoveImage: (index: number) => void;
  onAddImages: () => void;
  onLongPress?: () => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  selectedImages,
  existingImagesSelected,
  isCreating,
  isSelectingImages,
  onRemoveImage,
  onAddImages,
  onLongPress,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const combinedImages = [
    ...existingImagesSelected.map(uri => ({ uri, isValidated: true })),
    ...selectedImages.map(uri => ({ uri, isValidated: false }))
  ];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedImages.length]);

  return (
    <View style={styles.imagesSection}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>
          Images sélectionnées
        </Text>
        <View style={styles.counter}>
          <Text style={styles.counterText}>{combinedImages.length}</Text>
        </View>
      </View>

      <View style={styles.imageGrid}>
        {combinedImages.map(({ uri, isValidated }, index) => {

          if (isValidated) {
            return (
              <View style={styles.imageCard}>
                <Image source={{ uri }} style={styles.imagePreview as ImageStyle} />
                <View style={styles.validatedOverlay}>
                  <Ionicons name='lock-closed' size={16} color='white' />
                  <View style={styles.imageNumber}>
                    <Text style={styles.imageNumberText}>{index + 1}</Text>
                  </View>
                </View>
              </View>
            )
          }

          return (
            <Animated.View
              key={index}
              style={[
                styles.imageCard,
                {
                  opacity: fadeAnim,
                  transform: [{
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  }],
                },
              ]}
            >
              <Image source={{ uri }} style={styles.imagePreview} />
              <View style={styles.imageOverlay}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => onRemoveImage(index)}
                  disabled={isCreating}
                >
                  <Ionicons name="close-circle" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.imageNumber}>
                <Text style={styles.imageNumberText}>{index + 1}</Text>
              </View>
            </Animated.View>
          )
        })}

        <TouchableOpacity
          style={[
            styles.addImageCard,
            (isCreating || isSelectingImages) && styles.addImageCardDisabled
          ]}
          onPress={onAddImages}
          onLongPress={onLongPress}
          disabled={isCreating || isSelectingImages}
          activeOpacity={0.7}
          delayLongPress={500}
        >
          {isSelectingImages ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.loadingText as TextStyle}>Chargement...</Text>
            </View>
          ) : (
            <View style={styles.addContent}>
              <View style={styles.addIconContainer}>
                <Ionicons name="add-circle-outline" size={32} color={theme.colors.primary} />
              </View>
              <Text style={styles.addImageText}>Ajouter</Text>
              <Text style={styles.addImageHint as TextStyle}>Appuyer</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imagesSection: {
    marginTop: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.fonts.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  counter: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.sm,
    minWidth: 28,
    alignItems: 'center',
  },
  counterText: {
    ...theme.fonts.caption,
    color: 'white',
    fontWeight: '600',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  imageCard: {
    width: 106,
    height: 106,
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.colors.backgroundSecondary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  removeButton: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNumber: {
    position: 'absolute',
    bottom: theme.spacing.xs,
    left: theme.spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  imageNumberText: {
    ...theme.fonts.caption,
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  addImageCard: {
    width: 106,
    height: 106,
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary + '40',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '08',
  },
  addImageCardDisabled: {
    opacity: 0.5,
  },
  addContent: {
    alignItems: 'center',
  },
  addIconContainer: {
    marginBottom: theme.spacing.xs / 2,
  },
  addImageText: {
    ...theme.fonts.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  addImageHint: {
    ...theme.fonts.caption,
    color: theme.colors.primary + '80',
    fontSize: 10,
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    ...theme.fonts.caption,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    fontSize: 11,
  },
  validatedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});