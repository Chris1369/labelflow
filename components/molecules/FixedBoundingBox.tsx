import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../types/theme";

interface FixedBoundingBoxProps {
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  initialRotation: number;
  onUpdate: (
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
  ) => void;
}

const HANDLE_SIZE = 40;

export const FixedBoundingBox: React.FC<FixedBoundingBoxProps> = ({
  initialX,
  initialY,
  initialWidth,
  initialHeight,
  initialRotation,
  onUpdate,
}) => {
  const [box, setBox] = useState({
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
    rotation: initialRotation,
  });

  // Update box when props change
  React.useEffect(() => {
    setBox({
      x: initialX,
      y: initialY,
      width: initialWidth,
      height: initialHeight,
      rotation: initialRotation,
    });
  }, [initialX, initialY, initialWidth, initialHeight, initialRotation]);

  // Pan responder for moving the box
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Store current position at start
    },
    onPanResponderMove: (evt, gestureState) => {
      const newX = initialX + gestureState.dx;
      const newY = initialY + gestureState.dy;
      setBox(prev => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    },
    onPanResponderRelease: (evt, gestureState) => {
      const newX = initialX + gestureState.dx;
      const newY = initialY + gestureState.dy;
      onUpdate(newX, newY, box.width, box.height, box.rotation);
    },
  });

  // Pan responder for SE corner (resize)
  const seResizeResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newWidth = Math.max(50, initialWidth + gestureState.dx);
      const newHeight = Math.max(50, initialHeight + gestureState.dy);
      setBox(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }));
    },
    onPanResponderRelease: (evt, gestureState) => {
      const newWidth = Math.max(50, initialWidth + gestureState.dx);
      const newHeight = Math.max(50, initialHeight + gestureState.dy);
      onUpdate(box.x, box.y, newWidth, newHeight, box.rotation);
    },
  });

  // Pan responder for NW corner (resize)
  const nwResizeResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newWidth = Math.max(50, initialWidth - gestureState.dx);
      const newHeight = Math.max(50, initialHeight - gestureState.dy);
      const newX = initialX + gestureState.dx / 2;
      const newY = initialY + gestureState.dy / 2;
      setBox(prev => ({
        ...prev,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      }));
    },
    onPanResponderRelease: (evt, gestureState) => {
      const newWidth = Math.max(50, initialWidth - gestureState.dx);
      const newHeight = Math.max(50, initialHeight - gestureState.dy);
      const newX = initialX + gestureState.dx / 2;
      const newY = initialY + gestureState.dy / 2;
      onUpdate(newX, newY, newWidth, newHeight, box.rotation);
    },
  });

  const boxStyle = {
    position: "absolute" as const,
    left: box.x - box.width / 2,
    top: box.y - box.height / 2,
    width: box.width,
    height: box.height,
    transform: [{ rotate: `${box.rotation}deg` }],
  };

  return (
    <>
      {/* Main box */}
      <View style={boxStyle}>
        {/* Draggable area */}
        <View style={styles.boxContent} {...panResponder.panHandlers}>
          <View style={styles.boxBorder} />
        </View>

        {/* NW Handle */}
        <View
          style={[styles.handle, styles.nw]}
          {...nwResizeResponder.panHandlers}
        >
          <View style={styles.handleDot} />
        </View>

        {/* SE Handle */}
        <View
          style={[styles.handle, styles.se]}
          {...seResizeResponder.panHandlers}
        >
          <View style={styles.handleDot} />
        </View>
      </View>

      {/* Size display */}
      <View style={styles.sizeInfo}>
        <Text style={styles.sizeText}>
          {Math.round(box.width)} × {Math.round(box.height)}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  boxContent: {
    flex: 1,
  },
  boxBorder: {
    flex: 1,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
  },
  handle: {
    position: "absolute",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  handleDot: {
    width: 24,
    height: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: theme.colors.secondary,
  },
  nw: {
    top: -HANDLE_SIZE / 2,
    left: -HANDLE_SIZE / 2,
  },
  se: {
    bottom: -HANDLE_SIZE / 2,
    right: -HANDLE_SIZE / 2,
  },
  sizeInfo: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    left: "50%",
    transform: [{ translateX: -60 }],
  },
  sizeText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.md,
    fontWeight: "600",
  },
});