import { useSignUpStore } from './useStore';
import { router } from 'expo-router';

export const signUpActions = {
  handleNameChange: (name: string) => {
    useSignUpStore.getState().setFormField('name', name);
  },

  handleEmailChange: (email: string) => {
    useSignUpStore.getState().setFormField('email', email);
  },

  handlePasswordChange: (password: string) => {
    useSignUpStore.getState().setFormField('password', password);
  },

  navigateToSignIn: () => {
    router.push('/(auth)/signin');
  },

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateForm: (): boolean => {
    const { form } = useSignUpStore.getState();
    
    if (!form.name || form.name.trim().length < 2) {
      useSignUpStore.getState().setError({
        message: 'Name must be at least 2 characters',
      });
      return false;
    }
    
    if (!signUpActions.validateEmail(form.email)) {
      useSignUpStore.getState().setError({
        message: 'Please enter a valid email address',
      });
      return false;
    }

    if (form.password.length < 6) {
      useSignUpStore.getState().setError({
        message: 'Password must be at least 6 characters',
      });
      return false;
    }

    return true;
  },
};