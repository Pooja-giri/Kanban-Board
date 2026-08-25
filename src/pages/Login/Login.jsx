import { useState } from "react";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import { useDispatch } from "react-redux";

import Captcha from "../../components/common/Captcha";

import {
  loginSuccess,
} from "../../redux/slices/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [captchaValid, setCaptchaValid] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    // Remove the error when the user starts correcting input
    if (error) {
      setError("");
    }
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
      setError("Please enter the correct CAPTCHA");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
      Temporary login logic.

      Replace this later with your authentication API.
    */
    const user = {
      username: formData.usernameOrEmail.trim(),
    };

    dispatch(loginSuccess(user));

    navigate("/dashboard");
  };

  const handleCaptchaChange = (isValid) => {
    setCaptchaValid(isValid);

    if (error && isValid) {
      setError("");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          padding: {
            xs: 3,
            sm: 4,
          },
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          Welcome Back
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{
            marginBottom: 3,
          }}
        >
          Sign in to manage your tasks
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              marginBottom: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Username or Email */}
          <TextField
            fullWidth
            required
            label="Username or Email"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            margin="normal"
            autoComplete="username"
          />

          {/* Password */}
          <TextField
            fullWidth
            required
            label="Password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword(
                        (previousValue) =>
                          !previousValue
                      )
                    }
                    edge="end"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* CAPTCHA */}
          <Captcha
            onChange={handleCaptchaChange}
          />

          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              marginTop: 3,
            }}
          >
            Login
          </Button>

          {/* Registration Link */}
          <Typography
            align="center"
            variant="body2"
            sx={{
              marginTop: 3,
            }}
          >
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;