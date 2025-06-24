export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters long',
      };
    }

    if (password.length > 128) {
      return {
        isValid: false,
        message: 'Password must be less than 128 characters',
      };
    }

    return { isValid: true };
  },

  otp: (code: string): boolean => {
    return /^\d{6}$/.test(code);
  },

  sanitizeOTP: (code: string): string => {
    return code.replace(/[^0-9]/g, '').slice(0, 6);
  },

  isStrongPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  },
};