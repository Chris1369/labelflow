export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    text: string;
    textSecondary: string;
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    border: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  fonts: {
    title: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    subtitle: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    body: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    button: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    label: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
  };
}

export const theme: Theme = {
  colors: {
    primary: "#FF6D7E",
    secondary: "#fff",
    error: "#DC2626",
    success: "#16A34A",
    warning: "#F59E0B",
    info: "#3B82F6",
    text: "#1F2937",
    textSecondary: "#6B7280",
    background: "#FFFFFF",
    backgroundSecondary: "#F3F4F6",
    backgroundTertiary: "#E5E7EB",
    border: "#E5E7EB",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fonts: {
    title: {
      fontSize: 28,
      fontWeight: "700",
      lineHeight: 36,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "600",
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 20,
    },
    button: {
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 24,
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
      lineHeight: 16,
    },
  },
};
