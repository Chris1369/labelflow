import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Label } from "@/types/label";
import { theme } from "@/types/theme";
import { labelAPI } from "@/api/label.api";
import {
  ScannerBottomSheet,
  ScannerBottomSheetRef,
} from "./ScannerBottomSheet";
import {
  SubIdsBottomSheet,
  SubIdsBottomSheetRef,
} from "./SubIdsBottomSheet";

interface LabelCardProps {
  label: Label;
  onDelete: () => void;
  onUpdate?: () => void;
}

export const LabelCard: React.FC<LabelCardProps> = ({
  label,
  onDelete,
  onUpdate,
}) => {
  const [isPublic, setIsPublic] = useState(label.isPublic);
  const [isUpdating, setIsUpdating] = useState(false);
  const scannerRef = useRef<ScannerBottomSheetRef>(null);
  const subIdsRef = useRef<SubIdsBottomSheetRef>(null);

  const handleDelete = () => {
    Alert.alert(
      "Supprimer le label",
      `Êtes-vous sûr de vouloir supprimer "${label.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          onPress: onDelete,
          style: "destructive",
        },
      ]
    );
  };

  const handleTogglePublic = async (value: boolean) => {
    try {
      setIsUpdating(true);
      setIsPublic(value);

      const labelId = label._id || label.id;
      await labelAPI.update(labelId, { isPublic: value });

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error updating label visibility:", error);
      setIsPublic(!value);
      Alert.alert("Erreur", "Impossible de modifier la visibilité du label");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name='pricetag-outline'
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.labelInfo}>
          <Text style={styles.labelName} numberOfLines={1}>
            {label.name}
          </Text>
          {/* {isPublic && (
            <View style={styles.publicBadge}>
              <Text style={styles.publicText}>Public</Text>
            </View>
          )} */}
        </View>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name='trash-outline'
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.labelId} numberOfLines={1}>
        ID: {label._id || label.id}
      </Text>

      <View style={styles.labelStats}>
        <View style={styles.stat}>
          <Ionicons
            name='qr-code'
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>{label.subIds?.length || 0} IDs</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons
            name={isPublic ? "globe-outline" : "lock-closed-outline"}
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>{isPublic ? "Public" : "Privé"}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons
            name='calendar'
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.statText}>
            {new Date(label.createdAt).toLocaleDateString("fr-FR")}
          </Text>
        </View>
      </View>
      
      <View style={styles.subIdSection}>
        <Text style={styles.subIdTitle}>Sous-identifiants</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => scannerRef.current?.open(label._id || label.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={theme.colors.secondary} />
            <Text style={styles.primaryButtonText}>Ajouter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => subIdsRef.current?.open(label)}
            activeOpacity={0.7}
          >
            <Ionicons name="eye-outline" size={20} color={theme.colors.text} />
            <Text style={styles.secondaryButtonText}>Voir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScannerBottomSheet 
        ref={scannerRef} 
        onSubIdAdded={() => {
          if (onUpdate) {
            onUpdate();
          }
        }}
      />
      
      <SubIdsBottomSheet
        ref={subIdsRef}
        onSubIdRemoved={() => {
          if (onUpdate) {
            onUpdate();
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  labelInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  labelName: {
    ...theme.fonts.subtitle,
    color: theme.colors.text,
  },
  publicBadge: {
    backgroundColor: theme.colors.info + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  publicText: {
    ...theme.fonts.label,
    color: theme.colors.info,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  labelId: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    fontFamily: "monospace",
  },
  labelStats: {
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statText: {
    ...theme.fonts.label,
    color: theme.colors.textSecondary,
  },
  subIdSection: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  subIdTitle: {
    ...theme.fonts.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  actionButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryButtonText: {
    ...theme.fonts.button,
    color: theme.colors.secondary,
    fontSize: theme.fontSize.sm,
  },
  secondaryButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryButtonText: {
    ...theme.fonts.button,
    color: theme.colors.text,
    fontSize: theme.fontSize.sm,
  },
});
