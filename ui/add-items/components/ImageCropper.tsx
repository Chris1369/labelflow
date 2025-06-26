import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions, Alert, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import * as ImageManipulator from 'expo-image-manipulator';

interface ImageCropperProps {
  imageUri: string;
  onConfirm: (croppedUri: string) => void;
  onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageUri, onConfirm, onCancel }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageViewSize, setImageViewSize] = useState({ width: 0, height: 0 });
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const cropperSize = Math.min(screenWidth * 0.9, screenHeight * 0.5);

  const handleImageLoad = (event: any) => {
    const { width, height } = event.nativeEvent.source;
    setImageSize({ width, height });
  };

  const handleImageLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setImageViewSize({ width, height });
  };

  const handleConfirm = async () => {
    try {
      if (imageSize.width === 0 || imageSize.height === 0) return;

      // For simplicity, we'll crop from the center of the image
      const smallerDimension = Math.min(imageSize.width, imageSize.height);
      const cropX = (imageSize.width - smallerDimension) / 2;
      const cropY = (imageSize.height - smallerDimension) / 2;

      // Crop to square and resize
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: Math.round(cropX),
              originY: Math.round(cropY),
              width: Math.round(smallerDimension),
              height: Math.round(smallerDimension)
            }
          },
          { resize: { width: 640, height: 640 } }
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      onConfirm(result.uri);
    } catch (error) {
      console.error('Error cropping image:', error);
      Alert.alert('Erreur', 'Impossible de recadrer l\'image');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          onLoad={handleImageLoad}
          onLayout={handleImageLayout}
          resizeMode="contain"
        />
        
        {/* Overlay with center crop area */}
        <View style={styles.overlayContainer} pointerEvents="none">
          {/* Top overlay */}
          <View style={[styles.overlay, { height: (screenHeight - cropperSize) / 2 }]} />
          
          {/* Middle row */}
          <View style={styles.middleRow}>
            {/* Left overlay */}
            <View style={[styles.overlay, { width: (screenWidth - cropperSize) / 2 }]} />
            
            {/* Crop area */}
            <View style={[styles.cropArea, { width: cropperSize, height: cropperSize }]}>
              <View style={styles.cropBorder} />
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>
            
            {/* Right overlay */}
            <View style={[styles.overlay, { width: (screenWidth - cropperSize) / 2 }]} />
          </View>
          
          {/* Bottom overlay */}
          <View style={[styles.overlay, { height: (screenHeight - cropperSize) / 2 }]} />
        </View>

        <Text style={styles.infoText}>
          L'image sera recadrée depuis le centre
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Ionicons name="close" size={28} color={theme.colors.textSecondary} />
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Ionicons name="checkmark" size={28} color={theme.colors.secondary} />
          <Text style={[styles.buttonText, { color: theme.colors.secondary }]}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  cropArea: {
    position: 'relative',
  },
  cropBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: theme.colors.secondary,
  },
  cornerTopLeft: {
    top: -1,
    left: -1,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTopRight: {
    top: -1,
    right: -1,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  infoText: {
    position: 'absolute',
    bottom: 20,
    color: theme.colors.secondary,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});