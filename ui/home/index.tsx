import React from 'react';
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
import { homeActions } from './actions';

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
}

export const HomeScreen: React.FC = () => {
  const menuItems: MenuItem[] = [
    {
      id: 'create-project',
      title: 'Créer un projet',
      icon: 'add-circle',
      onPress: homeActions.handleCreateProject,
      color: theme.colors.primary,
    },
    {
      id: 'select-project',
      title: 'Sélectionner un projet',
      icon: 'folder-open',
      onPress: homeActions.handleSelectProject,
    },
    {
      id: 'create-team',
      title: 'Créer une équipe',
      icon: 'people',
      onPress: homeActions.handleCreateTeam,
      color: theme.colors.primary,
    },
    {
      id: 'select-team',
      title: 'Sélectionner une équipe',
      icon: 'people-circle',
      onPress: homeActions.handleSelectTeam,
    },
    {
      id: 'settings',
      title: 'Paramètres',
      icon: 'settings',
      onPress: homeActions.handleSettings,
    },
    {
      id: 'help',
      title: 'Aide',
      icon: 'help-circle',
      onPress: homeActions.handleHelp,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={homeActions.handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Labeltool</Text>
          <Text style={styles.subtitle}>Menu principal</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, item.color && { backgroundColor: item.color + '20' }]}>
                <Ionicons
                  name={item.icon}
                  size={48}
                  color={item.color || theme.colors.primary}
                />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
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
    position: 'relative',
  },
  logoutButton: {
    position: 'absolute',
    top: -theme.spacing.md,
    right: 0,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  menuItem: {
    width: '47%',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  menuItemText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
});