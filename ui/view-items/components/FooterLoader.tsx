import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '@/types/theme';

interface FooterLoaderProps {
  hasMore: boolean;
}

export const FooterLoader: React.FC<FooterLoaderProps> = ({ hasMore }) => {
  if (!hasMore) return null;
  
  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator size='small' color={theme.colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  footerLoader: {
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
  },
});