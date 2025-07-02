import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";

interface HomeHeaderProps {
  onLogout: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onLogout }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogout}
        activeOpacity={0.7}
      >
        <Ionicons name='log-out' size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/logo.png")}
          style={styles.logo}
          resizeMode='contain'
        />
        <Text style={styles.title}>Labelflow</Text>
      </View>
      <Text style={styles.subtitle}>Menu principal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    position: "relative",
  },
  logoutButton: {
    position: "absolute",
    top: -theme.spacing.md,
    right: 0,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: theme.spacing.sm,
  },
  title: {
    ...theme.fonts.title,
    color: theme.colors.text,
  } as TextStyle,
  subtitle: {
    ...(theme.fonts.subtitle as TextStyle),
    color: theme.colors.textSecondary,
  },
});
