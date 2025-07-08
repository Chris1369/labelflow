import { useState } from "react";

export const useScannerState = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentLabelId, setCurrentLabelId] = useState<string>("");
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState("");

  const openScanner = (labelId: string) => {
    setCurrentLabelId(labelId);
    setIsVisible(true);
  };

  const closeScanner = () => {
    setIsVisible(false);
    setCurrentLabelId("");
    resetScannerState();
  };

  const resetScannerState = () => {
    setScanned(false);
    setScannedData("");
    setShowManualInput(false);
    setManualCode("");
  };

  const handleBarCodeScanned = ({ type, data }: any) => {
    if (!scanned) {
      setScanned(true);
      setScannedData(data);
    }
  };

  const toggleManualInput = () => {
    setShowManualInput(!showManualInput);
    setScanned(false);
    setScannedData("");
  };

  const rescan = () => {
    setScanned(false);
    setScannedData("");
  };

  return {
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
  };
};