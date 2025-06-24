import { useSignInStore } from './useStore';
import { router } from 'expo-router';

export const signInActions = {
  handleEmailChange: (email: string) => {
    useSignInStore.getState().setFormField('email', email);
  },

  handlePasswordChange: (password: string) => {
    useSignInStore.getState().setFormField('password', password);
  },

  handleForgotPassword: () => {
    router.push('/(auth)/forget-password');
  },

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateForm: (): boolean => {
    const { form } = useSignInStore.getState();
    
    if (!signInActions.validateEmail(form.email)) {
      useSignInStore.getState().setError({
        message: 'Please enter a valid email address',
      });
      return false;
    }

    if (form.password.length < 6) {
      useSignInStore.getState().setError({
        message: 'Password must be at least 6 characters',
      });
      return false;
    }

    return true;
  },
};