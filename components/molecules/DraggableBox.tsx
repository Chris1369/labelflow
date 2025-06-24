import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
  PinchGestureHandlerGestureEvent,
  RotationGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '../../types/theme';

interface DraggableBoxProps {
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  initialRotation: number;
  onUpdate: (x: number, y: number, width: number, height: number, rotation: number) => void;
}

export const DraggableBox: React.FC<DraggableBoxProps> = ({
  initialX,
  initialY,
  initialWidth,
  initialHeight,
  initialRotation,
  onUpdate,
}) => {
  const translateX = useSharedValue(initialX - initialWidth / 2);
  const translateY = useSharedValue(initialY - initialHeight / 2);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(initialRotation);
  const width = useSharedValue(initialWidth);
  const height = useSharedValue(initialHeight);

  const panGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      const centerX = translateX.value + width.value / 2;
      const centerY = translateY.value + height.value / 2;
      onUpdate(centerX, centerY, width.value, height.value, rotation.value);
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onStart: (_, ctx: any) => {
      ctx.startScale = scale.value;
      ctx.startWidth = width.value;
      ctx.startHeight = height.value;
    },
    onActive: (event, ctx) => {
      scale.value = ctx.startScale * event.scale;
      width.value = ctx.startWidth * event.scale;
      height.value = ctx.startHeight * event.scale;
    },
    onEnd: () => {
      scale.value = withSpring(1);
      const centerX = translateX.value + width.value / 2;
      const centerY = translateY.value + height.value / 2;
      onUpdate(centerX, centerY, width.value, height.value, rotation.value);
    },
  });

  const rotationGestureHandler = useAnimatedGestureHandler<RotationGestureHandlerGestureEvent>({
    onStart: (_, ctx: any) => {
      ctx.startRotation = rotation.value;
    },
    onActive: (event, ctx) => {
      rotation.value = ctx.startRotation + event.rotation;
    },
    onEnd: () => {
      const centerX = translateX.value + width.value / 2;
      const centerY = translateY.value + height.value / 2;
      onUpdate(centerX, centerY, width.value, height.value, rotation.value);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}rad` },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Animated.View>
        <RotationGestureHandler onGestureEvent={rotationGestureHandler}>
          <Animated.View>
            <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
              <Animated.View style={[styles.box, animatedStyle]}>
                <View style={styles.corner} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </RotationGestureHandler>
      </Animated.View>
    </PanGestureHandler>
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