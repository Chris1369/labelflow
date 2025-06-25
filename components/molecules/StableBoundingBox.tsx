import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Text,
} from "react-native";
import { theme } from "../../types/theme";

interface StableBoundingBoxProps {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotation: number;
  isSelected?: boolean;
  isComplete?: boolean;
  onUpdate: (
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
  ) => void;
}

const HANDLE_SIZE = 40;

export const StableBoundingBox: React.FC<StableBoundingBoxProps> = ({
  centerX,
  centerY,
  width,
  height,
  rotation,
  isSelected = false,
  isComplete = false,
  onUpdate,
}) => {
  // Store gesture start values and current dimensions
  const gestureStart = useRef({
    box: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    rotation: 0,
    angle: 0,
  });
  
  // Store current dimensions and position to preserve them during drag
  const currentDimensions = useRef({ width, height, rotation });
  const currentPosition = useRef({ x: centerX, y: centerY });
  const isSelectedRef = useRef(isSelected);
  
  // Update stored dimensions when props change
  React.useEffect(() => {
    currentDimensions.current = { width, height, rotation };
  }, [width, height, rotation]);
  
  // Update stored position when props change
  React.useEffect(() => {
    currentPosition.current = { x: centerX, y: centerY };
  }, [centerX, centerY]);
  
  // Update selected state ref
  React.useEffect(() => {
    isSelectedRef.current = isSelected;
  }, [isSelected]);

  // Pan responder for moving the box
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (!isSelectedRef.current) return false;
        gestureStart.current.box = { x: currentPosition.current.x, y: currentPosition.current.y };
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isSelectedRef.current) return;
        const newX = gestureStart.current.box.x + gestureState.dx;
        const newY = gestureStart.current.box.y + gestureState.dy;
        currentPosition.current = { x: newX, y: newY };
        onUpdate(
          newX, 
          newY, 
          currentDimensions.current.width, 
          currentDimensions.current.height, 
          currentDimensions.current.rotation
        );
      },
      onPanResponderRelease: () => {
        // Gesture ended
      },
    })
  ).current;

  // Pan responder for SE corner (resize)
  const seResizeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (!isSelectedRef.current) return false;
        gestureStart.current.size = { 
          width: currentDimensions.current.width, 
          height: currentDimensions.current.height 
        };
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isSelectedRef.current) return;
        
        // Convert gesture movement to local coordinates considering rotation
        const rotation = currentDimensions.current.rotation * Math.PI / 180;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        
        // Transform dx, dy to local space
        const localDx = gestureState.dx * cos + gestureState.dy * sin;
        const localDy = -gestureState.dx * sin + gestureState.dy * cos;
        
        const newWidth = Math.max(50, gestureStart.current.size.width + localDx);
        const newHeight = Math.max(50, gestureStart.current.size.height + localDy);
        
        currentDimensions.current.width = newWidth;
        currentDimensions.current.height = newHeight;
        onUpdate(currentPosition.current.x, currentPosition.current.y, newWidth, newHeight, currentDimensions.current.rotation);
      },
      onPanResponderRelease: () => {
        // Gesture ended
      },
    })
  ).current;

  // Pan responder for NW corner (resize)
  const nwResizeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (!isSelectedRef.current) return false;
        gestureStart.current.box = { x: currentPosition.current.x, y: currentPosition.current.y };
        gestureStart.current.size = { 
          width: currentDimensions.current.width, 
          height: currentDimensions.current.height 
        };
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isSelectedRef.current) return;
        
        // Convert gesture movement to local coordinates considering rotation
        const rotation = currentDimensions.current.rotation * Math.PI / 180;
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        
        // Transform dx, dy to local space
        const localDx = gestureState.dx * cos + gestureState.dy * sin;
        const localDy = -gestureState.dx * sin + gestureState.dy * cos;
        
        const newWidth = Math.max(50, gestureStart.current.size.width - localDx);
        const newHeight = Math.max(50, gestureStart.current.size.height - localDy);
        
        // Calculate new position (center moves when resizing from NW)
        const deltaWidth = newWidth - gestureStart.current.size.width;
        const deltaHeight = newHeight - gestureStart.current.size.height;
        
        // Transform position change back to world space
        const positionDx = (-deltaWidth / 2) * cos - (-deltaHeight / 2) * sin;
        const positionDy = (-deltaWidth / 2) * sin + (-deltaHeight / 2) * cos;
        
        const newX = gestureStart.current.box.x + positionDx;
        const newY = gestureStart.current.box.y + positionDy;
        
        currentDimensions.current.width = newWidth;
        currentDimensions.current.height = newHeight;
        currentPosition.current = { x: newX, y: newY };
        onUpdate(newX, newY, newWidth, newHeight, currentDimensions.current.rotation);
      },
      onPanResponderRelease: () => {
        // Gesture ended
      },
    })
  ).current;

  // Pan responder for rotation (NE corner)
  const rotateResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (!isSelectedRef.current) return false;
        gestureStart.current.rotation = currentDimensions.current.rotation;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isSelectedRef.current) return;
        
        // Calculate rotation based on gesture movement
        // Use horizontal movement for more intuitive rotation
        const rotationSpeed = 0.5; // degrees per pixel
        const deltaRotation = gestureState.dx * rotationSpeed;
        
        let newRotation = gestureStart.current.rotation + deltaRotation;
        
        // Normalize rotation to 0-360 range
        while (newRotation < 0) newRotation += 360;
        while (newRotation >= 360) newRotation -= 360;
        
        currentDimensions.current.rotation = newRotation;
        onUpdate(
          currentPosition.current.x, 
          currentPosition.current.y, 
          currentDimensions.current.width, 
          currentDimensions.current.height, 
          newRotation
        );
      },
      onPanResponderRelease: () => {
        // Gesture ended
      },
    })
  ).current;

  const boxStyle = {
    position: "absolute" as const,
    left: centerX - width / 2,
    top: centerY - height / 2,
    width: width,
    height: height,
    transform: [{ rotate: `${rotation}deg` }],
  };

  return (
    <>
      {/* Main box */}
      <View style={boxStyle}>
        {/* Draggable area */}
        <View style={styles.boxContent} {...panResponder.panHandlers}>
          <View style={[
            styles.boxBorder,
            isComplete ? styles.completeBorder : (isSelected ? styles.selectedBorder : styles.unselectedBorder)
          ]} />
        </View>

        {/* NW Handle - only show when selected */}
        {isSelected && (
          <View
            style={[styles.handle, styles.nw]}
            {...nwResizeResponder.panHandlers}
          >
            <View style={styles.handleDot} />
          </View>
        )}

        {/* SE Handle - only show when selected */}
        {isSelected && (
          <View
            style={[styles.handle, styles.se]}
            {...seResizeResponder.panHandlers}
          >
            <View style={styles.handleDot} />
          </View>
        )}

        {/* NE Handle for rotation - only show when selected */}
        {isSelected && (
          <View
            style={[styles.handle, styles.ne]}
            {...rotateResponder.panHandlers}
          >
            <View style={[styles.handleDot, styles.rotateHandleDot]} />
          </View>
        )}
      </View>

      {/* Size and rotation display - only show when selected */}
      {isSelected && (
        <View style={styles.sizeInfo}>
          <Text style={styles.sizeText}>
            {Math.round(width)} × {Math.round(height)}
          </Text>
          <Text style={styles.rotationText}>
            {Math.round(rotation)}°
          </Text>
        </View>
      )}
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
  selectedBorder: {
    borderColor: theme.colors.primary,
    borderStyle: 'solid',
  },
  unselectedBorder: {
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  completeBorder: {
    borderColor: '#4CAF50',
    borderStyle: 'solid',
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
    backgroundColor: theme.colors.secondary,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  nw: {
    top: -HANDLE_SIZE / 2,
    left: -HANDLE_SIZE / 2,
  },
  se: {
    bottom: -HANDLE_SIZE / 2,
    right: -HANDLE_SIZE / 2,
  },
  ne: {
    top: -HANDLE_SIZE / 2,
    right: -HANDLE_SIZE / 2,
  },
  rotateHandleDot: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
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
  rotationText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.sm,
    fontWeight: "500",
    marginTop: 2,
  },
});