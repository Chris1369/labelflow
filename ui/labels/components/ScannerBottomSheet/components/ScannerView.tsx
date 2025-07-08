import React from "react";
import { View, Text } from "react-native";
import { CameraView } from "expo-camera";
import { ScannerViewProps } from "../types";
import { scannerViewStyles } from "../styles/scannerView.styles";

export const ScannerView: React.FC<ScannerViewProps> = ({
  onBarCodeScanned,
}) => {
  return (
    <View style={scannerViewStyles.container}>
      <CameraView
        style={scannerViewStyles.scanner}
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "ean13",
            "ean8",
            "code128",
            "code39",
            "code93",
            "codabar",
            "itf14",
            "upc_a",
            "upc_e",
          ],
        }}
        onBarcodeScanned={onBarCodeScanned}
      />
      <View style={scannerViewStyles.overlay}>
        <View style={scannerViewStyles.frame} />
        <Text style={scannerViewStyles.text}>
          Placez le code dans le cadre
        </Text>
      </View>
    </View>
  );
};