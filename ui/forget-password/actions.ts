import { useForgotPasswordStore } from './useStore';
import { router } from 'expo-router';

export const forgotPasswordActions = {
  handleEmailChange: (email: string) => {
    useForgotPasswordStore.getState().setEmailField(email);
  },

  handleOTPChange: (code: string) => {
    // Only allow numbers and limit to 6 digits
    const sanitizedCode = code.replace(/[^0-9]/g, '').slice(0, 6);
    useForgotPasswordStore.getState().setOTPField(sanitizedCode);
  },

  handleRequestOTP: async () => {
    const { emailForm, requestOTP } = useForgotPasswordStore.getState();
    
    if (!emailForm.email) {
      useForgotPasswordStore.getState().setError({
        message: 'Please enter your email address',
      });
      return;
    }

    if (!forgotPasswordActions.validateEmail(emailForm.email)) {
      useForgotPasswordStore.getState().setError({
        message: 'Please enter a valid email address',
      });
      return;
    }

    await requestOTP();
  },

  handleVerifyOTP: async () => {
    const { otpForm, verifyOTP } = useForgotPasswordStore.getState();
    
    if (!otpForm.code || otpForm.code.length !== 6) {
      useForgotPasswordStore.getState().setError({
        message: 'Please enter a 6-digit OTP code',
      });
      return;
    }

    await verifyOTP();
  },

  handleResendOTP: async () => {
    const { resendTimer, resendOTP } = useForgotPasswordStore.getState();
    
    if (resendTimer > 0) return;
    
    await resendOTP();
  },

  handleBackToEmail: () => {
    useForgotPasswordStore.getState().setStep('email');
    useForgotPasswordStore.getState().setOTPField('');
    useForgotPasswordStore.getState().setError(null);
  },

  handleBackToSignIn: () => {
    useForgotPasswordStore.getState().resetForm();
    router.back();
  },

  handleSuccessNavigation: () => {
    useForgotPasswordStore.getState().resetForm();
    router.replace('/(auth)/signin');
  },

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  formatResendTimer: (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  getTimeUntilExpiry: (): number => {
    const { otpSession } = useForgotPasswordStore.getState();
    if (!otpSession) return 0;
    
    const now = new Date().getTime();
    const expiry = otpSession.expiresAt.getTime();
    const diff = Math.max(0, expiry - now);
    
    return Math.floor(diff / 1000); // Convert to seconds
  },
};