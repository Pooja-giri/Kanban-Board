import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import Captcha from "../../components/common/Captcha";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import SocialLogin from "../../components/common/SocialLogin";
import { loginSuccess } from "../../redux/slices/authSlice";
import { useThemeContext } from "../../theme/useThemeContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { mode, toggleTheme, showNotification } = useThemeContext();
  const isDark = mode === "dark";

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [error, setError] = useState(
    () => new URLSearchParams(location.search).get("auth_error") || "",
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.usernameOrEmail.trim()) {
      setError("Username or email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (!captchaValid) {
      setError("Please enter the security verification code");
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      const user = {
        username: formData.usernameOrEmail.trim(),
        name: formData.usernameOrEmail.trim(),
        email: formData.usernameOrEmail.includes("@")
          ? formData.usernameOrEmail.trim()
          : `${formData.usernameOrEmail.trim()}@example.com`,
      };
      dispatch(loginSuccess(user));
      showNotification(`Welcome back, ${user.username}!`, "success");
      navigate("/dashboard");
    }, 350);
  };

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

      {/* Theme Toggle */}
      <Box sx={{ position: "absolute", top: { xs: 16, sm: 24 }, right: { xs: 16, sm: 24 }, zIndex: 10 }}>
        <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              borderRadius: 2.5,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: isDark ? "rgba(17, 24, 39, 0.7)" : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              p: 1.2,
            }}
          >
            {isDark ? <LightModeIcon sx={{ color: "#FBBF24" }} /> : <DarkModeIcon sx={{ color: "#6366F1" }} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Login Card */}
      <Container maxWidth="sm" sx={{ maxWidth: "560px !important", p: 0, my: { xs: 2, sm: 4 }, zIndex: 1, position: "relative" }}>
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            p: { xs: 3.5, sm: 5 },
            borderRadius: 4,
            border: "1.5px solid",
            borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(99, 102, 241, 0.2)",
            backgroundColor: isDark ? "rgba(17, 24, 39, 0.78)" : "rgba(255, 255, 255, 0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: isDark
              ? "0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.15)"
              : "0 25px 50px -12px rgba(99, 102, 241, 0.18), 0 0 30px rgba(99, 102, 241, 0.08)",
          }}
        >
          {/* Logo & Header */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={3.5}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: "linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 10px 25px rgba(99, 102, 241, 0.45)",
                mb: 1.8,
                transform: "rotate(-2deg)",
              }}
            >
              <ViewKanbanIcon sx={{ fontSize: 34 }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight={800}
              align="center"
              gutterBottom
              sx={{
                letterSpacing: "-0.025em",
                background: isDark
                  ? "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)"
                  : "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Sign in to access your interactive kanban board
            </Typography>
          </Box>

          {/* Social Authentication */}
          <SocialLogin />

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField
              fullWidth
              required
              label="Username or Email"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              margin="normal"
              autoComplete="off"
              inputProps={{ autoComplete: "off" }}
              placeholder="e.g. alex_morgan"
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
              required
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              autoComplete="new-password"
              placeholder="Enter password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Captcha onChange={setCaptchaValid} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={<ArrowForwardIcon />}
              sx={{
                mt: 3,
                py: 1.4,
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: 2.5,
                boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account yet?{" "}
                <Link component={RouterLink} to="/register" fontWeight={700} color="primary.main" underline="hover">
                  Create Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
