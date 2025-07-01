import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { TeamMember } from "@/types/team";

interface MemberCardProps {
  member: TeamMember;
  onRemove: (member: TeamMember) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onRemove }) => {
  const getInitials = (name: string | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "owner":
        return { backgroundColor: theme.colors.primary };
      case "admin":
        return { backgroundColor: theme.colors.info };
      default:
        return { backgroundColor: theme.colors.textSecondary };
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "owner":
        return "Propriétaire";
      case "admin":
        return "Admin";
      default:
        return "Membre";
    }
  };

  return (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <View style={styles.memberAvatar}>
          <Text style={styles.avatarText}>{getInitials(member.name)}</Text>
        </View>
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{member.username || "Sans nom"}</Text>
          <Text style={styles.memberEmail}>{member.email.split("@")[0]}</Text>
        </View>
      </View>
      <View style={styles.memberActions}>
        <View style={[styles.roleBadge, getRoleBadgeStyle(member.role)]}>
          <Text style={styles.roleText}>{getRoleText(member.role)}</Text>
        </View>
        {member.role !== "owner" && (
          <TouchableOpacity
            onPress={() => onRemove(member)}
            style={styles.removeButton}
          >
            <Ionicons name="trash" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: theme.fontSize.md,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  memberActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  roleText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSize.xs,
    fontWeight: "600",
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
});