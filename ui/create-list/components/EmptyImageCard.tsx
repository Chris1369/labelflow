import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';

interface EmptyImageCardProps {
  isCreating: boolean;
  isSelectingImages: boolean;
  onPress: () => void;
  hasTemplate?: boolean;
}

export const EmptyImageCard: React.FC<EmptyImageCardProps> = ({ isCreating, isSelectingImages, onPress, hasTemplate = true }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isSelectingImages) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isSelectingImages]);

  return (
    <TouchableOpacity 
      style={[
        styles.firstImageCard,
        !hasTemplate && styles.firstImageCardNoTemplate
      ]}
      onPress={onPress}
      disabled={isCreating || isSelectingImages}
      activeOpacity={0.8}
    >
      {isSelectingImages ? (
        <Animated.View style={[styles.loadingContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.loaderCircle}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
          <Text style={styles.loadingTitle}>
            Traitement des images...
          </Text>
          <Text style={styles.loadingSubtitle}>
            Optimisation et redimensionnement en cours
          </Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </Animated.View>
      ) : (
        <View style={styles.uploadContainer}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name="cloud-upload-outline" 
              size={48} 
              color={!hasTemplate ? theme.colors.textSecondary : theme.colors.primary} 
            />
            <View style={styles.plusIcon}>
              <Ionicons 
                name="add-circle" 
                size={24} 
                color={!hasTemplate ? theme.colors.textSecondary : theme.colors.primary} 
              />
            </View>
          </View>
          <Text style={styles.firstImageTitle}>Ajouter des images</Text>
          {!hasTemplate ? (
            <>
              <Text style={styles.warningHint}>
                Sélectionnez d'abord un template ci-dessus
              </Text>
              <View style={styles.warningBadge}>
                <Ionicons name="information-circle" size={16} color={theme.colors.warning} />
                <Text style={styles.warningBadgeText}>Template requis</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.firstImageHint}>
                Sélectionnez ou glissez vos images ici
              </Text>
              <View style={styles.infoRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.success} />
                <Text style={styles.infoText}>Format: JPG, PNG</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.success} />
                <Text style={styles.infoText}>Redimensionnement automatique</Text>
              </View>
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  firstImageCard: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.xl * 1.5,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
    borderStyle: 'dashed',
    backgroundColor: theme.colors.primary + '05',
    alignItems: 'center',
    minHeight: 240,
    justifyContent: 'center',
  },
  uploadContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  plusIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  firstImageTitle: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  firstImageHint: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  loaderCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  loadingTitle: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  loadingSubtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  progressBar: {
    width: '60%',
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '40%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  firstImageCardNoTemplate: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary + '50',
  },
  warningHint: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.warning + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  warningBadgeText: {
    ...theme.fonts.caption,
    color: theme.colors.warning,
    fontWeight: '600',
  },
});