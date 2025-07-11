import { create } from 'zustand';
import { SignInForm, AuthError } from '@/types/auth';

interface SignInState {
  form: SignInForm;
  isLoading: boolean;
  error: AuthError | null;
}

interface SignInActions {
  setFormField: (field: keyof SignInForm, value: string) => void;
  setError: (error: AuthError | null) => void;
  setLoading: (isLoading: boolean) => void;
  resetForm: () => void;
}

const initialForm: SignInForm = {
  email: '',
  password: '',
};

export const useSignInStore = create<SignInState & SignInActions>((set, get) => ({
  form: initialForm,
  isLoading: false,
  error: null,

  setFormField: (field, value) => {
    set((state) => ({
      form: { ...state.form, [field]: value },
      error: null,
    }));
  },

  setError: (error) => set({ error }),

  setLoading: (isLoading) => set({ isLoading }),

  resetForm: () => set({ form: initialForm, error: null }),
}));