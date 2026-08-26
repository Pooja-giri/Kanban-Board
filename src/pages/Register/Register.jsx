import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
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
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import AnimatedBackground from "../../components/common/AnimatedBackground";
import SocialLogin from "../../components/common/SocialLogin";
import { registerSuccess } from "../../redux/slices/authSlice";
import { useThemeContext } from "../../theme/useThemeContext";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode, toggleTheme, showNotification } = useThemeContext();
  const isDark = mode === "dark";

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Full Name Validation
    const name = formData.name.trim();
    if (!name) {
      newErrors.name = "Full name is required";
    } else if (name.length < 3) {
      newErrors.name = "Full name must be at least 3 characters";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Full name can contain only letters and spaces";
    }

    // Username Validation
    const username = formData.username.trim();
    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (username.length > 20) {
      newErrors.username = "Username cannot exceed 20 characters";
    } else if (!/^[A-Za-z0-9_.-]+$/.test(username)) {
      newErrors.username = "Username can contain letters, numbers, _, . and - only";
    }

    // Email Validation
    const email = formData.email.trim();
    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Contact Number Validation
    const contactNumber = formData.contactNumber.trim();
    if (contactNumber && !/^[0-9]{10}$/.test(contactNumber)) {
      newErrors.contactNumber = "Enter a valid 10-digit mobile number";
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and a number";
    }

    // Profile Image Validation
    if (
      profileImage &&
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(profileImage.type)
    ) {
      newErrors.profileImage = "Please select a JPG, PNG, or WEBP image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Allow only numbers in contact number
    if (name === "contactNumber" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Dynamic error clearing / validation as user types
    setErrors((prev) => {
      const nextErrors = { ...prev };
      const trimmed = value.trim();

      // If user clears the field, remove the error message
      if (!trimmed && name !== "password") {
        delete nextErrors[name];
        return nextErrors;
      }
      if (name === "password" && !value) {
        delete nextErrors.password;
        return nextErrors;
      }

      // Check if current value now passes validation
      if (name === "name") {
        if (!/^[A-Za-z\s]+$/.test(trimmed)) {
          nextErrors.name = "Full name can contain only letters and spaces";
        } else if (trimmed.length >= 3) {
          delete nextErrors.name;
        } else {
          // Keep existing length error if present
          if (nextErrors.name && !nextErrors.name.includes("characters")) {
            delete nextErrors.name;
          }
        }
      } else if (name === "username") {
        if (!/^[A-Za-z0-9_.-]+$/.test(trimmed)) {
          nextErrors.username = "Username can contain letters, numbers, _, . and - only";
        } else if (trimmed.length >= 3 && trimmed.length <= 20) {
          delete nextErrors.username;
        }
      } else if (name === "email") {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          delete nextErrors.email;
        }
      } else if (name === "contactNumber") {
        if (!trimmed || /^[0-9]{10}$/.test(trimmed)) {
          delete nextErrors.contactNumber;
        } else if (trimmed.length < 10) {
          // Clear error while typing until 10 digits unless submitted
          if (nextErrors.contactNumber) {
            delete nextErrors.contactNumber;
          }
        }
      } else if (name === "password") {
        if (value.length >= 6 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          delete nextErrors.password;
        }
      }

      return nextErrors;
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const trimmed = value.trim();

    // Do not show errors on empty fields on blur before submit
    if (!trimmed && name !== "password") {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
      return;
    }

    if (name === "password" && !value) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.password;
        return next;
      });
      return;
    }

    // Validate specific field on blur if filled
    setErrors((prev) => {
      const next = { ...prev };
      if (name === "name") {
        if (trimmed.length < 3) {
          next.name = "Full name must be at least 3 characters";
        } else if (!/^[A-Za-z\s]+$/.test(trimmed)) {
          next.name = "Full name can contain only letters and spaces";
        } else {
          delete next.name;
        }
      } else if (name === "username") {
        if (trimmed.length < 3) {
          next.username = "Username must be at least 3 characters";
        } else if (trimmed.length > 20) {
          next.username = "Username cannot exceed 20 characters";
        } else if (!/^[A-Za-z0-9_.-]+$/.test(trimmed)) {
          next.username = "Username can contain letters, numbers, _, . and - only";
        } else {
          delete next.username;
        }
      } else if (name === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          next.email = "Please enter a valid email address";
        } else {
          delete next.email;
        }
      } else if (name === "contactNumber") {
        if (trimmed && !/^[0-9]{10}$/.test(trimmed)) {
          next.contactNumber = "Enter a valid 10-digit mobile number";
        } else {
          delete next.contactNumber;
        }
      } else if (name === "password") {
        if (value.length < 6) {
          next.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          next.password = "Password must contain uppercase, lowercase, and a number";
        } else {
          delete next.password;
        }
      }
      return next;
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Please select a JPG, PNG, or WEBP image",
      }));
      setProfileImage(null);
      setPreview(null);
      return;
    }

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.profileImage;
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setTimeout(() => {
      const newUser = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        contactNumber: formData.contactNumber.trim(),
        avatar: preview,
        profileImageName: profileImage?.name || null,
      };

      dispatch(registerSuccess(newUser));
      showNotification(`Account created! Welcome to TaskFlow, ${newUser.name}`, "success");
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
      <Box
        sx={{
          position: "absolute",
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 10,
        }}
      >
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

      <Container
        maxWidth="md"
        sx={{
          maxWidth: "720px !important",
          p: 0,
          my: { xs: 2, sm: 4 },
          zIndex: 1,
          position: "relative",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            p: { xs: 3.5, sm: 5.5 },
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
          {/* Header */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
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
              Create Account
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center">
              Join TaskFlow to start managing your workflow visually
            </Typography>
          </Box>

          {/* Social Authentication */}
          <SocialLogin />

          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            {/* Hidden dummy inputs */}
            <input type="text" name="fake_username" style={{ display: "none" }} readOnly tabIndex={-1} />
            <input type="password" name="fake_password" style={{ display: "none" }} readOnly tabIndex={-1} />

            {/* Profile Image */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={5} mt={1}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Avatar
                  src={preview}
                  sx={{
                    width: 88,
                    height: 88,
                    bgcolor: "primary.main",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
                    border: "3px solid",
                    borderColor: "primary.light",
                    cursor: "pointer",
                  }}
                >
                  {formData.name ? formData.name[0].toUpperCase() : <PersonOutlinedIcon fontSize="large" />}
                </Avatar>

                <IconButton
                  component="label"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 28,
                    height: 28,
                    backgroundColor: "primary.main",
                    color: "#FFFFFF",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                    border: "2px solid",
                    borderColor: "background.paper",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                    zIndex: 2,
                  }}
                >
                  <PhotoCameraIcon sx={{ fontSize: 14 }} />
                  <input hidden type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageChange} />
                </IconButton>
              </Box>

              <Typography variant="caption" color="text.secondary">
                {preview ? "✓ Profile photo selected" : "Click avatar to upload photo (optional)"}
              </Typography>

              {errors.profileImage && (
                <Alert severity="error" sx={{ mt: 1, py: 0.2, fontSize: "0.75rem" }}>
                  {errors.profileImage}
                </Alert>
              )}
            </Box>

            <Grid container spacing={2}>
              {/* Full Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.name)}
                  helperText={errors.name || ""}
                  placeholder="Alex Morgan"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Username */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.username)}
                  helperText={errors.username || ""}
                  placeholder="alex_m"
                  autoComplete="new-password"
                  inputProps={{
                    autoComplete: "new-password",
                    maxLength: 20,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.email)}
                  helperText={errors.email || ""}
                  placeholder="alex@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Contact Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number (Optional)"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.contactNumber)}
                  helperText={errors.contactNumber || ""}
                  placeholder="10-digit number"
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.password)}
                  helperText={errors.password || ""}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  inputProps={{
                    autoComplete: "new-password",
                  }}
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
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.4,
                    fontWeight: 700,
                    fontSize: "1rem",
                    borderRadius: 2.5,
                    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)",
                  }}
                >
                  {submitting ? "Creating Account..." : "Create Account"}
                </Button>
              </Grid>
            </Grid>

            {/* Login Link */}
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link component={RouterLink} to="/login" fontWeight={700} color="primary.main" underline="hover">
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;