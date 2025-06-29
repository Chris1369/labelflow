import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/types/theme';
import { useLabelListStore } from './useStore';
import { labelListActions } from './actions';
import { CapturedImageView } from '@/ui/add-items/components';
import { LabelBottomSheet, LabelBottomSheetRef } from '@/components/organisms';
import { router } from 'expo-router';

interface LabelListScreenProps {
  projectId: string;
  listId?: string;
}

export const LabelListScreen: React.FC<LabelListScreenProps> = ({ projectId, listId }) => {
  const bottomSheetRef = useRef<LabelBottomSheetRef>(null);
  const {
    currentList,
    currentItemIndex,
    currentImageUrl,
    isLoading,
    boundingBoxes,
    currentBoxId,
    isLabelBottomSheetOpen,
    setIsLabelBottomSheetOpen,
    isSaving,
  } = useLabelListStore();

  useEffect(() => {
    if (listId) {
      labelListActions.loadList(listId);
    }
  }, [listId]);

  const handleValidate = () => {
    if (currentBoxId) {
      // Open bottom sheet for current box
      bottomSheetRef.current?.present();
    } else if (listId && projectId) {
      // Validate all completed boxes
      labelListActions.validateItemWithLabels(listId, projectId);
    }
  };

  const handleSelectLabel = (label: string) => {
    labelListActions.setLabelForCurrentBox(label);
    bottomSheetRef.current?.dismiss();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement de la liste...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentList || !currentImageUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Aucune image à labelliser</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentItem = currentList.items?.[currentItemIndex];
  const totalItems = currentList.items?.length || 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{currentList.name}</Text>
        <Text style={styles.headerSubtitle}>
          {currentItemIndex + 1} / {totalItems}
        </Text>
      </View>

      {/* Image with bounding boxes */}
      <View style={styles.content}>
        <CapturedImageView
          imageUri={currentImageUrl}
          onRetake={() => router.back()}
          onAddBox={() => labelListActions.addNewBox()}
          onValidate={handleValidate}
          onPredict={() => {}}
          hasUnknownBoxes={boundingBoxes.some(box => box.label === '???')}
          isListMode={true}
        />
      </View>

      {/* Label Bottom Sheet */}
      <LabelBottomSheet
        ref={bottomSheetRef}
        projectId={projectId}
        onSelectLabel={handleSelectLabel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    ...theme.fonts.body,
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    ...theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    ...theme.fonts.subtitle,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
  },
});