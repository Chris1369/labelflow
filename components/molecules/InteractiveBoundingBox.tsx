import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../types/theme';
import { getLabelColor } from '@/helpers/labelColors';

interface InteractiveBoundingBoxProps {
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  initialRotation: number;
  label?: string;
  onUpdate: (x: number, y: number, width: number, height: number, rotation: number) => void;
}

export const InteractiveBoundingBox: React.FC<InteractiveBoundingBoxProps> = ({
  initialX,
  initialY,
  initialWidth,
  initialHeight,
  initialRotation,
  label,
  onUpdate,
}) => {
  const [position, setPosition] = useState({
    x: initialX,
    y: initialY,
  });
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [rotation, setRotation] = useState(initialRotation);
  
  // Get color based on label
  const boxColor = getLabelColor(label);

  // Pan responder for moving the box
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      setPosition({
        x: initialX + gestureState.dx,
        y: initialY + gestureState.dy,
      });
    },
    onPanResponderRelease: (evt, gestureState) => {
      const newX = initialX + gestureState.dx;
      const newY = initialY + gestureState.dy;
      setPosition({ x: newX, y: newY });
      onUpdate(newX, newY, size.width, size.height, rotation);
    },
  });

  // Handlers for resize corners
  const handleResize = (corner: 'tl' | 'tr' | 'bl' | 'br') => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        switch (corner) {
          case 'tl':
            newWidth = initialWidth - gestureState.dx;
            newHeight = initialHeight - gestureState.dy;
            newX = initialX + gestureState.dx / 2;
            newY = initialY + gestureState.dy / 2;
            break;
          case 'tr':
            newWidth = initialWidth + gestureState.dx;
            newHeight = initialHeight - gestureState.dy;
            newX = initialX + gestureState.dx / 2;
            newY = initialY + gestureState.dy / 2;
            break;
          case 'bl':
            newWidth = initialWidth - gestureState.dx;
            newHeight = initialHeight + gestureState.dy;
            newX = initialX + gestureState.dx / 2;
            newY = initialY + gestureState.dy / 2;
            break;
          case 'br':
            newWidth = initialWidth + gestureState.dx;
            newHeight = initialHeight + gestureState.dy;
            newX = initialX + gestureState.dx / 2;
            newY = initialY + gestureState.dy / 2;
            break;
        }

        if (newWidth > 50 && newHeight > 50) {
          setSize({ width: newWidth, height: newHeight });
          setPosition({ x: newX, y: newY });
        }
      },
      onPanResponderRelease: () => {
        onUpdate(position.x, position.y, size.width, size.height, rotation);
      },
    });
  };

  const handleRotate = (direction: 'left' | 'right') => {
    const newRotation = rotation + (direction === 'right' ? 15 : -15);
    setRotation(newRotation);
    onUpdate(position.x, position.y, size.width, size.height, newRotation);
  };

  const boxStyle = {
    left: position.x - size.width / 2,
    top: position.y - size.height / 2,
    width: size.width,
    height: size.height,
    transform: [{ rotate: `${rotation}deg` }],
    borderColor: boxColor,
  };

  const overlayStyle = {
    backgroundColor: boxColor,
    opacity: 0.15,
  };

  const cornerStyle = {
    backgroundColor: boxColor,
  };

  return (
    <>
      <View style={[styles.box, boxStyle]} {...panResponder.panHandlers}>
        {/* Semi-transparent overlay */}
        <View style={[styles.overlay, overlayStyle]} />
        
        {/* Label text */}
        {label && (
          <View style={[styles.labelContainer, { backgroundColor: boxColor }]}>
            <Text style={styles.labelText} numberOfLines={1}>{label}</Text>
          </View>
        )}
        
        <View {...handleResize('tl').panHandlers} style={[styles.corner, styles.topLeft, cornerStyle]} />
        <View {...handleResize('tr').panHandlers} style={[styles.corner, styles.topRight, cornerStyle]} />
        <View {...handleResize('bl').panHandlers} style={[styles.corner, styles.bottomLeft, cornerStyle]} />
        <View {...handleResize('br').panHandlers} style={[styles.corner, styles.bottomRight, cornerStyle]} />
      </View>

      {/* Rotation controls */}
      <View style={styles.rotationControls}>
        <TouchableOpacity
          style={styles.rotationButton}
          onPress={() => handleRotate('left')}
        >
          <Ionicons name="rotate-left" size={24} color={theme.colors.secondary} />
        </TouchableOpacity>
        <Text style={styles.rotationText}>{rotation}°</Text>
        <TouchableOpacity
          style={styles.rotationButton}
          onPress={() => handleRotate('right')}
        >
          <Ionicons name="rotate-right" size={24} color={theme.colors.secondary} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  labelContainer: {
    position: 'absolute',
    top: -25,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  labelText: {
    color: theme.colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
  },
  topLeft: {
    top: -10,
    left: -10,
  },
  topRight: {
    top: -10,
    right: -10,
  },
  bottomLeft: {
    bottom: -10,
    left: -10,
  },
  bottomRight: {
    bottom: -10,
    right: -10,
  },
  rotationControls: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    left: '50%',
    transform: [{ translateX: -75 }],
  },
  rotationButton: {
    padding: theme.spacing.sm,
  },
  rotationText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.sm,
    marginHorizontal: theme.spacing.md,
    minWidth: 40,
    textAlign: 'center',
  },
});