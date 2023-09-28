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
import ProjectList from "./Projects/ProjectList";
import Project from "./Projects/Project";
import SlotList from "./Slots/SlotList";
import Slot from "./Slots/Slot";
import QuestionList from "./Questions/QuestionList";
import ApplicationList from "./Applications/ApplicationList";
import Application from "./Applications/Application";
import NotFound from "../NotFound";
import Dashboard from "./Dashboard";
import InterviewLog from "./Applications/InterviewLog";
import MailClient from "../Mail/MailClient";

const IGVMenu = () => {
  const { user } = useContext(UserContext);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  if (!user || (user.frontOfficeId !== "iGV" && user.frontOfficeId !== "LCP"))
    return null;

  return (
    <>
      <Button
        id="iGV-menu-button"
        onClick={handleMenuClick}
        aria-controls={menuOpen ? "iGV-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
      >
        iGV
      </Button>
      <Menu
        id="iGV-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        aria-labelledby="iGV-menu-button"
      >
        <MenuItem onClick={handleMenuClose} component={Link} to="/igv/projects">
          Projects
        </MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          component={Link}
          to="/igv/applications"
        >
          Applications
        </MenuItem>
      </Menu>
    </>
  );
};

const IGVRoutes = () => {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      {user.frontOfficeId === "iGV" ? (
        <Route index element={<Dashboard />} />
      ) : null}
      <Route path="/igv" element={<IGVRoute />}>
        <Route path="projects">
          <Route index element={<ProjectList />} />
          {user.roleId === "LCP" || user.roleId === "LCVP" ? (
            <>
              <Route path="new" element={<Project mode="new" />} />
              <Route path="edit/:expaId" element={<Project mode="edit" />} />
            </>
          ) : null}
          {/* <Route path="view/:expaId*" element={<ProjectPanel />} /> */}
          <Route path="view/:expaId/*" element={<ProjectPanel />} />
        </Route>
        <Route path="applications">
          <Route index element={<ApplicationList />} />
          {user.roleId === "LCP" || user.roleId === "LCVP" ? (
            <Route path="new" element={<Application mode="new" />} />
          ) : null}
          <Route path="edit/:appId" element={<Application mode="edit" />} />
          <Route path="view/:appId/*" element={<ApplicationPanel />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const IGVRoute = () => {
  const { user } = useContext(UserContext);

  if (!user || (user.frontOfficeId !== "iGV" && user.frontOfficeId !== "LCP"))
    return <Navigate to="/login" />;

  return <Outlet />;
};

const ProjectPanel = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  let location = useLocation();
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          onClick={() => {
            navigate(`/igv/projects`);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          // path: /igv/projects/view/:expaId/<project | slots | questions>/...
          value={location.pathname.split("/")[5]}
          aria-label="igv-project-tabs"
        >
          <Tab
            id="project-tab"
            label="Project"
            value="project"
            component={Link}
            to="project"
          />
          <Tab
            id="slots-tab"
            label="Slots"
            value="slots"
            component={Link}
            to="slots"
          />
          <Tab
            id="questions-tab"
            label="Questions"
            value="questions"
            component={Link}
            to="questions"
          />
        </Tabs>
      </Box>
      <Box sx={{ pt: 2 }}>
        <Routes>
          <Route path="project" element={<Project mode="view" />} />
          <Route path="slots">
            <Route index element={<SlotList />} />
            {user.roleId === "LCP" || user.roleId === "LCVP" ? (
              <>
                <Route path="new" element={<Slot mode="new" />} />
                <Route path="edit/:slotId" element={<Slot mode="edit" />} />
              </>
            ) : null}
            <Route path="view/:slotId" element={<Slot mode="view" />} />
          </Route>
          <Route path="questions" element={<QuestionList />} />
        </Routes>
      </Box>
    </Box>
  );
};

const ApplicationPanel = () => {
  const navigate = useNavigate();
  let location = useLocation();
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          onClick={() => {
            navigate(`/igv/applications`);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          // path: /igv/applications/view/:appId/<application | interview_log | emails>/...
          value={location.pathname.split("/")[5]}
          aria-label="igv-application-tabs"
        >
          <Tab
            id="application-tab"
            label="Application"
            value="application"
            component={Link}
            to="application"
          />
          <Tab
            id="interview-log-tab"
            label="Interview Log"
            value="interview_log"
            component={Link}
            to="interview_log"
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
          <Route path="application" element={<Application mode="view" />} />
          <Route path="interview_log" element={<InterviewLog />} />
          <Route path="emails" element={<MailClient />} />
        </Routes>
      </Box>
    </Box>
  );
};

export { IGVMenu, IGVRoutes };
