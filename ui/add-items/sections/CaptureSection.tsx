import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LabelBottomSheet } from "@/components/organisms";
import { HeaderPage } from "@/components/atoms";
import {
  CapturedImageView,
  ControlButtons,
  RecentLabelsBar,
  PredictionIndicator,
} from "../components";
import { captureStyles } from "../styles/capture.styles";
import { CaptureModeSectionProps } from "../types";

interface CaptureSectionProps extends CaptureModeSectionProps {
  bottomSheetRef: React.RefObject<any>;
}

export const CaptureSection: React.FC<CaptureSectionProps> = ({
  capturedImageUri,
  boundingBoxes,
  currentBoxId,
  showSaveButton,
  hasCompletedBoxes,
  hasUncompletedBoxes,
  hasUnknownBoxes,
  hasNextImage,
  isSaving,
  isPredicting,
  isForUnlabeled,
  currentUnlabeledIndex,
  unlabeledListItems,
  currentProject,
  unlabeledListPredictionLabels,
  bottomSheetRef,
  onBoxUpdate,
  onSelectBox,
  onDeleteBox,
  onEditLabel,
  onRetake,
  onAddBox,
  onValidate,
  onPredict,
  onNextImage,
  onSelectLabel,
}) => {
  return (
    <SafeAreaView style={captureStyles.container} edges={['left', 'right', 'bottom']}>
      {isForUnlabeled && (
        <HeaderPage
          title="Labelliser l'image"
          subtitle={`Image ${currentUnlabeledIndex + 1} sur ${unlabeledListItems.length}`}
        />
      )}
      <View style={isForUnlabeled ? captureStyles.contentWithHeader : captureStyles.container}>
        <CapturedImageView
          capturedImageUri={capturedImageUri}
          boundingBoxes={boundingBoxes}
          currentBoxId={currentBoxId}
          onBoxUpdate={onBoxUpdate}
          onSelectBox={onSelectBox}
          onDeleteBox={onDeleteBox}
          onEditLabel={onEditLabel}
        />

        <ControlButtons
          currentBoxId={currentBoxId}
          boundingBoxes={boundingBoxes}
          showSaveButton={showSaveButton}
          hasCompletedBoxes={hasCompletedBoxes}
          hasUncompletedBoxes={hasUncompletedBoxes}
          hasUnknownBoxes={hasUnknownBoxes}
          isSaving={isSaving}
          onRetake={onRetake}
          onAddBox={onAddBox}
          onValidate={onValidate}
          onPredict={() => onPredict()}
          isForUnlabeled={isForUnlabeled}
          hasNextImage={hasNextImage}
          onNextImage={onNextImage}
        />

        <RecentLabelsBar
          visible={
            currentBoxId !== null &&
            !boundingBoxes.find((b) => b.id === currentBoxId)?.isComplete
          }
          onSelectLabel={onSelectLabel}
        />

        <LabelBottomSheet
          ref={bottomSheetRef}
          onSelectLabel={onSelectLabel}
          hasExistingLabel={
            currentBoxId
              ? boundingBoxes.find((b) => b.id === currentBoxId)?.isComplete ??
                false
              : false
          }
          labelCounters={currentProject?.labelCounter || []}
          suggestedLabelIds={unlabeledListPredictionLabels.length > 1 ? unlabeledListPredictionLabels : []}
        />
        
        <PredictionIndicator isVisible={isPredicting} />
      </View>
    </SafeAreaView>
  );
};