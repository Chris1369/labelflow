import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { StableBoundingBox } from "@/components/molecules";
import { theme } from "@/types/theme";
import { BoundingBox } from "../types";

interface CapturedImageViewProps {
  capturedImageUri: string;
  boundingBoxes: BoundingBox[];
  currentBoxId: string | null;
  onBoxUpdate: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
  ) => void;
  onSelectBox: (id: string) => void;
}

export const CapturedImageView: React.FC<CapturedImageViewProps> = ({
  capturedImageUri,
  boundingBoxes,
  currentBoxId,
  onBoxUpdate,
  onSelectBox,
}) => {
  const [imageSize, setImageSize] = React.useState({ width: 0, height: 0 });

  return (
    <>
      <Image
        source={{ uri: capturedImageUri }}
        style={styles.capturedImage}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setImageSize({ width, height });
        }}
      />

      {/* Render all bounding boxes */}
      {imageSize.width > 0 && imageSize.height > 0 && boundingBoxes.map((box) => (
        <TouchableOpacity
          key={box.id}
          onPress={() => onSelectBox(box.id)}
          activeOpacity={1}
        >
          <StableBoundingBox
            centerX={box.centerX * imageSize.width}
            centerY={box.centerY * imageSize.height}
            width={box.width * imageSize.width}
            height={box.height * imageSize.height}
            rotation={box.rotation}
            isSelected={box.id === currentBoxId}
            isComplete={box.isComplete}
            onUpdate={(x, y, w, h, r) => onBoxUpdate(
              box.id, 
              x / imageSize.width, 
              y / imageSize.height, 
              w / imageSize.width, 
              h / imageSize.height, 
              r
            )}
          />
          {/* Label display */}
          {box.label && (
            <View
              style={[
                styles.labelBadge,
                {
                  left: (box.centerX * imageSize.width) - (box.width * imageSize.width) / 2,
                  top: (box.centerY * imageSize.height) - (box.height * imageSize.height) / 2 - 30,
                }
              ]}
            >
              <Text style={styles.labelText}>{box.label}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  capturedImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  labelBadge: {
    position: "absolute",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  labelText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.xs,
    fontWeight: "600",
  },
});