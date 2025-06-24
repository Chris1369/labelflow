import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../types/theme';

export default function ViewItemsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Voir les items</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text,
  },
});