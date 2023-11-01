import Login from "./pages/Login/Login";
import MemberView from "./pages/Member/MemberView";
import { UserContext } from "./context/UserContext";

import { Routes, Route, Link } from "react-router-dom";
import ProtectedRoutes from "./utils/ProtectedRoutes";

import React, { useContext, useState, useMemo } from "react";

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
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { IGVMenu, IGVPanel } from "./pages/iGV";
import { OGVMenu, OGVPanel } from "./pages/oGV";
import { OGTMenu, OGTPanel } from "./pages/oGT";
import { PMMenu, PMPanel } from "./pages/PM";
import { FNLMenu, FNLPanel } from "./pages/FNL";
import NotFound from "./pages/NotFound";
import AdminRoutes from "./utils/AdminRoutes";
import Terms from "./pages/Terms";
import Home from "./pages/Home/Home";

import DarkLogo from "./assets/White-Black-Logo.png";
import LightLogo from "./assets/Black-Logo.png";
import BlueLogo from "./assets/Blue-Logo.png";
import MemberProfileMaster from "./pages/Member/MemberProfileMaster";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import { NotificationBar } from "./context/NotificationContext";

const NavbarButton = ({ href, label }) => {
  return (
    <Button component={Link} to={href} variant="text" disableElevation>
      {label}
    </Button>
  );
};

function App() {
  const snackbarIdleState = { open: false, message: "", severity: "info" };
  const [snackbarState, setSnackbarState] = useState(snackbarIdleState);
  const modalIdleState = { open: false, mode: "" };
  // member profile form visibility
  const [modalState, setModalState] = useState(modalIdleState);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleProfileMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const adminOpen = Boolean(adminAnchorEl);
  const handleAdminMenuClick = (event) => {
    setAdminAnchorEl(event.currentTarget);
  };
  const handleAdminMenuClose = () => {
    setAdminAnchorEl(null);
  };

  const { user } = useContext(UserContext);

  const [prefersDarkMode, setPrefersDarkMode] = useState(true);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: { main: "#037ef3" },
          // navButton: {
          //   main: "#E3D026",
          //   light: "#E9DB5D",
          //   dark: "#A29415",
          //   contrastText: "#242105",
          // },
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
              input: {
                // match calender picker indicator and popup to the current theme
                colorScheme: prefersDarkMode ? "dark" : "light",
                // "&::-webkit-calendar-picker-indicator": {
                // },
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  // return <div>Hello</div>;

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
              <Box
                component="img"
                // src={prefersDarkMode ? DarkLogo : LightLogo}
                src={BlueLogo}
                sx={{ maxWidth: "200px" }}
              />
              {/* the empty typography component will grow pushing the stack to the right */}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {/* AIESEC in Kandy - LC Management System */}
              </Typography>
              {/* <IconButton edge="start" disabled={true}>
                <Box
                  component="img"
                  src={Logo}
                  sx={{ maxWidth: "200px"}}
                />
              </IconButton> */}
              <Stack direction="row" spacing={2}>
                <IGVMenu />
                <OGVMenu />
                <OGTMenu />
                <PMMenu />
                <FNLMenu />
                {/* <NavbarButton href="/" label="iGT" /> */}
                {/* <NavbarButton href="/" label="oGT" /> */}
                {user ? (
                  <>
                    <NavbarButton href="/" label="Home" />
                  </>
                ) : null}
                {/* ~~~~~~~~~~~~~~~ Admin ~~~~~~~~~~~~~~~*/}
                {user?.roleId === "LCP" || user?.roleId === "LCVP" ? (
                  <Button
                    id="admin-button"
                    onClick={handleAdminMenuClick}
                    aria-controls={adminOpen ? "admin-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={adminOpen ? "true" : undefined}
                  >
                    Admin
                  </Button>
                ) : null}
                {user ? (
                  <Button
                    id="profile-button"
                    onClick={handleProfileMenuClick}
                    aria-controls={menuOpen ? "profile-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? "true" : undefined}
                  >
                    Hey {user?.preferredName}
                  </Button>
                ) : (
                  <Button
                    // color="navButton"
                    component={Link}
                    to="/login"
                    variant="text"
                    disableElevation
                  >
                    Login
                  </Button>
                )}
                {/* </Stack> */}
                <Menu
                  id="profile-menu"
                  anchorEl={menuAnchorEl}
                  open={menuOpen}
                  onClose={handleProfileMenuClose}
                  aria-labelledby="profile-button"
                  // sx={{
                  //   marginTop: "10px",
                  //   borderRadius: 10,
                  //   p: 5,
                  // }}
                >
                  <MenuItem
                    // onClick={handleProfileMenuClose}
                    // component={Link}
                    onClick={() =>
                      setModalState({ open: true, mode: "user-view" })
                    }
                    // to="/profile"
                  >
                    My Profile
                  </MenuItem>
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
                {user?.roleId === "LCP" || user?.roleId === "LCVP" ? (
                  <Menu
                    id="admin-menu"
                    anchorEl={adminAnchorEl}
                    open={adminOpen}
                    onClose={handleAdminMenuClose}
                    aria-labelledby="admin-button"
                    // sx={{
                    //   marginTop: "10px",
                    //   borderRadius: 10,
                    //   p: 5,
                    // }}
                  >
                    <MenuItem
                      onClick={handleAdminMenuClose}
                      component={Link}
                      to="/terms"
                    >
                      Terms
                    </MenuItem>
                    <MenuItem
                      onClick={handleAdminMenuClose}
                      component={Link}
                      to="/users"
                    >
                      Users
                    </MenuItem>
                  </Menu>
                ) : null}
              </Stack>
            </Toolbar>
          </AppBar>
        </Box>
        {/* <Box component="main" sx={{ m: 2 }}> */}
        <Paper component="main" sx={{ m: 2, p: 2, borderRadius: "10px" }}>
          {/* <IGVRoutes /> */}
          <Routes>
            <Route path="/igv/*" element={<IGVPanel />} />
            <Route path="/pm/*" element={<PMPanel />} />
            <Route path="/ogv/*" element={<OGVPanel />} />
            <Route path="/ogt/*" element={<OGTPanel />} />
            <Route path="/fnl/*" element={<FNLPanel />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/users" element={<MemberView />} />
              <Route path="/terms" element={<Terms />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Paper>
        {/* </Box> */}
        <Dialog open={modalState.open} fullWidth maxWidth="md">
          <DialogContent dividers>
            <Box>
              <Box textAlign="right" sx={{ m: 1, width: "100%" }}>
                {modalState.mode === "user-view" ? (
                  <IconButton
                    onClick={() => {
                      setModalState({
                        open: true,
                        mode: "user-edit",
                      });
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                ) : null}
                <IconButton
                  onClick={() => {
                    setModalState(modalIdleState);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <MemberProfileMaster
              setSnackbarState={setSnackbarState}
              formState={modalState}
              setFormState={setModalState}
              formIdleState={modalIdleState}
              refreshParent={() => {}}
              focusItemId={user?.id}
            />
          </DialogContent>
        </Dialog>
        <NotificationBar />
      </div>
    </ThemeProvider>
  );
}

export default App;
