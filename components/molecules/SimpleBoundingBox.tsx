import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../types/theme';

interface SimpleBoundingBoxProps {
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  initialRotation: number;
  onUpdate: (x: number, y: number, width: number, height: number, rotation: number) => void;
}

export const SimpleBoundingBox: React.FC<SimpleBoundingBoxProps> = ({
  initialX,
  initialY,
  initialWidth,
  initialHeight,
  initialRotation,
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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Pan responder for moving the box
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setDragStart({ x: position.x, y: position.y });
    },
    onPanResponderMove: (evt, gestureState) => {
      setPosition({
        x: dragStart.x + gestureState.dx,
        y: dragStart.y + gestureState.dy,
      });
    },
    onPanResponderRelease: () => {
      onUpdate(position.x, position.y, size.width, size.height, rotation);
    },
  });

  // Create pan responder for each resize handle
  const createResizeHandler = (handle: string) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Store initial size
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        let newWidth = size.width;
        let newHeight = size.height;

        switch (handle) {
          case 'se': // Southeast (bottom-right)
            newWidth = Math.max(50, initialWidth + dx);
            newHeight = Math.max(50, initialHeight + dy);
            break;
          case 'sw': // Southwest (bottom-left)
            newWidth = Math.max(50, initialWidth - dx);
            newHeight = Math.max(50, initialHeight + dy);
            break;
          case 'ne': // Northeast (top-right)
            newWidth = Math.max(50, initialWidth + dx);
            newHeight = Math.max(50, initialHeight - dy);
            break;
          case 'nw': // Northwest (top-left)
            newWidth = Math.max(50, initialWidth - dx);
            newHeight = Math.max(50, initialHeight - dy);
            break;
        }

        setSize({ width: newWidth, height: newHeight });
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
  };

  return (
    <>
      {/* Main box */}
      <View style={[styles.box, boxStyle]} {...panResponder.panHandlers}>
        {/* Border visual */}
        <View style={styles.boxBorder} />
        
        {/* Resize handles */}
        <View {...createResizeHandler('nw').panHandlers} style={[styles.handle, styles.nw]}>
          <View style={styles.handleDot} />
        </View>
        <View {...createResizeHandler('ne').panHandlers} style={[styles.handle, styles.ne]}>
          <View style={styles.handleDot} />
        </View>
        <View {...createResizeHandler('sw').panHandlers} style={[styles.handle, styles.sw]}>
          <View style={styles.handleDot} />
        </View>
        <View {...createResizeHandler('se').panHandlers} style={[styles.handle, styles.se]}>
          <View style={styles.handleDot} />
        </View>
      </View>

      {/* Rotation controls - Fixed position on screen */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.rotationButton}
          onPress={() => handleRotate('left')}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={24} color={theme.colors.secondary} style={{ transform: [{ scaleX: -1 }] }} />
          <Text style={styles.rotationButtonText}>-15°</Text>
        </TouchableOpacity>
        
        <View style={styles.rotationInfo}>
          <Text style={styles.rotationText}>{rotation}°</Text>
        </View>
        
        <TouchableOpacity
          style={styles.rotationButton}
          onPress={() => handleRotate('right')}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={24} color={theme.colors.secondary} />
          <Text style={styles.rotationButtonText}>+15°</Text>
        </TouchableOpacity>
      </View>

      {/* Size info */}
      <View style={styles.sizeInfo}>
        <Text style={styles.sizeText}>{Math.round(size.width)} × {Math.round(size.height)}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
  },
  boxBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
  },
  handle: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleDot: {
    width: 20,
    height: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  nw: {
    top: -20,
    left: -20,
  },
  ne: {
    top: -20,
    right: -20,
  },
  sw: {
    bottom: -20,
    left: -20,
  },
  se: {
    bottom: -20,
    right: -20,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  rotationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.sm,
  },
  rotationButtonText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  rotationInfo: {
    paddingHorizontal: theme.spacing.lg,
  },
  rotationText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
  sizeInfo: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    left: '50%',
    transform: [{ translateX: -50 }],
  },
  sizeText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
});