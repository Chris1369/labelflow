import { create } from 'zustand';
import { SignUpForm, AuthError } from '@/types/auth';

interface SignUpState {
  form: SignUpForm;
  isLoading: boolean;
  error: AuthError | null;
}

interface SignUpActions {
  setFormField: (field: keyof SignUpForm, value: string) => void;
  setError: (error: AuthError | null) => void;
  setLoading: (isLoading: boolean) => void;
  resetForm: () => void;
}

const initialForm: SignUpForm = {
  email: '',
  password: '',
  name: '',
};

export const useSignUpStore = create<SignUpState & SignUpActions>((set, get) => ({
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