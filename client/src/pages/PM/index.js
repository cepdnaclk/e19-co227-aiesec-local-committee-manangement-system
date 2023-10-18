import React, { useState, useContext } from "react";
import {
  Outlet,
  Navigate,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import BadgeGallery from "./Badges/BadgeGallery";
import Dashboard from "./Dashboard";
import NotFound from "../NotFound";
const PMMenu = () => {
  const { privileges } = useContext(UserContext);
  const { isPMAdmin, isPMUser } = privileges;

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  if (!isPMUser) return null;

  return (
    <>
      <Button
        id="PM-menu-button"
        onClick={handleMenuClick}
        aria-controls={menuOpen ? "PM-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
      >
        PM
      </Button>
      <Menu
        id="PM-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        aria-labelledby="PM-menu-button"
      >
        <MenuItem onClick={handleMenuClose} component={Link} to="/pm/">
          Dashboard
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to="/pm/badges">
          Badges
        </MenuItem>
      </Menu>
    </>
  );
};

const PMPanel = () => {
  const { privileges } = useContext(UserContext);
  const { isIGVUser } = privileges;

  if (!isIGVUser) return null;

  return (
    <>
      <Routes>
        <Route element={<PMRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="badges">
            <Route index element={<BadgeGallery />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

const PMRoute = () => {
  const { privileges } = useContext(UserContext);
  const { isPMUser } = privileges;

  if (!isPMUser) return <Navigate to="/login" />;

  return <Outlet />;
};

const PMAdminRoute = () => {
  const { privileges } = useContext(UserContext);
  const { isPMAdmin } = privileges;

  if (!isPMAdmin) return <Navigate to="/login" />;

  return <Outlet />;
};

export { PMMenu, PMPanel };
