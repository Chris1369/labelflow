import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SimpleBottomSheet } from "@/components/molecules/SimpleBottomSheet";
import { theme } from "@/types/theme";
import { UnlabeledListItem } from "./UnlabeledListCard";

export interface ListActionBottomSheetRef {
  open: (list: UnlabeledListItem) => void;
  close: () => void;
}

interface ListActionBottomSheetProps {
  onLabelImages: (list: UnlabeledListItem) => void;
  onAddImages: (list: UnlabeledListItem) => void;
}

export const ListActionBottomSheet = forwardRef<
  ListActionBottomSheetRef,
  ListActionBottomSheetProps
>(({ onLabelImages, onAddImages }, ref) => {
  const [visible, setVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<UnlabeledListItem | null>(
    null
  );

  useImperativeHandle(ref, () => ({
    open: (list: UnlabeledListItem) => {
      setSelectedList(list);
      setVisible(true);
    },
    close: () => {
      setVisible(false);
      setSelectedList(null);
    },
  }));

  const handleLabelImages = () => {
    if (selectedList) {
      onLabelImages(selectedList);
      setVisible(false);
    }
  };

  const handleAddImages = () => {
    if (selectedList) {
      onAddImages(selectedList);
      setVisible(false);
    }
  };

  const itemCount = selectedList?.items?.length || 0;

  return (
    <SimpleBottomSheet
      visible={visible}
      onClose={() => setVisible(false)}
      height='60%'
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title as TextStyle}>Choisir une action</Text>
          {selectedList && (
            <>
              <Text style={styles.listName}>{selectedList.name}</Text>
              <Text style={styles.listInfo}>
                {itemCount} image{itemCount !== 1 ? "s" : ""} dans la liste
              </Text>
            </>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLabelImages}
            activeOpacity={0.7}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name='pricetag-outline'
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Labelliser les images</Text>
              <Text style={styles.actionDescription}>
                Annoter les images non labellisées de cette liste
              </Text>
            </View>
            <Ionicons
              name='chevron-forward'
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddImages}
            activeOpacity={0.7}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name='images-outline'
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Ajouter des images</Text>
              <Text style={styles.actionDescription}>
                Ajouter de nouvelles images à cette liste
              </Text>
            </View>
            <Ionicons
              name='chevron-forward'
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SimpleBottomSheet>
  );
});

ListActionBottomSheet.displayName = "ListActionBottomSheet";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  listName: {
    ...theme.fonts.body,
    color: theme.colors.text,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  listInfo: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  } as TextStyle,
  actions: {
    flex: 1,
    paddingTop: theme.spacing.lg,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...theme.fonts.body,
    color: theme.colors.text,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  actionDescription: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  } as TextStyle,
});
