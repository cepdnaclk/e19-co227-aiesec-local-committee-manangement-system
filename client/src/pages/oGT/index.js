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
import NotFound from "../NotFound";
import Dashboard from "./Dashboard";
import ApplicantList from "./Applicants/ApplicantList";
import Applicant from "./Applicants/Applicant";
import EmailClient from "./Applicants/EmailClient";
import EmailList from "../Emails/EmailList";
import Email from "../Emails/Email";

const OGTMenu = () => {
  const { privileges } = useContext(UserContext);
  const { isOGTAdmin, isOGTUser } = privileges;

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  if (!isOGTUser) return null;

  return (
    <>
      <Button
        id="oGT-menu-button"
        onClick={handleMenuClick}
        aria-controls={menuOpen ? "oGT-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
      >
        oGT
      </Button>
      <Menu
        id="oGT-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        aria-labelledby="oGT-menu-button"
      >
        <MenuItem onClick={handleMenuClose} component={Link} to="/ogv/">
          Dashboard
        </MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          component={Link}
          to="/ogv/applicants"
        >
          Applicants
        </MenuItem>
        {isOGTAdmin ? (
          <MenuItem onClick={handleMenuClose} component={Link} to="/ogv/emails">
            Emails
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
};

const OGTPanel = () => {
  const { privileges } = useContext(UserContext);
  const { isOGTUser } = privileges;

  if (!isOGTUser) return null;

  return (
    <>
      <Routes>
        <Route element={<OGTRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="applicants">
            <Route index element={<ApplicantList />} />
            <Route element={<OGTAdminRoute />}>
              <Route path="new" element={<Applicant mode="new" />} />
            </Route>
            <Route path="edit/:id" element={<Applicant mode="edit" />} />
            <Route path="view/:id/*" element={<ApplicantPanel />} />
          </Route>
          <Route element={<OGTAdminRoute />}>
            <Route path="emails">
              <Route index element={<EmailList officeId="oGT" />} />
              <Route path="new" element={<Email officeId="oGT" mode="new" />} />
              <Route
                path="edit/:id"
                element={<Email officeId="oGT" mode="edit" />}
              />
              <Route
                path="view/:id"
                element={<Email officeId="oGT" mode="view" />}
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

const OGTRoute = () => {
  const { privileges } = useContext(UserContext);
  const { isOGTUser } = privileges;

  if (!isOGTUser) return <Navigate to="/login" />;

  return <Outlet />;
};

const OGTAdminRoute = () => {
  const { privileges } = useContext(UserContext);
  const { isOGTAdmin } = privileges;

  if (!isOGTAdmin) return <Navigate to="/login" />;

  return <Outlet />;
};

const ApplicantPanel = () => {
  const navigate = useNavigate();
  let location = useLocation();
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          onClick={() => {
            navigate(`/ogv/applicants`);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          // path: /ogv/applicants/view/:appId/<applicant | emails>/...
          value={location.pathname.split("/")[5]}
          aria-label="ogv-applicant-tabs"
        >
          <Tab
            id="applicant-tab"
            label="Applicant"
            value="applicant"
            component={Link}
            to="applicant"
          />
          <Tab
            id="emails-tab"
            label="Emails"
            value="emails"
            component={Link}
            to="emails"
          />
        </Tabs>
      </Box>
      <Box sx={{ pt: 2 }}>
        <Routes>
          <Route element={<OGTRoute />}>
            <Route path="applicant" element={<Applicant mode="view" />} />
            <Route path="emails" element={<EmailClient />} />
          </Route>
        </Routes>
      </Box>
    </Box>
  );
};

export { OGTMenu, OGTPanel };
