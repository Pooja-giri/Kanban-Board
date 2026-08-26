import { createTheme } from "@mui/material/styles";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#6366F1", // Indigo
            light: "#818CF8",
            dark: "#4F46E5",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: "#0EA5E9", // Sky
            light: "#38BDF8",
            dark: "#0284C7",
            contrastText: "#FFFFFF",
          },
          background: {
            default: "#F8FAFC", // Slate 50
            paper: "#FFFFFF",
            subtle: "#F1F5F9",
            card: "#FFFFFF",
          },
          text: {
            primary: "#0F172A", // Slate 900
            secondary: "#64748B", // Slate 500
          },
          divider: "rgba(148, 163, 184, 0.2)",
          success: {
            main: "#10B981", // Emerald
            light: "#D1FAE5",
            dark: "#059669",
            contrastText: "#FFFFFF",
          },
          warning: {
            main: "#F59E0B", // Amber
            light: "#FEF3C7",
            dark: "#D97706",
            contrastText: "#FFFFFF",
          },
          error: {
            main: "#EF4444", // Rose
            light: "#FEE2E2",
            dark: "#DC2626",
            contrastText: "#FFFFFF",
          },
          info: {
            main: "#3B82F6", // Blue
            light: "#DBEAFE",
            dark: "#1D4ED8",
            contrastText: "#FFFFFF",
          },
        }
      : {
          primary: {
            main: "#818CF8", // Indigo light
            light: "#A5B4FC",
            dark: "#6366F1",
            contrastText: "#0F172A",
          },
          secondary: {
            main: "#38BDF8",
            light: "#7DD3FC",
            dark: "#0EA5E9",
            contrastText: "#0F172A",
          },
          background: {
            default: "#0B0F19", // Deep Midnight Slate
            paper: "#111827", // Gray 900
            subtle: "#1F2937", // Gray 800
            card: "#182234",
          },
          text: {
            primary: "#F8FAFC",
            secondary: "#94A3B8",
          },
          divider: "rgba(255, 255, 255, 0.08)",
          success: {
            main: "#34D399",
            light: "#064E3B",
            dark: "#10B981",
            contrastText: "#0F172A",
          },
          warning: {
            main: "#FBBF24",
            light: "#78350F",
            dark: "#F59E0B",
            contrastText: "#0F172A",
          },
          error: {
            main: "#F87171",
            light: "#7F1D1D",
            dark: "#EF4444",
            contrastText: "#0F172A",
          },
          info: {
            main: "#60A5FA",
            light: "#1E3A8A",
            dark: "#3B82F6",
            contrastText: "#0F172A",
          },
        }),
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: "background-color 0.3s ease, color 0.3s ease",
          scrollbarColor: mode === "dark" ? "#374151 #111827" : "#CBD5E1 #F1F5F9",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: mode === "dark" ? "#374151" : "#CBD5E1",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: mode === "dark" ? "#111827" : "#F1F5F9",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "8px 18px",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "none",
          "&:hover": {
            boxShadow:
              mode === "light"
                ? "0 4px 14px 0 rgba(99, 102, 241, 0.3)"
                : "0 4px 14px 0 rgba(129, 140, 248, 0.25)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        containedPrimary: {
          background:
            mode === "light"
              ? "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)"
              : "linear-gradient(135deg, #818CF8 0%, #6366F1 100%)",
        },
        containedSuccess: {
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        },
        containedError: {
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          transition: "box-shadow 0.25s ease, background-color 0.25s ease, border-color 0.25s ease",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          backgroundColor:
            mode === "light"
              ? "rgba(255, 255, 255, 0.88)"
              : "rgba(17, 24, 39, 0.82)",
        },
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow:
            mode === "light"
              ? "0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)"
              : "0 2px 6px 0 rgba(0, 0, 0, 0.4)",
          border: mode === "light" ? "1px solid rgba(226, 232, 240, 0.9)" : "1px solid rgba(255, 255, 255, 0.08)",
        },
        elevation2: {
          boxShadow:
            mode === "light"
              ? "0 6px 16px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)"
              : "0 6px 16px -2px rgba(0, 0, 0, 0.5)",
          border: mode === "light" ? "1px solid rgba(226, 232, 240, 0.9)" : "1px solid rgba(255, 255, 255, 0.09)",
        },
        elevation3: {
          boxShadow:
            mode === "light"
              ? "0 12px 24px -4px rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.04)"
              : "0 12px 24px -4px rgba(0, 0, 0, 0.6)",
        },
        elevation4: {
          boxShadow:
            mode === "light"
              ? "0 24px 36px -6px rgba(0, 0, 0, 0.1), 0 8px 16px -4px rgba(0, 0, 0, 0.06)"
              : "0 24px 36px -6px rgba(0, 0, 0, 0.7)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: mode === "light" ? "1px solid rgba(226, 232, 240, 0.9)" : "1px solid rgba(255, 255, 255, 0.09)",
          backgroundImage: "none",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          backgroundColor:
            mode === "light"
              ? "rgba(255, 255, 255, 0.92)"
              : "rgba(24, 34, 52, 0.85)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: "all 0.2s ease",
          "& fieldset": {
            borderColor: mode === "light" ? "#E2E8F0" : "rgba(255, 255, 255, 0.12)",
          },
          "&:hover fieldset": {
            borderColor: mode === "light" ? "#94A3B8" : "rgba(255, 255, 255, 0.25)",
          },
          "&.Mui-focused fieldset": {
            borderColor: mode === "light" ? "#6366F1" : "#818CF8",
            borderWidth: "2px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          boxShadow:
            mode === "light"
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
          border: mode === "light" ? "1px solid rgba(226, 232, 240, 0.8)" : "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
  },
});

export const createAppTheme = (mode = "light") => {
  return createTheme(getDesignTokens(mode));
};
