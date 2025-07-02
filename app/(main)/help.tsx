import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderPage } from '@/components/atoms';
import { theme } from '@/types/theme';

export default function HelpPage() {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <HeaderPage 
        title="Aide" 
        subtitle="Centre d'aide et support"
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>Contenu de l'aide à venir...</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
  },
});