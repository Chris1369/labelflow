export interface ScannerBottomSheetRef {
  open: (labelId: string) => void;
  close: () => void;
}

export interface ScannerBottomSheetProps {
  onScan?: (data: string, labelId: string) => void;
  onSubIdAdded?: () => void;
}

export interface ScannerHeaderProps {
  showManualInput: boolean;
  onToggleManualInput: () => void;
  onClose: () => void;
}

export interface ManualInputProps {
  manualCode: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

export interface PermissionViewProps {
  hasPermission: boolean | null;
  permissionGranted: boolean;
  onRequestPermission: () => void;
}

export interface ScanResultProps {
  scannedData: string;
  onConfirm: () => void;
  onRescan: () => void;
}

export interface ScannerViewProps {
  onBarCodeScanned: (data: any) => void;
}