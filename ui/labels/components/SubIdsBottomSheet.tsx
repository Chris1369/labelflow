import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import { Label } from '@/types/label';
import { labelAPI } from '@/api/label.api';

export interface SubIdsBottomSheetRef {
  open: (label: Label) => void;
  close: () => void;
}

interface Props {
  onSubIdRemoved?: () => void;
}

export const SubIdsBottomSheet = forwardRef<SubIdsBottomSheetRef, Props>(
  ({ onSubIdRemoved }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentLabel, setCurrentLabel] = useState<Label | null>(null);
    const [isRemoving, setIsRemoving] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      open: (label: Label) => {
        setCurrentLabel(label);
        setIsVisible(true);
      },
      close: () => {
        setIsVisible(false);
        setCurrentLabel(null);
      },
    }));

    const handleClose = () => {
      setIsVisible(false);
      setCurrentLabel(null);
    };

    const handleRemoveSubId = async (subId: string) => {
      if (!currentLabel) return;

      Alert.alert(
        'Supprimer l\'identifiant',
        `Êtes-vous sûr de vouloir supprimer "${subId}" ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: async () => {
              try {
                setIsRemoving(subId);
                const labelId = currentLabel._id || currentLabel.id;
                const updatedLabel = await labelAPI.removeSubId(labelId, subId);
                
                // Update current label with new data
                setCurrentLabel(updatedLabel);
                
                if (onSubIdRemoved) {
                  onSubIdRemoved();
                }
              } catch (error) {
                Alert.alert('Erreur', 'Impossible de supprimer l\'identifiant');
              } finally {
                setIsRemoving(null);
              }
            },
          },
        ]
      );
    };

    const renderSubId = ({ item }: { item: string }) => (
      <View style={styles.subIdItem}>
        <View style={styles.subIdContent}>
          <Ionicons name="qr-code" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.subIdText} numberOfLines={1}>{item}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoveSubId(item)}
          disabled={isRemoving === item}
        >
          {isRemoving === item ? (
            <ActivityIndicator size="small" color={theme.colors.error} />
          ) : (
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          )}
        </TouchableOpacity>
      </View>
    );

    return (
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayTouch}
            activeOpacity={1}
            onPress={handleClose}
          />
          <View style={styles.container}>
            <View style={styles.handle} />
            
            <View style={styles.header}>
              <Text style={styles.title}>Identifiants du label</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {currentLabel && (
              <>
                <View style={styles.labelInfo}>
                  <View style={styles.labelIcon}>
                    <Ionicons name="pricetag" size={20} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.labelName}>{currentLabel.name}</Text>
                </View>

                {currentLabel.subIds && currentLabel.subIds.length > 0 ? (
                  <FlatList
                    data={currentLabel.subIds}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={renderSubId}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons
                      name="scan-outline"
                      size={48}
                      color={theme.colors.textSecondary}
                    />
                    <Text style={styles.emptyText}>
                      Aucun identifiant associé
                    </Text>
                    <Text style={styles.emptySubtext}>
                      Scannez des codes pour les ajouter à ce label
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  }
);

SubIdsBottomSheet.displayName = 'SubIdsBottomSheet';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600' as any,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  labelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  labelIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  labelName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600' as any,
    color: theme.colors.text,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  subIdItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  subIdContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  subIdText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    flex: 1,
    fontFamily: 'monospace',
  },
  deleteButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});