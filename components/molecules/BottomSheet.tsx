import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { theme } from '@/types/theme';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const { height: screenHeight } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
  snapPoints?: (string | number)[];
  enablePanDownToClose?: boolean;
  keyboardBehavior?: 'interactive' | 'fillParent' | 'extend';
  keyboardBlurBehavior?: 'none' | 'restore';
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  height,
  snapPoints = height ? [`${(height / screenHeight) * 100}%`] : ['90%'],
  enablePanDownToClose = true,
  keyboardBehavior = 'fillParent',
  keyboardBlurBehavior = 'none',
}) => {
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);

  // Handle opening/closing
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

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

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <BottomSheetModalProvider>
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1}
            onPress={onClose}
          />
          <GorhomBottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={0}
            enablePanDownToClose={enablePanDownToClose}
            onClose={onClose}
            backdropComponent={renderBackdrop}
            keyboardBehavior={keyboardBehavior}
            keyboardBlurBehavior={keyboardBlurBehavior}
            android_keyboardInputMode="adjustResize"
            handleIndicatorStyle={styles.handle}
            backgroundStyle={styles.background}
            detached={true}
            bottomInset={0}
            style={styles.sheetContainer}
          >
            <View style={styles.content}>
              {children}
            </View>
          </GorhomBottomSheet>
        </View>
      </BottomSheetModalProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: screenHeight,
  },
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