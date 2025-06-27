import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { StableBoundingBox } from "@/components/molecules";
import { theme } from "@/types/theme";
import { BoundingBox } from "../types";
import { getLabelColor } from "@/helpers/labelColors";
import { Ionicons } from "@expo/vector-icons";

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
  onDeleteBox?: (id: string) => void;
  onEditLabel?: (id: string) => void;
}

export const CapturedImageView: React.FC<CapturedImageViewProps> = ({
  capturedImageUri,
  boundingBoxes,
  currentBoxId,
  onBoxUpdate,
  onSelectBox,
  onDeleteBox,
  onEditLabel,
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
        <View key={box.id}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => onSelectBox(box.id)}
          >
            <StableBoundingBox
              centerX={imageOffset.x + box.centerX * actualImageSize.width}
              centerY={imageOffset.y + box.centerY * actualImageSize.height}
              width={box.width * actualImageSize.width}
              height={box.height * actualImageSize.height}
              rotation={box.rotation}
              isSelected={box.id === currentBoxId}
              isComplete={box.isComplete}
              label={box.label}
              onUpdate={(x, y, w, h, r) => onBoxUpdate(
                box.id, 
                (x - imageOffset.x) / actualImageSize.width, 
                (y - imageOffset.y) / actualImageSize.height, 
                w / actualImageSize.width, 
                h / actualImageSize.height, 
                r
              )}
            />
          </TouchableOpacity>
          {/* Label display with delete button */}
          {box.label && (
            <View
              style={[
                styles.labelContainer,
                {
                  left: imageOffset.x + (box.centerX * actualImageSize.width) - (box.width * actualImageSize.width) / 2,
                  top: imageOffset.y + (box.centerY * actualImageSize.height) - (box.height * actualImageSize.height) / 2 - 30,
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.labelBadge,
                  { backgroundColor: getLabelColor(box.label) }
                ]}
                onPress={() => onEditLabel?.(box.id)}
                onLongPress={() => onSelectBox(box.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.labelText}>{box.label}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDeleteBox?.(box.id)}
                activeOpacity={0.8}
              >
                <Ionicons name="close-circle" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      
      {/* Info display in bottom right */}
      <View style={styles.infoContainer}>
        {currentBoxId && (() => {
          const currentBox = boundingBoxes.find(b => b.id === currentBoxId);
          if (!currentBox) return null;
          return (
            <View style={styles.boxInfo}>
              <Text style={styles.infoText}>
                {Math.round(currentBox.width * actualImageSize.width)} × {Math.round(currentBox.height * actualImageSize.height)}
              </Text>
              <Text style={styles.infoTextSmall}>
                {Math.round(currentBox.rotation)}°
              </Text>
            </View>
          );
        })()}
        <View style={styles.countInfo}>
          <Text style={styles.infoText}>
            {boundingBoxes.filter(b => b.isComplete).length}/{boundingBoxes.length} objets
          </Text>
        </View>
      </View>
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
  labelContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  labelBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  deleteButton: {
    padding: 2,
  },
  labelText: {
    ...theme.fonts.label,
    color: theme.colors.secondary,
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "flex-end",
    gap: theme.spacing.sm,
  },
  boxInfo: {
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  countInfo: {
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  infoText: {
    ...theme.fonts.caption,
    color: theme.colors.secondary,
  },
  infoTextSmall: {
    ...theme.fonts.label,
    color: theme.colors.secondary,
    marginTop: 2,
  },
});