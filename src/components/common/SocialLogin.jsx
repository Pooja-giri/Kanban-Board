import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { useThemeContext } from "../../theme/useThemeContext";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

// Google Multi-Color SVG Icon
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
  </svg>
);

// GitHub SVG Icon
const GithubIcon = ({ color, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// Microsoft SVG Icon
const MicrosoftIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 23 23">
    <path fill="#f35325" d="M1 1h10v10H1z" />
    <path fill="#81bc06" d="M12 1h10v10H12z" />
    <path fill="#05a6f0" d="M1 12h10v10H1z" />
    <path fill="#ffba08" d="M12 12h10v10H12z" />
  </svg>
);

function SocialLogin() {
  const { mode } = useThemeContext();
  const isDark = mode === "dark";

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE}/api/auth/github`;
  };

  const handleMicrosoftLogin = () => {
    window.location.href = `${API_BASE}/api/auth/microsoft`;
  };

  const pillButtonStyles = {
    py: 1.3,
    px: 3,
    fontWeight: 700,
    fontSize: "0.92rem",
    borderRadius: "9999px",
    textTransform: "none",
    letterSpacing: "-0.01em",
    borderColor: isDark ? "rgba(255, 255, 255, 0.28)" : "rgba(0, 0, 0, 0.28)",
    color: "text.primary",
    backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.8)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      borderColor: isDark ? "#FFFFFF" : "#000000",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
      transform: "scale(1.01)",
    },
    "&:active": {
      transform: "scale(0.99)",
    },
  };

  return (
    <Box sx={{ width: "100%", my: 1 }}>
      {/* Spotify-style Stacked Pill Buttons */}
      <Stack spacing={1.5}>
        {/* Continue with Google (PDF Page 7) */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleLogin}
          startIcon={
            <Box sx={{ display: "flex", alignItems: "center", mr: 0.5 }}>
              <GoogleIcon />
            </Box>
          }
          sx={pillButtonStyles}
        >
          Continue with Google
        </Button>

        {/* Continue with GitHub */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGithubLogin}
          startIcon={
            <Box sx={{ display: "flex", alignItems: "center", mr: 0.5 }}>
              <GithubIcon color={isDark ? "#FFFFFF" : "#181717"} />
            </Box>
          }
          sx={pillButtonStyles}
        >
          Continue with GitHub
        </Button>

        {/* Continue with Microsoft */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleMicrosoftLogin}
          startIcon={
            <Box sx={{ display: "flex", alignItems: "center", mr: 0.5 }}>
              <MicrosoftIcon />
            </Box>
          }
          sx={pillButtonStyles}
        >
          Continue with Microsoft
        </Button>
      </Stack>

      {/* Spotify-style 'or' Divider */}
      <Divider
        sx={{
          my: 3,
          "&::before, &::after": {
            borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            px: 1.5,
            fontWeight: 600,
            fontSize: "0.8rem",
            textTransform: "lowercase",
          }}
        >
          or
        </Typography>
      </Divider>
    </Box>
  );
}

export default SocialLogin;
