import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../types/theme';
import { teamActions } from './actions';
import { useTeamStore } from './useStore';
import { mockTeams } from '../../mock/teams';

interface TeamMenuItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}

interface TeamScreenProps {
  teamId: string;
}

export const TeamScreen: React.FC<TeamScreenProps> = ({ teamId }) => {
  const { currentTeam } = useTeamStore();

  useEffect(() => {
    const team = mockTeams.find(t => t.id === teamId);
    if (team) {
      useTeamStore.getState().setCurrentTeam(team);
    }
  }, [teamId]);

  const menuItems: TeamMenuItem[] = [
    {
      id: 'members',
      title: 'Gestion des membres',
      description: 'Ajouter ou retirer des membres de l\'équipe',
      icon: 'people',
      onPress: () => teamActions.handleMembers(teamId),
      color: theme.colors.primary,
    },
    {
      id: 'projects',
      title: 'Gestion des projets',
      description: 'Sélectionner ou retirer des projets',
      icon: 'folder',
      onPress: () => teamActions.handleProjects(teamId),
      color: theme.colors.info,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{currentTeam?.name || 'Équipe'}</Text>
          {currentTeam?.description && (
            <Text style={styles.subtitle}>{currentTeam.description}</Text>
          )}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Ionicons name="people" size={20} color={theme.colors.primary} />
              <Text style={styles.statText}>
                {currentTeam?.memberCount || 0} membres
              </Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="folder" size={20} color={theme.colors.info} />
              <Text style={styles.statText}>
                {currentTeam?.projectCount || 0} projets
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons
                  name={item.icon}
                  size={32}
                  color={item.color || theme.colors.primary}
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={teamActions.exitTeam}
            activeOpacity={0.7}
          >
            <Text style={styles.exitButtonText}>Quitter l'équipe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '500',
  },
  menuContainer: {
    gap: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  menuDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  bottomSection: {
    marginTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
  },
  exitButton: {
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  exitButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});