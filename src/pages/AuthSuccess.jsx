import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { loginSuccess } from "../redux/slices/authSlice";
import { useThemeContext } from "../theme/useThemeContext";
import AnimatedBackground from "../components/common/AnimatedBackground";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode, showNotification } = useThemeContext();

  const isDark = mode === "dark";

  const token = searchParams.get("token");
  const userParam = searchParams.get("user");
  const isDemo = searchParams.get("demo") === "true";
  const provider = searchParams.get("provider") || "Google";

  const [customUsername, setCustomUsername] = useState("");

  const loading = Boolean(token);

  useEffect(() => {
    if (token) {
      try {
        localStorage.setItem("token", token);

        let userData = null;

        if (userParam) {
          userData = JSON.parse(decodeURIComponent(userParam));
        } else {
          const base64Url = token.split(".")[1];
          const base64 = base64Url
            .replace(/-/g, "+")
            .replace(/_/g, "/");

          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(
                (c) =>
                  "%" +
                  ("00" + c.charCodeAt(0).toString(16)).slice(-2)
              )
              .join("")
          );

          const payload = JSON.parse(jsonPayload);

          userData = {
            name: payload.name || payload.username || "Google User",
            username: payload.username || payload.name || "GoogleUser",
            email: payload.email || "",
            avatar: payload.avatar || null,
            provider: payload.provider || provider,
          };
        }

        dispatch(loginSuccess(userData));

        showNotification(
          `Welcome back, ${userData.name || userData.username}!`,
          "success"
        );

        setTimeout(() => {
          navigate("/dashboard", {
            replace: true,
          });
        }, 800);
      } catch (err) {
        console.error("Failed to parse token:", err);

        navigate("/login", {
          replace: true,
        });
      }
    }
  }, [
    token,
    userParam,
    provider,
    dispatch,
    navigate,
    showNotification,
  ]);

  const handleDemoSubmit = (e) => {
    e.preventDefault();

    const cleanUser = customUsername.trim();

    if (!cleanUser) return;

    const username = cleanUser.includes("@")
      ? cleanUser.split("@")[0]
      : cleanUser;

    const user = {
      name: username,
      username,

      email: cleanUser.includes("@")
        ? cleanUser
        : `${cleanUser
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")}@${provider.toLowerCase()}.com`,

      provider,
      token: "demo_oauth_jwt_token",
    };

    localStorage.setItem("token", "demo_oauth_jwt_token");

    dispatch(loginSuccess(user));

    showNotification(
      `Signed in as "${user.username}" via ${provider}!`,
      "success"
    );

    navigate("/dashboard", {
      replace: true,
    });
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

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

      {/* Back to Login Button */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
          zIndex: 10,
        }}
      >
        <Button
          onClick={handleBackToLogin}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: 2.5,
            px: 2,
            py: 0.8,
            fontWeight: 700,
            color: isDark ? "#F8FAFC" : "#0F172A",
            backgroundColor: isDark
              ? "rgba(17, 24, 39, 0.92)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.3)"
              : "rgba(15, 23, 42, 0.16)",
            "&:hover": {
              backgroundColor: isDark
                ? "rgba(30, 41, 59, 1)"
                : "#FFFFFF",
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(15, 23, 42, 0.32)",
            },
          }}
        >
          Back to Login
        </Button>
      </Box>

      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Paper
          elevation={8}
          sx={{
            p: { xs: 4, sm: 5 },
            borderRadius: 4,
            textAlign: "center",
            border: "1.5px solid",
            borderColor: isDark
              ? "rgba(255,255,255,0.12)"
              : "rgba(99,102,241,0.2)",
            backgroundColor: isDark
              ? "rgba(17,24,39,0.88)"
              : "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
          }}
        >
          {loading && (
            <>
              <CheckCircleOutlinedIcon
                sx={{
                  fontSize: 56,
                  color: "success.main",
                  mb: 2,
                }}
              />

              <Typography variant="h6" fontWeight={700} gutterBottom>
                Authentication Successful!
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Redirecting to your dashboard…
              </Typography>

              <CircularProgress
                size={32}
                thickness={4}
                sx={{ color: "primary.main" }}
              />
            </>
          )}

          {!loading && isDemo && (
            <>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Continue with {provider}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Enter your {provider} account name or email to continue to
                your dashboard:
              </Typography>

              <Box component="form" onSubmit={handleDemoSubmit}>
                <TextField
                  fullWidth
                  required
                  autoFocus
                  autoComplete="email"
                  label={`${provider} Username or Email`}
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  placeholder=""
                  InputProps={{
                    startAdornment: (
                      <PersonOutlinedIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          color: isDark ? "#CBD5E1" : "#64748B",
                        }}
                      />
                    ),
                  }}
                  sx={{
                    mb: 2.5,

                    /* Normal input text */
                    "& .MuiInputBase-input": {
                      color: isDark ? "#F8FAFC" : "#0F172A",
                      WebkitTextFillColor: isDark
                        ? "#F8FAFC"
                        : "#0F172A",
                      caretColor: isDark ? "#F8FAFC" : "#0F172A",
                    },

                    /* Lighter placeholder */
                    "& .MuiInputBase-input::placeholder": {
                      color: isDark ? "#CBD5E1" : "#94A3B8",
                      opacity: 1,
                    },

                    /* Chrome / Edge autofill */
                    "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active":
                      {
                        WebkitTextFillColor: isDark
                          ? "#F8FAFC"
                          : "#0F172A",

                        WebkitBoxShadow: `0 0 0 1000px ${
                          isDark ? "#111827" : "#FFFFFF"
                        } inset`,

                        boxShadow: `0 0 0 1000px ${
                          isDark ? "#111827" : "#FFFFFF"
                        } inset`,

                        caretColor: isDark ? "#F8FAFC" : "#0F172A",

                        transition:
                          "background-color 5000s ease-in-out 0s",
                      },

                    /* Label */
                    "& .MuiInputLabel-root": {
                      color: isDark ? "#CBD5E1" : "#64748B",
                    },

                    "& .MuiInputLabel-root.Mui-focused": {
                      color: isDark ? "#A5B4FC" : "primary.main",
                    },

                    /* Input border */
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: isDark
                          ? "rgba(255,255,255,0.25)"
                          : "rgba(15,23,42,0.23)",
                      },

                      "&:hover fieldset": {
                        borderColor: isDark
                          ? "rgba(255,255,255,0.5)"
                          : "primary.main",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.3,
                    fontWeight: 700,
                    borderRadius: 2.5,
                  }}
                >
                  Sign In & Continue
                </Button>
              </Box>
            </>
          )}

          {!loading && !isDemo && !token && (
            <>
              <ErrorOutlinedIcon
                sx={{
                  fontSize: 56,
                  color: "error.main",
                  mb: 2,
                }}
              />

              <Typography variant="h6" fontWeight={700} gutterBottom>
                Sign-In Failed
              </Typography>

              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  textAlign: "left",
                }}
              >
                No authentication token was received.
              </Alert>

              <Button
                onClick={handleBackToLogin}
                variant="contained"
                fullWidth
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 700,
                  py: 1.2,
                }}
              >
                Back to Login
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthSuccess;