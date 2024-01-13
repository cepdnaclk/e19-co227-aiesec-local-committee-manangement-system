import React, { useState, useContext } from "react";
import { Outlet, Navigate, Routes, Route, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Dashboard from "./Dashboard";
import NotFound from "../NotFound";
const FNLMenu = () => {
  const { privileges } = useContext(UserContext);
  const { isFNLAdmin, isFNLUser } = privileges;

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  if (!isFNLUser) return null;

  return (
    <>
      <Button
        id="FNL-menu-button"
        onClick={handleMenuClick}
        aria-controls={menuOpen ? "FNL-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
      >
        FNL
      </Button>
      <Menu
        id="FN-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        aria-labelledby="FN-menu-button"
      >
        <MenuItem onClick={handleMenuClose} component={Link} to="/fnl/">
          Dashboard
        </MenuItem>
      </Menu>
    </>
  );
};

const FNLPanel = () => {
  const { privileges } = useContext(UserContext);
  const { isFNLUser } = privileges;

  if (!isFNLUser) return null;

  return (
    <>
      <Routes>
        <Route element={<FNLRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

const FNLRoute = () => {
  const { privileges } = useContext(UserContext);
  const { isFNLUser } = privileges;

  if (!isFNLUser) return <Navigate to="/login" />;

  return <Outlet />;
};

const FNLAdminRoute = () => {
  const { privileges } = useContext(UserContext);
  const { isFNLAdmin } = privileges;

  if (!isFNLAdmin) return <Navigate to="/login" />;

  return <Outlet />;
};

export { FNLMenu, FNLPanel };
