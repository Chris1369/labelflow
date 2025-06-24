import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { theme } from '../../types/theme';

interface SimpleDraggableBoxProps {
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  onUpdate: (x: number, y: number, width: number, height: number) => void;
}

export const SimpleDraggableBox: React.FC<SimpleDraggableBoxProps> = ({
  initialX,
  initialY,
  initialWidth,
  initialHeight,
  onUpdate,
}) => {
  const [position, setPosition] = useState({
    x: initialX - initialWidth / 2,
    y: initialY - initialHeight / 2,
  });
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Gesture started
      },
      onPanResponderMove: (evt, gestureState) => {
        setPosition({
          x: initialX - initialWidth / 2 + gestureState.dx,
          y: initialY - initialHeight / 2 + gestureState.dy,
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        const newX = initialX + gestureState.dx;
        const newY = initialY + gestureState.dy;
        onUpdate(newX, newY, size.width, size.height);
      },
    })
  ).current;

  return (
    <View
      style={[
        styles.box,
        {
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.corner} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    top: -6,
    left: -6,
  },
  topRight: {
    left: undefined,
    right: -6,
  },
  bottomLeft: {
    top: undefined,
    bottom: -6,
  },
  bottomRight: {
    top: undefined,
    bottom: -6,
    left: undefined,
    right: -6,
  },
});