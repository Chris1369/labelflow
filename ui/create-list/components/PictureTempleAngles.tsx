import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated,
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
  const { listImageTemplate, selectedImagesByAngle, existingValidatedImagesByAngle, isSelectingImages, isCreating } = useStore();
  const selectedImageTemplate = CAPTURE_TEMPLATES.find(
    (template) => template.id === listImageTemplate
  );
  const angles = selectedImageTemplate?.angles;

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!angles) return null;

  return (
    <View style={styles.container}>
      <View style={styles.templateHeader}>
        <Text style={styles.templateTitle}>Organisation par angles</Text>
        <Text style={styles.templateSubtitle}>
          Template: {selectedImageTemplate?.name}
        </Text>
      </View>

      {angles.map((angle, index) => {
        const angleSelectedImages = selectedImagesByAngle[angle.position] || [];
        const existingValidatedImages = existingValidatedImagesByAngle[angle.position] || [];
        const totalSelectedImages = angleSelectedImages.length + existingValidatedImages.length;
        const progress = (totalSelectedImages / angle.count) * 100;
        const isComplete = totalSelectedImages >= angle.count;

        return (
          <Animated.View 
            key={`${angle.position}-${index}`} 
            style={[
              styles.angleSection,
              { 
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                }],
              }
            ]}
          >
            <View style={styles.angleHeader}>
              <View style={styles.angleInfo}>
                <Text style={styles.angleIcon}>{angle.icon}</Text>
                <View style={styles.angleTitleContainer}>
                  <Text style={styles.angleTitle}>{angle.description}</Text>
                  <View style={styles.angleStats}>
                    <Text style={[
                      styles.angleCount,
                      isComplete && styles.angleCountComplete
                    ]}>
                      {totalSelectedImages}/{angle.count} images
                    </Text>
                    {isComplete && (
                      <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(progress, 100)}%` },
                      isComplete && styles.progressFillComplete
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{Math.round(progress)}%</Text>
              </View>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
            >
              <View style={styles.imageGrid}>
                {/* Existing validated images (read-only) */}
                {existingValidatedImages.map((uri, imgIndex) => (
                  <View key={`existing-${imgIndex}`} style={styles.imageCard}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <View style={styles.validatedOverlay}>
                      <Ionicons name="lock-closed" size={16} color="white" />
                    </View>
                  </View>
                ))}

                {/* New selected images */}
                {angleSelectedImages.map((uri, imgIndex) => (
                  <Animated.View 
                    key={`new-${imgIndex}`} 
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
                      }
                    ]}
                  >
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => onRemoveImageByAngle(angle.position, imgIndex)}
                      disabled={isCreating}
                    >
                      <Ionicons name="close-circle" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.imageNumber}>
                      <Text style={styles.imageNumberText}>
                        {existingValidatedImages.length + imgIndex + 1}
                      </Text>
                    </View>
                  </Animated.View>
                ))}

                {/* Add button - always visible */}
                <TouchableOpacity
                  style={[
                    styles.addImageCard,
                    (isCreating || isSelectingImages) && styles.addImageCardDisabled,
                    isComplete && styles.addImageCardComplete
                  ]}
                  onPress={() => onAddImagesByAngle(angle.position)}
                  disabled={isCreating || isSelectingImages || isComplete}
                  activeOpacity={0.7}
                >
                  {isSelectingImages ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                      <Text style={styles.loadingText}>Chargement...</Text>
                    </View>
                  ) : isComplete ? (
                    <View style={styles.addContent}>
                      <Ionicons name="checkmark-circle" size={32} color={theme.colors.success} />
                      <Text style={styles.completeText}>Complet</Text>
                    </View>
                  ) : (
                    <View style={styles.addContent}>
                      <View style={styles.addIconContainer}>
                        <Ionicons name="camera-outline" size={28} color={theme.colors.primary} />
                      </View>
                      <Text style={styles.addImageText}>Ajouter</Text>
                      <Text style={styles.remainingText}>
                        {angle.count - totalSelectedImages} restantes
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.lg,
  },
  templateHeader: {
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  templateTitle: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  templateSubtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  },
  angleSection: {
    marginBottom: theme.spacing.xl,
  },
  angleHeader: {
    marginBottom: theme.spacing.md,
  },
  angleInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  angleIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  angleTitleContainer: {
    flex: 1,
  },
  angleTitle: {
    ...theme.fonts.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  angleStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: 2,
  },
  angleCount: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  },
  angleCountComplete: {
    color: theme.colors.success,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressFillComplete: {
    backgroundColor: theme.colors.success,
  },
  progressText: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    minWidth: 35,
    textAlign: 'right',
  },
  imageScroll: {
    marginHorizontal: -theme.spacing.lg,
  },
  imageGrid: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  imageCard: {
    width: 100,
    height: 100,
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
  validatedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 100,
    height: 100,
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
  addImageCardComplete: {
    borderColor: theme.colors.success + '40',
    backgroundColor: theme.colors.success + '08',
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
  remainingText: {
    ...theme.fonts.caption,
    color: theme.colors.primary + '80',
    fontSize: 10,
    marginTop: 2,
  },
  completeText: {
    ...theme.fonts.caption,
    color: theme.colors.success,
    fontWeight: '600',
    marginTop: theme.spacing.xs / 2,
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
});