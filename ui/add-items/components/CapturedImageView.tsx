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
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 });
  const [originalImageSize, setOriginalImageSize] = React.useState({ width: 0, height: 0 });
  const [actualImageSize, setActualImageSize] = React.useState({ width: 0, height: 0 });
  const [imageOffset, setImageOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (containerSize.width > 0 && containerSize.height > 0 && originalImageSize.width > 0 && originalImageSize.height > 0) {
      // Calculate the scale to fit the image within the container
      const scaleX = containerSize.width / originalImageSize.width;
      const scaleY = containerSize.height / originalImageSize.height;
      const scale = Math.min(scaleX, scaleY);
      
      // Calculate actual displayed dimensions
      const displayWidth = originalImageSize.width * scale;
      const displayHeight = originalImageSize.height * scale;
      
      // Calculate offset (centering)
      const offsetX = (containerSize.width - displayWidth) / 2;
      const offsetY = (containerSize.height - displayHeight) / 2;
      
      setActualImageSize({ width: displayWidth, height: displayHeight });
      setImageOffset({ x: offsetX, y: offsetY });
    }
  }, [containerSize, originalImageSize]);

  return (
    <>
      <View
        style={StyleSheet.absoluteFill}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setContainerSize({ width, height });
        }}
      >
        <Image
          source={{ uri: capturedImageUri }}
          style={styles.capturedImage}
          onLoad={(event) => {
            const { width, height } = event.nativeEvent.source;
            setOriginalImageSize({ width, height });
          }}
        />
      </View>

      {/* Render all bounding boxes */}
      {actualImageSize.width > 0 && actualImageSize.height > 0 && boundingBoxes.map((box) => (
        <TouchableOpacity
          key={box.id}
          onPress={() => onSelectBox(box.id)}
          activeOpacity={1}
        >
          <StableBoundingBox
            centerX={imageOffset.x + box.centerX * actualImageSize.width}
            centerY={imageOffset.y + box.centerY * actualImageSize.height}
            width={box.width * actualImageSize.width}
            height={box.height * actualImageSize.height}
            rotation={box.rotation}
            isSelected={box.id === currentBoxId}
            isComplete={box.isComplete}
            onUpdate={(x, y, w, h, r) => onBoxUpdate(
              box.id, 
              (x - imageOffset.x) / actualImageSize.width, 
              (y - imageOffset.y) / actualImageSize.height, 
              w / actualImageSize.width, 
              h / actualImageSize.height, 
              r
            )}
          />
          {/* Label display */}
          {box.label && (
            <View
              style={[
                styles.labelBadge,
                {
                  left: imageOffset.x + (box.centerX * actualImageSize.width) - (box.width * actualImageSize.width) / 2,
                  top: imageOffset.y + (box.centerY * actualImageSize.height) - (box.height * actualImageSize.height) / 2 - 30,
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