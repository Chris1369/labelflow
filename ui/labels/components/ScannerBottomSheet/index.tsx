import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useCameraPermissions } from "expo-camera";
import {
  ScannerBottomSheetRef,
  ScannerBottomSheetProps,
} from "./types";
import {
  ScannerHeader,
  ManualInput,
  PermissionView,
  ScanResult,
  ScannerView,
} from "./components";
import { useScannerState, useSubIdManager } from "./hooks";
import { styles } from "./styles";

export const ScannerBottomSheet = forwardRef<
  ScannerBottomSheetRef,
  ScannerBottomSheetProps
>(({ onScan, onSubIdAdded }, ref) => {
  const [permission, requestPermission] = useCameraPermissions();
  
  const {
    isVisible,
    currentLabelId,
    scanned,
    scannedData,
    showManualInput,
    manualCode,
    setManualCode,
    openScanner,
    closeScanner,
    handleBarCodeScanned,
    toggleManualInput,
    rescan,
  } = useScannerState();

  const { addSubId } = useSubIdManager({
    currentLabelId,
    onSubIdAdded,
    onClose: closeScanner,
  });

  useImperativeHandle(ref, () => ({
    open: openScanner,
    close: closeScanner,
  }));

  useEffect(() => {
    if (isVisible && !permission?.granted) {
      requestPermission();
    }
  }, [isVisible, permission]);

  const handleConfirmScan = () => {
    if (scannedData && currentLabelId) {
      addSubId(scannedData);
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim() && currentLabelId) {
      addSubId(manualCode.trim());
    }
  };

  const renderContent = () => {
    if (showManualInput) {
      return (
        <ManualInput
          manualCode={manualCode}
          onChangeText={setManualCode}
          onSubmit={handleManualSubmit}
        />
      );
    }

    if (!permission || !permission.granted) {
      return (
        <PermissionView
          hasPermission={permission}
          permissionGranted={permission?.granted || false}
          onRequestPermission={requestPermission}
        />
      );
    }

    if (scanned) {
      return (
        <ScanResult
          scannedData={scannedData}
          onConfirm={handleConfirmScan}
          onRescan={rescan}
        />
      );
    }

    return <ScannerView onBarCodeScanned={handleBarCodeScanned} />;
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeScanner}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouch}
          activeOpacity={1}
          onPress={closeScanner}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.container}>
            <View style={styles.handle} />
            
            <ScannerHeader
              showManualInput={showManualInput}
              onToggleManualInput={toggleManualInput}
              onClose={closeScanner}
            />

            <View style={styles.content}>
              {renderContent()}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
});

ScannerBottomSheet.displayName = "ScannerBottomSheet";