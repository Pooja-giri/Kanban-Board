import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

import { logout } from "../../redux/slices/authSlice";

function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
          >
            Kanban Board
          </Typography>

          <Button
            component={Link}
            to="/dashboard"
            color="inherit"
          >
            Dashboard
          </Button>

          <Button
            component={Link}
            to="/tasks"
            color="inherit"
          >
            Tasks
          </Button>

          <Typography sx={{ marginLeft: 2 }}>
            {user?.username}
          </Typography>

          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ marginLeft: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="xl"
        sx={{ paddingTop: 4, paddingBottom: 4 }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

export default AppLayout;