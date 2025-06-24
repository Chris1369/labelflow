import { create } from 'zustand';
import { SignInForm, AuthError, User, AuthProvider } from '../../types/auth';

interface SignInState {
  form: SignInForm;
  isLoading: boolean;
  error: AuthError | null;
  user: User | null;
}

interface SignInActions {
  setFormField: (field: keyof SignInForm, value: string) => void;
  setError: (error: AuthError | null) => void;
  setLoading: (isLoading: boolean) => void;
  setUser: (user: User | null) => void;
  resetForm: () => void;
  signInWithEmail: () => Promise<void>;
  signInWithProvider: (provider: AuthProvider) => Promise<void>;
}

const initialForm: SignInForm = {
  email: '',
  password: '',
};

export const useSignInStore = create<SignInState & SignInActions>((set, get) => ({
  form: initialForm,
  isLoading: false,
  error: null,
  user: null,

  setFormField: (field, value) => {
    set((state) => ({
      form: { ...state.form, [field]: value },
      error: null,
    }));
  },

  setError: (error) => set({ error }),

  setLoading: (isLoading) => set({ isLoading }),

  setUser: (user) => set({ user }),

  resetForm: () => set({ form: initialForm, error: null }),

  signInWithEmail: async () => {
    const { form } = get();
    set({ isLoading: true, error: null });

    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate successful login
      const mockUser: User = {
        id: '1',
        email: form.email,
        name: 'John Doe',
      };
      
      set({ user: mockUser, isLoading: false });
    } catch (error) {
      set({
        error: { message: 'Invalid email or password' },
        isLoading: false,
      });
    }
  },

  signInWithProvider: async (provider) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Implement actual OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate successful login
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: 'OAuth User',
      };
      
      set({ user: mockUser, isLoading: false });
    } catch (error) {
      set({
        error: { message: `Failed to sign in with ${provider}` },
        isLoading: false,
      });
    }
  },
}));