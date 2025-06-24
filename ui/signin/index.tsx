import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../components/atoms';
import { theme } from '../../types/theme';
import { useSignInStore } from './useStore';
import { signInActions } from './actions';
import { AuthProvider } from '../../types/auth';

export const SignInScreen: React.FC = () => {
  const { form, isLoading, error } = useSignInStore();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              type="email"
              icon="mail-outline"
              placeholder="Enter your email"
              value={form.email}
              onChangeText={signInActions.handleEmailChange}
              error={error?.code === 'email' ? error.message : undefined}
            />

            <Input
              label="Password"
              type="password"
              icon="lock-closed-outline"
              placeholder="Enter your password"
              value={form.password}
              onChangeText={signInActions.handlePasswordChange}
              error={error?.code === 'password' ? error.message : undefined}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={signInActions.handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {error && !error.code && (
              <Text style={styles.errorText}>{error.message}</Text>
            )}

            <Button
              title="Sign In"
              onPress={signInActions.handleSignIn}
              loading={isLoading}
              size="large"
              style={styles.signInButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <Button
                title="Google"
                onPress={() => signInActions.handleSocialSignIn(AuthProvider.GOOGLE)}
                variant="outline"
                disabled={isLoading}
                style={styles.socialButton}
                icon={
                  <Ionicons
                    name="logo-google"
                    size={20}
                    color={theme.colors.primary}
                  />
                }
              />

              <Button
                title="Apple"
                onPress={() => signInActions.handleSocialSignIn(AuthProvider.APPLE)}
                variant="outline"
                disabled={isLoading}
                style={styles.socialButton}
                icon={
                  <Ionicons
                    name="logo-apple"
                    size={20}
                    color={theme.colors.primary}
                  />
                }
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  signInButton: {
    marginBottom: theme.spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  signUpLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});