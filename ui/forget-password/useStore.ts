import { create } from 'zustand';
import { ForgotPasswordForm, OTPForm, AuthError, OTPSession } from '../../types/auth';

interface ForgotPasswordState {
  step: 'email' | 'otp' | 'success';
  emailForm: ForgotPasswordForm;
  otpForm: OTPForm;
  otpSession: OTPSession | null;
  isLoading: boolean;
  error: AuthError | null;
  resendTimer: number;
}

interface ForgotPasswordActions {
  setStep: (step: ForgotPasswordState['step']) => void;
  setEmailField: (email: string) => void;
  setOTPField: (code: string) => void;
  setError: (error: AuthError | null) => void;
  setLoading: (isLoading: boolean) => void;
  setOTPSession: (session: OTPSession | null) => void;
  setResendTimer: (timer: number) => void;
  resetForm: () => void;
  requestOTP: () => Promise<void>;
  verifyOTP: () => Promise<void>;
  resendOTP: () => Promise<void>;
  startResendTimer: () => void;
}

const initialEmailForm: ForgotPasswordForm = {
  email: '',
};

const initialOTPForm: OTPForm = {
  code: '',
};

export const useForgotPasswordStore = create<ForgotPasswordState & ForgotPasswordActions>((set, get) => ({
  step: 'email',
  emailForm: initialEmailForm,
  otpForm: initialOTPForm,
  otpSession: null,
  isLoading: false,
  error: null,
  resendTimer: 0,

  setStep: (step) => set({ step, error: null }),

  setEmailField: (email) => {
    set((state) => ({
      emailForm: { email },
      error: null,
    }));
  },

  setOTPField: (code) => {
    set((state) => ({
      otpForm: { code },
      error: null,
    }));
  },

  setError: (error) => set({ error }),

  setLoading: (isLoading) => set({ isLoading }),

  setOTPSession: (otpSession) => set({ otpSession }),

  setResendTimer: (resendTimer) => set({ resendTimer }),

  resetForm: () => set({
    step: 'email',
    emailForm: initialEmailForm,
    otpForm: initialOTPForm,
    otpSession: null,
    error: null,
    resendTimer: 0,
  }),

  requestOTP: async () => {
    const { emailForm } = get();
    set({ isLoading: true, error: null });

    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate OTP session creation
      const otpSession: OTPSession = {
        email: emailForm.email,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      };
      
      set({
        otpSession,
        step: 'otp',
        isLoading: false,
      });
      
      // Start resend timer
      get().startResendTimer();
    } catch (error) {
      set({
        error: { message: 'Failed to send OTP. Please try again.' },
        isLoading: false,
      });
    }
  },

  verifyOTP: async () => {
    const { otpForm, otpSession } = get();
    
    if (!otpSession) {
      set({ error: { message: 'OTP session expired. Please request a new code.' } });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Check if OTP is expired
      if (new Date() > otpSession.expiresAt) {
        set({
          error: { message: 'OTP has expired. Please request a new code.' },
          isLoading: false,
          step: 'email',
          otpSession: null,
        });
        return;
      }
      
      // Simulate OTP verification (mock check)
      if (otpForm.code !== '123456') {
        set({
          error: { message: 'Invalid OTP code. Please try again.' },
          isLoading: false,
        });
        return;
      }
      
      set({
        step: 'success',
        isLoading: false,
      });
    } catch (error) {
      set({
        error: { message: 'Failed to verify OTP. Please try again.' },
        isLoading: false,
      });
    }
  },

  resendOTP: async () => {
    const { otpSession } = get();
    
    if (!otpSession) return;
    
    set({ isLoading: true, error: null });

    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update OTP session with new expiry
      const newOTPSession: OTPSession = {
        email: otpSession.email,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      };
      
      set({
        otpSession: newOTPSession,
        isLoading: false,
        otpForm: initialOTPForm,
      });
      
      // Restart resend timer
      get().startResendTimer();
    } catch (error) {
      set({
        error: { message: 'Failed to resend OTP. Please try again.' },
        isLoading: false,
      });
    }
  },

  startResendTimer: () => {
    set({ resendTimer: 60 }); // 60 seconds
    
    const interval = setInterval(() => {
      const { resendTimer } = get();
      if (resendTimer > 0) {
        set({ resendTimer: resendTimer - 1 });
      } else {
        clearInterval(interval);
      }
    }, 1000);
  },
}));