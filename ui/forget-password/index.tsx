import React, { useEffect } from 'react';
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
import { useForgotPasswordStore } from './useStore';
import { forgotPasswordActions } from './actions';

export const ForgotPasswordScreen: React.FC = () => {
  const { step, emailForm, otpForm, isLoading, error, resendTimer, otpSession } = useForgotPasswordStore();

  useEffect(() => {
    if (otpSession && step === 'otp') {
      const interval = setInterval(() => {
        const timeLeft = forgotPasswordActions.getTimeUntilExpiry();
        if (timeLeft <= 0) {
          useForgotPasswordStore.getState().setStep('email');
          useForgotPasswordStore.getState().setOTPSession(null);
          useForgotPasswordStore.getState().setError({
            message: 'OTP expired. Please request a new code.',
          });
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpSession, step]);

  const renderEmailStep = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={forgotPasswordActions.handleBackToSignIn}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a verification code
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          type="email"
          icon="mail-outline"
          placeholder="Enter your email"
          value={emailForm.email}
          onChangeText={forgotPasswordActions.handleEmailChange}
          error={error?.message}
        />

        <Button
          title="Send Code"
          onPress={forgotPasswordActions.handleRequestOTP}
          loading={isLoading}
          size="large"
          style={styles.submitButton}
        />
      </View>
    </>
  );

  const renderOTPStep = () => {
    const timeLeft = forgotPasswordActions.getTimeUntilExpiry();
    const formattedTime = forgotPasswordActions.formatResendTimer(timeLeft);

    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={forgotPasswordActions.handleBackToEmail}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{'\n'}
            <Text style={styles.emailText}>{emailForm.email}</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Verification Code"
            placeholder="000000"
            value={otpForm.code}
            onChangeText={forgotPasswordActions.handleOTPChange}
            keyboardType="number-pad"
            maxLength={6}
            error={error?.message}
            inputStyle={styles.otpInput}
          />

          <View style={styles.otpInfo}>
            <Text style={styles.expiryText}>
              Code expires in: <Text style={styles.timerText}>{formattedTime}</Text>
            </Text>
          </View>

          <Button
            title="Verify Code"
            onPress={forgotPasswordActions.handleVerifyOTP}
            loading={isLoading}
            size="large"
            style={styles.submitButton}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {resendTimer > 0 ? (
              <Text style={styles.resendTimerText}>
                Resend in {forgotPasswordActions.formatResendTimer(resendTimer)}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={forgotPasswordActions.handleResendOTP}
                disabled={isLoading}
              >
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </>
    );
  };

  const renderSuccessStep = () => (
    <>
      <View style={styles.header}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
        </View>
        <Text style={styles.title}>Password Reset Successful</Text>
        <Text style={styles.subtitle}>
          Your password has been reset successfully.{'\n'}
          Please check your email for the new password.
        </Text>
      </View>

      <View style={styles.form}>
        <Button
          title="Back to Sign In"
          onPress={forgotPasswordActions.handleSuccessNavigation}
          size="large"
        />
      </View>
    </>
  );

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
          {step === 'email' && renderEmailStep()}
          {step === 'otp' && renderOTPStep()}
          {step === 'success' && renderSuccessStep()}
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
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    marginBottom: theme.spacing.lg,
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
    lineHeight: 24,
  },
  emailText: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
  otpInput: {
    fontSize: theme.fontSize.xl,
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '600',
  },
  otpInfo: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  expiryText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  timerText: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  resendText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  resendTimerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  resendLink: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
});