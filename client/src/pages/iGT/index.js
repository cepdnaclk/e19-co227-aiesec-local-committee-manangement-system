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

const IGTMenu = () => {
  const { privileges } = useContext(UserContext);
  const { isIGTAdmin, isIGTUser } = privileges;

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  if (!isIGTUser) return null;

  return (
    <>
      <Button
        id="iGT-menu-button"
        onClick={handleMenuClick}
        aria-controls={menuOpen ? "iGT-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
      >
        iGT
      </Button>
      <Menu
        id="iGT-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        aria-labelledby="iGT-menu-button"
      >
        <MenuItem onClick={handleMenuClose} component={Link} to="/igt/">
          Dashboard
        </MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          component={Link}
          to="/igt/applicants"
        >
          Applicants
        </MenuItem>
        {isIGTAdmin ? (
          <MenuItem onClick={handleMenuClose} component={Link} to="/igt/emails">
            Emails
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
};

const IGTPanel = () => {
  const { privileges } = useContext(UserContext);
  const { isIGTUser } = privileges;

  if (!isIGTUser) return null;

  return (
    <>
      <Routes>
        <Route element={<IGTRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="applicants">
            <Route index element={<ApplicantList />} />
            <Route element={<IGTAdminRoute />}>
              <Route path="new" element={<Applicant mode="new" />} />
            </Route>
            <Route path="edit/:id" element={<Applicant mode="edit" />} />
            <Route path="view/:id/*" element={<ApplicantPanel />} />
          </Route>
          <Route element={<IGTAdminRoute />}>
            <Route path="emails">
              <Route index element={<EmailList officeId="iGT" />} />
              <Route path="new" element={<Email officeId="iGT" mode="new" />} />
              <Route
                path="edit/:id"
                element={<Email officeId="iGT" mode="edit" />}
              />
              <Route
                path="view/:id"
                element={<Email officeId="iGT" mode="view" />}
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

const IGTRoute = () => {
  const { privileges } = useContext(UserContext);
  const { isIGTUser } = privileges;

  if (!isIGTUser) return <Navigate to="/login" />;

  return <Outlet />;
};

const IGTAdminRoute = () => {
  const { privileges } = useContext(UserContext);
  const { isIGTAdmin } = privileges;

  if (!isIGTAdmin) return <Navigate to="/login" />;

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
            navigate(`/igt/applicants`);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          // path: /igt/applicants/view/:appId/<applicant | emails>/...
          value={location.pathname.split("/")[5]}
          aria-label="igt-applicant-tabs"
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
          <Route element={<IGTRoute />}>
            <Route path="applicant" element={<Applicant mode="view" />} />
            <Route path="emails" element={<EmailClient />} />
          </Route>
        </Routes>
      </Box>
    </Box>
  );
};

export { IGTMenu, IGTPanel };
