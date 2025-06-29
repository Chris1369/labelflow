import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/types/theme';

interface SelectUnlabeledListScreenProps {
  projectId: string;
}

export const SelectUnlabeledListScreen: React.FC<SelectUnlabeledListScreenProps> = ({ projectId }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Labeliser une liste</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.fonts.title,
    textAlign: 'center',
  },
});