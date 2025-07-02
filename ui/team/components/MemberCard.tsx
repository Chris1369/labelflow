import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";
import { TeamMember } from "@/types/team";
import { useAuth } from "@/contexts/AuthContext";
import { useTeamStore } from "@/ui/team/useStore";

interface MemberCardProps {
  member: TeamMember;
  onRemove: (member: TeamMember) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onRemove }) => {
  const { user } = useAuth();
  const currentTeam = useTeamStore((state) => state.currentTeam);
  
  const getInitials = (member: TeamMember) => {
    // Try username first, then name, then email
    const displayName = member.username || member.name || member.email;
    
    if (!displayName) return "?";
    
    // If it's an email, use the part before @
    if (displayName.includes("@")) {
      const emailName = displayName.split("@")[0];
      // If email has dots, use first letter of each part
      if (emailName.includes(".")) {
        return emailName
          .split(".")
          .map((part) => part[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      }
      // Otherwise use first two letters
      return emailName.slice(0, 2).toUpperCase();
    }
    
    // For names, use first letter of each word
    const words = displayName.split(" ");
    if (words.length > 1) {
      return words
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    
    // Single word: use first two letters
    return displayName.slice(0, 2).toUpperCase();
  };

  // Check if current user is the team owner
  const isCurrentUserOwner = user?.id === currentTeam?.ownerId;
  
  // Determine the actual role to display
  const getMemberRole = (member: TeamMember): string => {
    // If member ID matches team owner ID, they are the owner
    if (member.id === currentTeam?.ownerId) {
      return "owner";
    }
    // If current user is owner and member is not owner, they can be admin
    if (isCurrentUserOwner && member.id === user?.id) {
      return "admin";
    }
    return member.role || "member";
  };
  
  const displayRole = getMemberRole(member);
  
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
          <Text style={styles.avatarText}>{getInitials(member)}</Text>
        </View>
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{member.username || "Sans nom"}</Text>
          <Text style={styles.memberEmail}>{member.email.split("@")[0]}</Text>
        </View>
      </View>
      <View style={styles.memberActions}>
        <View style={[styles.roleBadge, getRoleBadgeStyle(displayRole)]}>
          <Text style={styles.roleText}>{getRoleText(displayRole)}</Text>
        </View>
        {displayRole !== "owner" && (
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