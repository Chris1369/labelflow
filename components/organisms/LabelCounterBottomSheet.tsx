import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import { LabelCounter } from '@/types/project';

const { height: screenHeight } = Dimensions.get('window');

interface LabelCounterBottomSheetProps {
  labelCounters: LabelCounter[];
}

export interface LabelCounterBottomSheetRef {
  open: () => void;
  close: () => void;
}

export const LabelCounterBottomSheet = forwardRef<LabelCounterBottomSheetRef, LabelCounterBottomSheetProps>(
  ({ labelCounters }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setIsVisible(true),
      close: () => setIsVisible(false),
    }));

    const renderCounterItem = ({ item }: { item: LabelCounter }) => (
      <View style={styles.counterItem}>
        <View style={styles.counterContent}>
          <Text style={styles.labelName}>{item.label}</Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{item.count}</Text>
          </View>
        </View>
        <Text style={styles.counterSubtext}>
          {item.count} occurrence{item.count > 1 ? 's' : ''}
        </Text>
      </View>
    );

    const totalCount = labelCounters.reduce((sum, counter) => sum + counter.count, 0);

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={styles.overlayTouch}
            activeOpacity={1}
            onPress={() => setIsVisible(false)}
          />
          <View style={styles.container}>
            <View style={styles.handle} />
            
            <View style={styles.header}>
              <Text style={styles.title}>Statistiques des labels</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                Total: {totalCount} labels sur {labelCounters.length} types différents
              </Text>
            </View>

            <FlatList
              data={labelCounters.sort((a, b) => b.count - a.count)}
              keyExtractor={(item) => item._id}
              renderItem={renderCounterItem}
              style={styles.countersList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Aucun label trouvé dans ce projet
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.1,
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    height: screenHeight * 0.9,
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  title: {
    ...theme.fonts.subtitle,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.lg,
    top: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  summaryContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryText: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  countersList: {
    paddingHorizontal: theme.spacing.lg,
    flex: 1,
  },
  counterItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  counterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelName: {
    ...theme.fonts.body,
    color: theme.colors.text,
    flex: 1,
  },
  counterBadge: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    minWidth: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  counterText: {
    ...theme.fonts.caption,
    color: theme.colors.text,
    fontWeight: '600',
  },
  counterSubtext: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  emptyText: {
    ...theme.fonts.body,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
  },
});