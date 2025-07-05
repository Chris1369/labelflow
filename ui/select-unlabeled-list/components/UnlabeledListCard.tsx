import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/types/theme';
import { CAPTURE_TEMPLATES } from '@/constants/CapturesTemplates';

export interface UnlabeledListItem {
  id?: string;
  _id?: string;
  name: string;
  items?: any[];
  createdAt?: string;
  pictureTemplateId?: string;
  totalRequiredValidatedItems?: number;
  validatedItems?: any[];
}

interface UnlabeledListCardProps {
  item: UnlabeledListItem;
  onPress: (item: UnlabeledListItem) => void;
}

export const UnlabeledListCard: React.FC<UnlabeledListCardProps> = ({
  item,
  onPress,
}) => {
  const itemCount = item.items?.length || 0;
  const validatedCount = item.validatedItems?.length || 0;
  const totalCount = itemCount + validatedCount;
  const unlabeledCount = itemCount; // items are unlabeled, validatedItems are labeled
  
  // Get template info if available
  const template = item.pictureTemplateId 
    ? CAPTURE_TEMPLATES.find(t => t.id === item.pictureTemplateId)
    : null;
  
  const requiredTotal = item.totalRequiredValidatedItems || template?.totalPhotos || 0;
  
  // Calculate progress based on template angles if available
  let effectiveCount = totalCount;
  if (template && (item.items || item.validatedItems)) {
    // Group all items by angle
    const imagesByAngle: Record<string, number> = {};
    
    // Count items by angle
    [...(item.items || []), ...(item.validatedItems || [])].forEach((img: any) => {
      if (img.angle) {
        imagesByAngle[img.angle] = (imagesByAngle[img.angle] || 0) + 1;
      }
    });
    
    // Calculate effective count (cap each angle to its required count)
    effectiveCount = 0;
    template.angles.forEach(angle => {
      const angleCount = imagesByAngle[angle.position] || 0;
      const requiredCount = angle.count;
      effectiveCount += Math.min(angleCount, requiredCount);
    });
  }
  
  const progress = requiredTotal > 0 ? (effectiveCount / requiredTotal) * 100 : 0;
  const isComplete = progress >= 100;
  
  return (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.listHeader}>
        <View style={styles.listInfo}>
          <Text style={styles.listName}>{item.name}</Text>
          <View style={styles.metaInfo}>
            <View style={styles.countBadge}>
              <Ionicons name="images-outline" size={14} color={theme.colors.primary} />
              <Text style={styles.countText}>
                {template ? effectiveCount : totalCount}{requiredTotal > 0 ? `/${requiredTotal}` : ''} image{totalCount !== 1 ? 's' : ''}
              </Text>
            </View>
            {item.createdAt && (
              <Text style={styles.dateText}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            )}
          </View>
          {unlabeledCount > 0 && (
            <View style={styles.countBadge}>
              <Ionicons name="pricetag-outline" size={14} color={theme.colors.warning || theme.colors.primary} />
              <Text style={[styles.countText, { color: theme.colors.warning || theme.colors.primary }]}>
                {unlabeledCount} à labelliser
              </Text>
            </View>
          )}
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={theme.colors.textSecondary}
        />
      </View>
      
      {requiredTotal > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min(progress, 100)}%` },
                isComplete && styles.progressComplete
              ]} 
            />
          </View>
          <Text style={[styles.progressText, isComplete && styles.progressTextComplete]}>
            {isComplete ? 'Complet' : `${Math.round(progress)}%`}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  listName: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xs,
    flexWrap: 'wrap',
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  countText: {
    ...theme.fonts.label,
    color: theme.colors.textSecondary,
  },
  dateText: {
    ...theme.fonts.label,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressComplete: {
    backgroundColor: theme.colors.success || '#4CAF50',
  },
  progressText: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },
  progressTextComplete: {
    color: theme.colors.success || '#4CAF50',
    fontWeight: '600',
  },
});