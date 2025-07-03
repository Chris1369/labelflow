import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/components/atoms/Button';
import { theme } from '@/types/theme';
import { useStore } from '../useStore';
import { CAPTURE_TEMPLATES } from '@/constants/CapturesTemplates';

interface BottomActionButtonProps {
  mode: 'create' | 'add';
  isCreating: boolean;
  hasImages: boolean;
  onPress: () => void;
}

export const BottomActionButton: React.FC<BottomActionButtonProps> = ({
  mode,
  isCreating,
  hasImages,
  onPress,
}) => {

  const { listImageTemplate, selectedImagesByAngle } = useStore();
  const selectedImageTemplate = CAPTURE_TEMPLATES.find(template => template.id === listImageTemplate);

  const hasOneAngleSelected = selectedImageTemplate?.angles.some((angle) => {
    const images = selectedImagesByAngle[angle.position] || [];
    return images.length > 0;
  });

  if (selectedImageTemplate && !hasOneAngleSelected) return null;
  if (!selectedImageTemplate && !hasImages) {
    return null;
  }

  const getButtonTitle = () => {
    if (isCreating) {
      return mode === 'add' ? "Ajout..." : "Création...";
    }
    return mode === 'add' ? "Ajouter les images" : "Créer la liste";
  };

  return (
    <View style={styles.bottomContainer}>
      <Button
        title={getButtonTitle()}
        onPress={onPress}
        disabled={isCreating || (!hasImages && !selectedImageTemplate) || (selectedImageTemplate && !hasOneAngleSelected)}
        style={styles.createButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  createButton: {
    width: '100%',
  },
});