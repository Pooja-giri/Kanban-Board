import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";

import { logout } from "../../redux/slices/authSlice";
import { useThemeContext } from "../../theme/useThemeContext";
import AnimatedBackground from "./AnimatedBackground";

function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme, showNotification } = useThemeContext();

  const user = useSelector((state) => state.auth.user);
  const tasks = useSelector((state) => state.tasks.tasks);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    showNotification("You have successfully logged out", "info");
    navigate("/login");
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isDashboard = location.pathname === "/dashboard";
  const isTasks = location.pathname === "/tasks";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "text.primary",
        position: "relative",
      }}
    >
      {/* Animated Floating Theme Background */}
      <AnimatedBackground />

      {/* Sticky Glassmorphic Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor:
            mode === "dark"
              ? "rgba(17, 24, 39, 0.75)"
              : "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 70 } }}>
            {/* Brand Logo & Name */}
            <Box
              component={Link}
              to="/dashboard"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                color: "inherit",
                marginRight: { xs: 2, md: 4 },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  background: "linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
                }}
              >
                <ViewKanbanIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{
                    background:
                      mode === "dark"
                        ? "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)"
                        : "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1.1,
                  }}
                >
                  TaskFlow
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em" }}
                >
                  PRO KANBAN
                </Typography>
              </Box>
            </Box>

            {/* Navigation Links */}
            <Box sx={{ display: "flex", gap: 1, flexGrow: 1 }}>
              <Button
                component={Link}
                to="/dashboard"
                startIcon={<DashboardIcon fontSize="small" />}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 0.8,
                  fontWeight: 600,
                  color: isDashboard ? "primary.main" : "text.secondary",
                  backgroundColor: isDashboard
                    ? mode === "dark"
                      ? "rgba(129, 140, 248, 0.12)"
                      : "rgba(99, 102, 241, 0.08)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                Dashboard
              </Button>

              <Button
                component={Link}
                to="/tasks"
                startIcon={<ViewKanbanIcon fontSize="small" />}
                endIcon={
                  tasks.length > 0 ? (
                    <Chip
                      label={tasks.length}
                      size="small"
                      color={isTasks ? "primary" : "default"}
                      sx={{
                        height: 20,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        ml: 0.5,
                      }}
                    />
                  ) : null
                }
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 0.8,
                  fontWeight: 600,
                  color: isTasks ? "primary.main" : "text.secondary",
                  backgroundColor: isTasks
                    ? mode === "dark"
                      ? "rgba(129, 140, 248, 0.12)"
                      : "rgba(99, 102, 241, 0.08)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                Board
              </Button>
            </Box>

            {/* Right Side: Theme Switcher & User Profile */}
            <Box disableGutters sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {/* Theme Toggle */}
              <Tooltip title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    color: "text.primary",
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.04)",
                    "&:hover": {
                      backgroundColor:
                        mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.08)",
                    },
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  {mode === "dark" ? (
                    <LightModeIcon sx={{ color: "#FBBF24" }} />
                  ) : (
                    <DarkModeIcon sx={{ color: "#6366F1" }} />
                  )}
                </IconButton>
              </Tooltip>

              {/* User Avatar & Menu */}
              <Tooltip title="Account settings">
                <Button
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0.5,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    textTransform: "none",
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(255, 255, 255, 0.04)"
                        : "rgba(0, 0, 0, 0.03)",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      backgroundColor:
                        mode === "dark"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.06)",
                    },
                  }}
                >
                  <Avatar
                    src={user?.avatar || undefined}
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                    }}
                  >
                    {getUserInitials(user?.username || user?.name)}
                  </Avatar>
                  <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "left", pr: 1 }}>
                    <Typography variant="body2" fontWeight={700} lineHeight={1.2}>
                      {user?.username || "Guest User"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" lineHeight={1}>
                      Online
                    </Typography>
                  </Box>
                </Button>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  sx: {
                    minWidth: 200,
                    p: 1,
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {user?.username || "User Account"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email || "Signed in"}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/dashboard"); }}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </MenuItem>

                <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/tasks"); }}>
                  <ListItemIcon>
                    <ViewKanbanIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Kanban Board" />
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main App Content Container */}
      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          pt: { xs: 3, sm: 4 },
          pb: { xs: 4, sm: 6 },
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

export default AppLayout;
