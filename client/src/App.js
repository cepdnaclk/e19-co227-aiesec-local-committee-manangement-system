import Login from "./pages/Login/Login";
import MemberView from "./pages/Member/MemberView";
import ProjectView from "./pages/Project/ProjectView";

import { UserContext } from "./context/UserContext";

import { Routes, Route, Link } from "react-router-dom";
import ProtectedRoutes from "./utils/ProtectedRoutes";

import { useContext, useState, useMemo } from "react";

import {
  Box,
  AppBar,
  Stack,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
  ScopedCssBaseline,
  Paper,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import AdminRoutes from "./utils/AdminRoutes";
import Terms from "./pages/Terms/Terms";

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const { user } = useContext(UserContext);

  const [prefersDarkMode, setPrefersDarkMode] = useState(true);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          // primary: { main: "#037ef3" },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: "#6b6b6b #2b2b2b",
                "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                  // backgroundColor: "#2b2b2b",
                  backgroundColor: "rgba(0,0,0,0)",
                },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                  borderRadius: 24,
                  backgroundColor: "#B5B5B5",
                  minHeight: 24,
                  // border: "3px solid #2b2b2b",
                },
                "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
                  {
                    backgroundColor: "#959595",
                  },
                "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
                  {
                    backgroundColor: "#959595",
                  },
                "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
                  {
                    backgroundColor: "#959595",
                  },
                "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                  backgroundColor: "#2b2b2b",
                },
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Box component="nav" sx={{ m: 2 }}>
          <AppBar
            position="static"
            color="inherit"
            sx={{ borderRadius: "10px" }}
          >
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Title
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button component={Link} to="/" variant="text" disableElevation>
                  Home
                </Button>
                <Button
                  component={Link}
                  to="/users"
                  variant="text"
                  disableElevation
                >
                  Users
                </Button>
                <Button
                  component={Link}
                  to="/projects"
                  variant="text"
                  disableElevation
                >
                  Projects
                </Button>
                <Button
                  component={Link}
                  to="/terms"
                  variant="text"
                  disableElevation
                >
                  Terms
                </Button>
                {/* Selectively render login or profile dashboard */}
                {user ? (
                  <Button
                    id="profile-button"
                    onClick={handleProfileMenuClick}
                    aria-controls={open ? "profile-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    Hey {user.email}
                  </Button>
                ) : (
                  <Button
                    component={Link}
                    to="/login"
                    variant="text"
                    disableElevation
                  >
                    Login
                  </Button>
                )}
              </Stack>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleProfileMenuClose}
                aria-labelledby="profile-buttin"
              >
                <MenuItem onClick={handleProfileMenuClose}>My Profile</MenuItem>
                <MenuItem
                  onClick={handleProfileMenuClose}
                  component={Link}
                  to="/login"
                >
                  Logout
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    control={
                      <Switch
                        color="primary"
                        checked={prefersDarkMode}
                        onChange={() => {
                          setPrefersDarkMode(!prefersDarkMode);
                        }}
                      />
                    }
                    label="Dark Mode"
                    labelPlacement="start"
                  />
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
        </Box>
        <Box component="main" sx={{ m: 2 }}>
          <Paper sx={{ p: 0.5, borderRadius: "10px" }}>
            <Routes>
              <Route element={<ProtectedRoutes />}>
                <Route path="/users" element={<MemberView />} />
                <Route path="/projects" element={<ProjectView />} />
                <Route path="/terms" element={<Terms />} />
              </Route>
              <Route element={<AdminRoutes />}></Route>
              <Route path="/" element={<h1>{"Home"}</h1>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Paper>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
