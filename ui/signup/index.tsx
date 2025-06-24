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
import { Button, Input } from '@/components/atoms';
import { theme } from '@/types/theme';
import { useSignUpStore } from './useStore';
import { signUpActions } from './actions';
import { useAuth } from '@/contexts/AuthContext';

export const SignUpScreen: React.FC = () => {
  const { form, isLoading, error, setError, setLoading } = useSignUpStore();
  const { register } = useAuth();

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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Name"
              type="text"
              icon="person"
              placeholder="Enter your name"
              value={form.name}
              onChangeText={signUpActions.handleNameChange}
              error={error?.code === 'name' ? error.message : undefined}
            />

            <Input
              label="Email"
              type="email"
              icon="mail"
              placeholder="Enter your email"
              value={form.email}
              onChangeText={signUpActions.handleEmailChange}
              error={error?.code === 'email' ? error.message : undefined}
            />

            <Input
              label="Password"
              type="password"
              icon="lock-closed"
              placeholder="Create a password"
              value={form.password}
              onChangeText={signUpActions.handlePasswordChange}
              error={error?.code === 'password' ? error.message : undefined}
            />

            {error && !error.code && (
              <Text style={styles.errorText}>{error.message}</Text>
            )}

            <Button
              title="Sign Up"
              onPress={async () => {
                if (!signUpActions.validateForm()) return;
                
                setLoading(true);
                setError(null);
                
                try {
                  await register(form.email, form.password, form.name);
                } catch (error: any) {
                  setError({
                    message: error.response?.data?.message || 'Failed to create account',
                  });
                } finally {
                  setLoading(false);
                }
              }}
              loading={isLoading}
              size="large"
              style={styles.signUpButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or sign up with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <Button
                title="Google"
                onPress={() => {
                  // TODO: Implement Google OAuth
                  setError({ message: 'Google sign-up not yet implemented' });
                }}
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
                onPress={() => {
                  // TODO: Implement Apple OAuth
                  setError({ message: 'Apple sign-up not yet implemented' });
                }}
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

          <TouchableOpacity 
            style={styles.footer}
            onPress={signUpActions.navigateToSignIn}
          >
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
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
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  signUpButton: {
    marginTop: theme.spacing.lg,
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
  signInLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});