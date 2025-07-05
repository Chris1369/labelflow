import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '@/types/theme';

interface ProcessingOverlayProps {
  visible: boolean;
  progress: number; // 0-100
  currentImage: number;
  totalImages: number;
  message?: string;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  visible,
  progress,
  currentImage,
  totalImages,
  message = "Traitement des images...",
}) => {
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <BlurView intensity={80} style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
          
          <Text style={styles.title}>{message}</Text>
          
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {currentImage}/{totalImages} images
            </Text>
            <Text style={styles.percentText}>{Math.round(progress)}%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                { width: progressWidth }
              ]}
            />
          </View>
          
          <Text style={styles.detailText}>
            {currentImage === 0 
              ? "Préparation..." 
              : currentImage < totalImages 
                ? "Redimensionnement et optimisation"
                : "Finalisation..."
            }
          </Text>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '85%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    ...theme.fonts.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  percentText: {
    ...theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  detailText: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});