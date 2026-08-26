import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import { loginSuccess } from "../../redux/slices/authSlice";
import { useThemeContext } from "../../theme/useThemeContext";
import AnimatedBackground from "../../components/common/AnimatedBackground";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Provider Icons
const GoogleIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
  </svg>
);

const GithubIcon = ({ color, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const MicrosoftIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 23 23">
    <path fill="#f35325" d="M1 1h10v10H1z" />
    <path fill="#81bc06" d="M12 1h10v10H12z" />
    <path fill="#05a6f0" d="M1 12h10v10H1z" />
    <path fill="#ffba08" d="M12 12h10v10H12z" />
  </svg>
);

const PROVIDER_URLS = {
  Google: "https://accounts.google.com/signin",
  GitHub: "https://github.com/login",
  Microsoft: "https://login.live.com/",
};

function SocialAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mode, toggleTheme, showNotification } = useThemeContext();
  const isDark = mode === "dark";

  const code = searchParams.get("code");
  const rawProvider = searchParams.get("provider") || "Google";
  const provider =
    rawProvider.toLowerCase() === "github"
      ? "GitHub"
      : rawProvider.toLowerCase() === "microsoft"
      ? "Microsoft"
      : "Google";

  // OAuth Code Exchange State
  const [codeStatus, setCodeStatus] = useState(code ? "loading" : "idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Dynamic Client Input State (when logging in dynamically)
  const [userName, setUserName] = useState("");
  const [clientId, setClientId] = useState("");
  const [showCustomClientId, setShowCustomClientId] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!code) return;

    // Live OAuth callback code exchange
    fetch(`${API_URL}/api/auth/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Sign-in could not be completed.");
        return data;
      })
      .then(({ user }) => {
        dispatch(
          loginSuccess({
            name: user.name || user.username,
            username: user.username,
            email: user.email || "",
            avatar: user.avatar || null,
            provider: user.provider,
          })
        );
        setCodeStatus("success");
        showNotification(`Welcome back, ${user.username}!`, "success");
        setTimeout(() => navigate("/dashboard", { replace: true }), 1000);
      })
      .catch((err) => {
        setCodeStatus("error");
        setErrorMessage(err.message || "Failed to complete authentication.");
      });
  }, [code, dispatch, navigate, showNotification]);

  const handleDynamicSubmit = (e) => {
    e.preventDefault();
    const cleanUser = userName.trim();
    if (!cleanUser) {
      setErrorMessage(`Please enter your ${provider} user name or account ID`);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const displayName = cleanUser.includes("@") ? cleanUser.split("@")[0] : cleanUser;
      const formattedEmail = cleanUser.includes("@")
        ? cleanUser
        : `${cleanUser.toLowerCase().replace(/[^a-z0-9]/g, "")}@${provider.toLowerCase()}.com`;

      const user = {
        name: displayName,
        username: displayName,
        email: formattedEmail,
        provider: provider,
        clientId: clientId.trim() || undefined,
      };

      dispatch(loginSuccess(user));
      showNotification(`Signed in as "${user.username}" via ${provider}!`, "success");
      navigate("/dashboard");
    }, 450);
  };

  const getProviderMeta = () => {
    switch (provider) {
      case "GitHub":
        return {
          title: "Sign in to GitHub",
          subtitle: "Connect your GitHub account to TaskFlow",
          icon: <GithubIcon color={isDark ? "#FFF" : "#24292F"} size={32} />,
          brandColor: isDark ? "#FFF" : "#24292F",
          label: "GitHub Username / Account ID",
          placeholder: "e.g. dev_alex or alex_github",
        };
      case "Microsoft":
        return {
          title: "Sign in to Microsoft",
          subtitle: "Connect your Microsoft account to TaskFlow",
          icon: <MicrosoftIcon size={32} />,
          brandColor: "#05a6f0",
          label: "Microsoft Account / User ID",
          placeholder: "e.g. alex.m@outlook.com or Alex Morgan",
        };
      case "Google":
      default:
        return {
          title: "Sign in with Google",
          subtitle: "Connect your Google account to TaskFlow",
          icon: <GoogleIcon size={32} />,
          brandColor: "#4285F4",
          label: "Google Name / Email ID",
          placeholder: "e.g. Alex Morgan or alex@gmail.com",
        };
    }
  };

  const meta = getProviderMeta();

  // If a live code is being processed
  if (code) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          position: "relative",
        }}
      >
        <AnimatedBackground />
        <Container maxWidth="xs" sx={{ zIndex: 1 }}>
          <Paper
            elevation={8}
            sx={{
              p: 5,
              borderRadius: 4,
              textAlign: "center",
              border: "1.5px solid",
              borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(99,102,241,0.2)",
              backgroundColor: isDark ? "rgba(17,24,39,0.88)" : "rgba(255,255,255,0.92)",
              backdropFilter: "blur(20px)",
            }}
          >
            {codeStatus === "loading" && (
              <>
                <CircularProgress size={52} thickness={4} sx={{ mb: 3, color: "primary.main" }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Connecting to {provider}…
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Retrieving your account username and profile.
                </Typography>
              </>
            )}

            {codeStatus === "success" && (
              <>
                <CheckCircleOutlinedIcon sx={{ fontSize: 56, color: "success.main", mb: 2 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Signed in successfully!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Redirecting to your dashboard…
                </Typography>
              </>
            )}

            {codeStatus === "error" && (
              <>
                <ErrorOutlinedIcon sx={{ fontSize: 56, color: "error.main", mb: 2 }} />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Sign-in failed
                </Typography>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2, textAlign: "left" }}>
                  {errorMessage}
                </Alert>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  fullWidth
                  sx={{ borderRadius: 2.5, fontWeight: 700, py: 1.2 }}
                >
                  Back to Login
                </Button>
              </>
            )}
          </Paper>
        </Container>
      </Box>
    );
  }

  // Dynamic Social Sign-In (Client dynamic credentials)
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3 },
        position: "relative",
      }}
    >
      <AnimatedBackground />

      {/* Top Navigation */}
      <Box sx={{ position: "absolute", top: { xs: 16, sm: 24 }, left: { xs: 16, sm: 24 }, zIndex: 10 }}>
        <Button
          component={RouterLink}
          to="/login"
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: 2.5,
            px: 2,
            py: 0.8,
            fontWeight: 600,
            backgroundColor: isDark ? "rgba(17, 24, 39, 0.7)" : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          Back to Login
        </Button>
      </Box>

      <Box sx={{ position: "absolute", top: { xs: 16, sm: 24 }, right: { xs: 16, sm: 24 }, zIndex: 10 }}>
        <Tooltip title={isDark ? "Light Mode" : "Dark Mode"}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              borderRadius: 2.5,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: isDark ? "rgba(17, 24, 39, 0.7)" : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              p: 1.2,
            }}
          >
            {isDark ? <LightModeIcon sx={{ color: "#FBBF24" }} /> : <DarkModeIcon sx={{ color: "#6366F1" }} />}
          </IconButton>
        </Tooltip>
      </Box>

      <Container maxWidth="sm" sx={{ maxWidth: "520px !important", zIndex: 1, my: 4 }}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: 4,
            border: "1.5px solid",
            borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(99, 102, 241, 0.2)",
            backgroundColor: isDark ? "rgba(17, 24, 39, 0.85)" : "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(20px)",
            boxShadow: isDark
              ? "0 25px 60px rgba(0, 0, 0, 0.7)"
              : "0 25px 50px rgba(99, 102, 241, 0.18)",
          }}
        >
          {/* Header */}
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mb={3}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.8,
                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                border: "1px solid",
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
              }}
            >
              {meta.icon}
            </Box>

            <Typography variant="h5" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.02em" }}>
              {meta.title}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {meta.subtitle}
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleDynamicSubmit} noValidate autoComplete="off">
            <Stack spacing={2}>
              <TextField
                fullWidth
                required
                label={meta.label}
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder={meta.placeholder}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label={`${provider} Password`}
                type="password"
                defaultValue="••••••••"
                placeholder="Enter password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Optional Custom Client ID toggle for enterprise/different client IDs */}
              <Box>
                <Button
                  size="small"
                  onClick={() => setShowCustomClientId((prev) => !prev)}
                  sx={{ textTransform: "none", fontSize: "0.8rem", px: 0 }}
                >
                  {showCustomClientId ? "− Hide Client / App ID" : "+ Specify custom Client / App ID (Optional)"}
                </Button>

                {showCustomClientId && (
                  <TextField
                    fullWidth
                    size="small"
                    label={`Custom ${provider} Client ID (Optional)`}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="e.g. 1234567890-client.apps.googleusercontent.com"
                    sx={{ mt: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyOutlinedIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Box>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting}
              endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
              sx={{
                mt: 3,
                py: 1.4,
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: 2.5,
                backgroundColor: meta.brandColor !== "#FFF" ? meta.brandColor : "#24292F",
                color: "#FFF",
                boxShadow: "0 8px 20px rgba(99, 102, 241, 0.35)",
              }}
            >
              {submitting ? `Signing In with ${provider}…` : `Sign In & Continue to Dashboard`}
            </Button>

            {/* Direct Official Page Link */}
            <Box textAlign="center" mt={2.5}>
              <Button
                variant="text"
                size="small"
                onClick={() => window.open(PROVIDER_URLS[provider], "_blank", "noopener,noreferrer")}
                startIcon={<OpenInNewIcon fontSize="small" />}
                sx={{ textTransform: "none", color: "text.secondary", fontSize: "0.82rem" }}
              >
                Open official {provider} sign-in page in new tab
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SocialAuth;
