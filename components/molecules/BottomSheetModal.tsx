import React, { useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
} from 'react-native';
import GorhomBottomSheetModal, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { theme } from '@/types/theme';

interface BottomSheetModalProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  enablePanDownToClose?: boolean;
  keyboardBehavior?: 'interactive' | 'fillParent' | 'extend';
  keyboardBlurBehavior?: 'none' | 'restore';
  onDismiss?: () => void;
}

export interface BottomSheetModalRef {
  present: () => void;
  dismiss: () => void;
  close: () => void;
}

export const BottomSheetModal = forwardRef<BottomSheetModalRef, BottomSheetModalProps>(
  ({
    children,
    snapPoints = ['90%'],
    enablePanDownToClose = true,
    keyboardBehavior = 'fillParent',
    keyboardBlurBehavior = 'none',
    onDismiss,
  }, ref) => {
    const bottomSheetModalRef = useRef<GorhomBottomSheetModal>(null);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      present: () => {
        // Dismiss keyboard on Android to prevent layout issues
        if (keyboardBehavior !== 'interactive') {
          Keyboard.dismiss();
        }
        bottomSheetModalRef.current?.present();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
      },
      close: () => {
        bottomSheetModalRef.current?.close();
      },
    }));

    // Render backdrop
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <GorhomBottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior={keyboardBlurBehavior}
        android_keyboardInputMode="adjustResize"
        handleIndicatorStyle={styles.handle}
        backgroundStyle={styles.background}
      >
        <View style={styles.content}>
          {children}
        </View>
      </GorhomBottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  handle: {
    backgroundColor: theme.colors.border,
    width: 40,
    height: 4,
  },
  content: {
    flex: 1,
  },
});